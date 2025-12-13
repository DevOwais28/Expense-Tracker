import { Router } from "express";
import { createUser, signinUser, forgotPassword, resetPassword, updateProfile } from "../controllers/user.js";
import { User } from "../models/user.js";
import passport from "../config/passport.js";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  (req, res) => {
    const role = req.user.role;

    const redirectURL =
      role === "admin"
        ? `${process.env.CLIENT_URL}/admin`
        : `${process.env.CLIENT_URL}/dashboard`;

    res.redirect(redirectURL);
  }
);

// Optional: get current logged-in user
router.get("/auth/user", async (req, res) => {
  console.log('=== AUTH CHECK DEBUG ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  console.log('Cookies:', req.headers.cookie);
  console.log('User ID in session:', req.session.userId);
  console.log('Passport user:', req.session.passport);
  console.log('req.user:', req.user);
  console.log('======================');
  
  // Check if user is authenticated via Passport or manual session
  if (req.user) {
    // Passport has populated req.user via deserializeUser
    res.json({ 
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
        avatar: req.user.avatar
      }
    });
  } else if (req.session && req.session.passport && req.session.passport.user) {
    // Passport session (Google OAuth) - fetch user from database
    try {
      const user = await User.findById(req.session.passport.user).select('-password');
      if (user) {
        res.json({ 
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            avatar: user.avatar
          }
        });
      } else {
        console.log('User not found in database for Passport session');
        res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      console.error('Error fetching user from Passport session:', error);
      res.status(500).json({ message: "Server error" });
    }
  } else if (req.session && req.session.userId) {
    // Manual session authentication
    res.json({ 
      user: {
        id: req.session.userId,
        email: req.session.email,
        role: req.session.role,
        name: req.session.name,
        avatar: req.session.avatar
      }
    });
  } else if (req.session && req.session.passport && req.session.passport.user) {
    // Passport session but req.user not populated - fetch user
    try {
      const { User } = await import("../models/user.js");
      const user = await User.findById(req.session.passport.user);
      if (user) {
        res.json({ 
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            avatar: user.avatar
          }
        });
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(401).json({ message: "Not authenticated" });
    }
  } else {
    console.log('No valid session found');
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Logout
router.get("/auth/logout", (req, res) => {
  console.log('=== LOGOUT DEBUG ===');
  console.log('Session ID before destroy:', req.sessionID);
  console.log('Session data before destroy:', req.session);
  console.log('====================');
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ message: "Error logging out" });
    }
    
    console.log('Session destroyed successfully');
    res.clearCookie("connect.sid");
    console.log('Cookie cleared');
    res.json({ message: "Logged out successfully" });
  });
});
router.post("/signup",createUser)
router.post("/login",signinUser)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.patch("/update-me", updateProfile)

export default router
