import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { assignPermissions } from "./permission.js";
import nodemailer from "nodemailer";

// ================= MAIL CONFIG =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ra920453@gmail.com',
    pass: 'rmlk fhyc ezfj weyr'
  },
  debug: true,
  logger: true
});

const secret = "13253mjbnmbcvbnvcxur76547e3";

// =================================================
// CREATE USER
// =================================================
const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: `User already exists against this ${email}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const userObj = {
      name,
      email,
      role,
      password: hashedPassword,
    };

    let newUser = await User.create(userObj);

    return res.send({
      message: `User created successfully`,
      user: userObj,
    });
  } catch (error) {
    return res.status(500).send({
      message: `Error creating user: ${error.message}`,
    });
  }
};

// =================================================
// SIGN IN USER  ✅ FIXED HERE ONLY
// =================================================
const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userobj = await User.findOne({ email });

    // ❌ DO NOT USE 404 FOR AUTH
    // ✅ SAME MESSAGE FOR EMAIL & PASSWORD
    if (!userobj) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatched = await bcrypt.compare(password, userobj.password);

    if (!passwordMatched) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Regenerate session
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ message: "Session error" });
      }

      req.session.userId = userobj._id;
      req.session.email = userobj.email;
      req.session.role = userobj.role;
      req.session.name = userobj.name;
      req.session.avatar = userobj.avatar;

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }

        return res.status(200).json({
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

  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =================================================
// GET ALL USERS
// =================================================
const getAllUsers = async (_, res) => {
  const allUsers = await User.find({});
  return res.send({ allUsers });
};

// =================================================
// FORGOT PASSWORD (UNCHANGED)
// =================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    const crypto = await import("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    res.json({
      message: "If an account with that email exists, a password reset link has been sent."
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =================================================
// RESET PASSWORD (UNCHANGED)
// =================================================
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 5);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =================================================
// UPDATE PROFILE (UNCHANGED)
// =================================================
const updateProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) {
      user.name = req.body.name;
      req.session.name = req.body.name;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createUser,
  signinUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  updateProfile
};
