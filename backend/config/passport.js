import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.js";

console.log("GOOGLE CLIENT:", process.env.GOOGLE_CLIENT_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `expense-tracker-production-d7b0.up.railway.app/api/users/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1️⃣ Check if user already exists
        let user = await User.findOne({ email });

        // 2️⃣ If not, create new one
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            avatar: profile.photos[0].value,
            role: "user",
          });
        }

        // 3️⃣ Log user in
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);   // store user._id in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return done(new Error("User not found"), null);
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Export for ES modules
export default passport;




