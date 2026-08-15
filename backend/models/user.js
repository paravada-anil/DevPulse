const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    skills: [
      {
        name: {
          type: String,
          required: true,
        },

        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;