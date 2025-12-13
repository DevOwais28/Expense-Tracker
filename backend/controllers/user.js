import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import {User} from "../models/user.js";
import { assignPermissions } from "./permission.js";
import nodemailer from "nodemailer";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ra920453@gmail.com',
    pass: 'rmlk fhyc ezfj weyr' // This should be an App Password from Google
  },
  debug: true, // Enable debug logging
  logger: true  // Enable logger
});

const secret = "13253mjbnmbcvbnvcxur76547e3";
// ODM  ===> Object Data Modelling
// ORM  ===> Object Relational Maping

const createUser = async (req, res) => {
    try {
        console.log('Creating user with data:', req.body);
        const { name, email, password, role = 'user' } = req.body;

        console.log('Checking if user exists...');
        const isUserExist = await User.findOne({ email: email });
        if (isUserExist) {
            console.log('User already exists');
            return res.status(400).json({
                message: `User already exists against this ${email}`,
            });
        }
        
        console.log('Hashing password...');
        const saltRounds = 5; // Reduced from 10 for faster hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        console.log('Creating user object...');
        const userObj = {
            name,
            email,
            role,
            password: hashedPassword,
        };
        
        console.log('Saving user to database...');
        let newUser = await User.create(userObj);
        console.log('User created successfully:', newUser._id);
        
        // assignPermissions(newUser.role,newUser._id) // Temporarily disabled
        return res.send({
            message: `User created successfully`,
            user: userObj,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send({
            message: `Error creating user: ${error.message}`,
        });
    }
};

const uploadImg = async (req, res) => {
    try {
        let imagePath = req.file?.path;
        let url;
        let imageId;
        if (imagePath) {
            const imageUpload = await cloudinary.uploader.upload(imagePath);
            url = imageUpload?.secure_url
            imageId = imageUpload?.public_id
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.id,
            {
                avatarId: imageId,
                avatar: url
            },  // field to update
            { new: true, runValidators: true })  // return updated doc)
        res.json({
            message: "Profile image updated successfully",
            user: updatedUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }

}

const signinUser = async (req, res) => {
    const { email, password } = req.body;
    const userobj = await User.findOne({ email });

    if (!userobj) {
        return res.status(404).send({
            message: `User Not Found`,
        });
    }

    const passwordMatched = await bcrypt.compare(password, userobj.password);
    if (!passwordMatched) {
        return res.status(401).send({
            message: `Invalid Password`,
        });
    }

    // Regenerate session to prevent session fixation
    req.session.regenerate((err) => {
        if (err) {
            console.error('Session regenerate error:', err);
            return res.status(500).send({
                message: `Session error`,
            });
        }
        
        // Store user information in the new session
        req.session.userId = userobj._id;
        req.session.email = userobj.email;
        req.session.role = userobj.role;
        req.session.name = userobj.name;
        req.session.avatar = userobj.avatar;
        
        // Save the session
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send({
                    message: `Session error`,
                });
            }
            
            console.log('Session saved successfully:', req.sessionID);
            return res.status(200).send({
                message: "Login Successful",
                user: {
                    _id: userobj._id,
                    name: userobj.name,
                    email: userobj.email,
                    role: userobj.role,
                    avatar: userobj.avatar
                }
            });
        });
    });
};

const getAllUsers = async (_, res) => {
    const allUsers = await User.find({});
    return res.send({
        allUsers,
    });
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
        }

        // Generate reset token
        const crypto = await import("crypto");
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        console.log('Password reset token for', email, ':', resetToken);
        console.log('Token expires at:', resetTokenExpiry);
        
        // Send password reset email
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: "ra920453@gmail.com",
            to: email,
            subject: `Password Reset Request - ExpenseAI`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1e293b; margin-bottom: 10px;">ExpenseAI</h2>
                        <p style="color: #64748b; font-size: 14px;">Password Reset Request</p>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
                        <h3 style="color: #1e293b; margin-bottom: 15px;">Hello ${user.name},</h3>
                        <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                            We received a request to reset your password for your ExpenseAI account. 
                            Click the button below to reset your password:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" 
                               style="display: inline-block; background: linear-gradient(135deg, #fde047, #34d399); 
                                      color: #1e293b; text-decoration: none; padding: 12px 30px; 
                                      border-radius: 25px; font-weight: 600; font-size: 16px;">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                            This link will expire in 10 minutes for security reasons.
                        </p>
                    </div>
                    
                    <div style="text-align: center; color: #94a3b8; font-size: 12px;">
                        <p style="margin-bottom: 10px;">
                            If you didn't request this password reset, you can safely ignore this email.
                        </p>
                        <p>
                            Your password will remain unchanged and your account will stay secure.
                        </p>
                    </div>
                    
                    <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center;">
                        <p style="color: #94a3b8; font-size: 12px;">
                            2024 ExpenseAI. All rights reserved.
                        </p>
                    </div>
                </div>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Password reset email sent: ' + info.response);
            
            res.json({ 
                message: "If an account with that email exists, a password reset link has been sent.",
                // For development only - remove in production
                resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
            });
        } catch (emailError) {
            console.error('Error sending password reset email:', emailError);
            // Still return success to user for security, but log the error
            res.json({ 
                message: "If an account with that email exists, a password reset link has been sent.",
                resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        const bcrypt = await import("bcrypt");
        const saltRounds = 5;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        
        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        console.log('Update request received:', req.body);
        console.log('File:', req.file);
        
        // Find the user by session ID
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        if (req.body.name) {
            user.name = req.body.name;
            req.session.name = req.body.name;
        }

        if (req.body.currentPassword && req.body.newPassword) {
            const bcrypt = await import("bcrypt");
            const passwordMatched = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!passwordMatched) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            const saltRounds = 5;
            user.password = await bcrypt.hash(req.body.newPassword, saltRounds);
        }

        // Handle avatar upload if file exists
        if (req.file) {
            try {
                // Import Cloudinary
                const { v2: cloudinary } = await import("cloudinary");
                
                // Upload to Cloudinary
                const imageUpload = await cloudinary.uploader.upload(req.file.path);
                
                user.avatar = imageUpload.secure_url;
                user.avatarId = imageUpload.public_id;
                req.session.avatar = user.avatar;
                
                console.log('Cloudinary upload successful:', imageUpload.secure_url);
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError);
                return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
            }
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: "Server error" });
    }
};

export { createUser, signinUser, getAllUsers, uploadImg, forgotPassword, resetPassword, updateProfile };