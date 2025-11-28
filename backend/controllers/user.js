import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import {User} from "../models/user.js";
import { assignPermissions } from "./permission.js";
const secret = "13253mjbnmbcvbnvcxur76547e3";
// ODM  ===> Object Data Modelling
// ORM  ===> Object Relational Maping

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
        return res.send({
            message: `User already exists against this ${email}`,
        });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userObj = {
        name,
        email,
        role,
        password: hashedPassword,
    };
    let newUser = await  User.create(userObj);
    assignPermissions(newUser.role,newUser._id)
    return res.send({
        message: `User created successfully`,
        user: userObj,
    });
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

    // Store user information in the session
    req.session.userId = userobj._id;
    req.session.email = userobj.email;
    req.session.role = userobj.role;

    return res.status(200).send({
        message: "Login Successful",
    });
};
const getAllUsers = async (_, res) => {
    const allUsers = await User.find({});
    return res.send({
        allUsers,
    });
};

export { createUser, signinUser, getAllUsers, uploadImg };