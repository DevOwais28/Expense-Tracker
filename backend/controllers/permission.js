import { User } from "./models/user.js";
import { Permission } from "./models/permission.js";   

export const assignPermissions = async (role ,_id) => {
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get all permissions FROM DATABASE
    const allPermissions = await Permission.find().lean();

    if (role === "admin") {
      // Admin gets ALL permission IDs
      user.permissions = allPermissions.map(p => p._id);

    } else if (role === "user") {
      // Normal user gets only ":own" + "expense:create"
      const userPerms = allPermissions.filter(p =>
        p.name.endsWith(":own") || p.name === "expense:create"
      );

      user.permissions = userPerms.map(p => p._id);
    } else {
      throw new Error("Invalid role");
    }

    await user.save();
    return user.permissions;

};
