import "dotenv/config";
import mongoose from "mongoose";
import { Permission } from "../models/permission.js";

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    seedPermissions(); // call seeding only after connection
  })
  .catch(err => console.error("MongoDB connection error:", err));

const seedPermissions = async () => {
  try {
    const permissionsList = [
      { name: "expense:create", description: "Allows creating a new expense" },
      { name: "expense:view:own", description: "View user's own expenses" },
      { name: "expense:view:any", description: "View any user's expenses" },
      { name: "expense:edit:own", description: "Edit user's own expenses" },
      { name: "expense:edit:any", description: "Edit any user's expenses" },
      { name: "expense:delete:own", description: "Delete user's own expenses" },
      { name: "expense:delete:any", description: "Delete any user's expenses" },
      { name: "summary:view:own", description: "View user's own summary" },
      { name: "summary:view:any", description: "View any user's summary" },
      { name: "ai:predict:own", description: "Generate AI prediction for user's own spending" },
      { name: "ai:predict:any", description: "Generate AI prediction for any user's spending" },
      { name: "user:manage", description: "Manage users (admin only)" },
      { name: "category:manage", description: "Manage categories (admin only)" },
    ];

    for (let perm of permissionsList) {
      const exists = await Permission.findOne({ name: perm.name });
      if (!exists) {
        await Permission.create(perm);
        console.log("Inserted:", perm.name);
      } else {
        console.log("Already exists:", perm.name);
      }
    }

    console.log("Permissions seeded!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};
