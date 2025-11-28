import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate permissions
  },
  description: {
    type: String,
  }
});

export const Permission = mongoose.model("Permission", permissionSchema);
