const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// ================================
// REGISTER
// ================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      bio: "",
      skills: [],
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error.message);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});


// ================================
// LOGIN
// ================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
});


// ================================
// GET CURRENT USER
// ================================

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    console.log("ME ERROR:", error.message);

    res.status(401).json({
      message: "Invalid token",
    });
  }
});


// ================================
// ADD / UPDATE SKILL
// ================================

router.post("/skills", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const skillName = String(
      req.body.skill || ""
    ).trim();

    let skillProgress = Number(
      req.body.progress
    );

    if (!skillName) {
      return res.status(400).json({
        message: "Skill name is required",
      });
    }

    if (Number.isNaN(skillProgress)) {
      skillProgress = 0;
    }

    skillProgress = Math.max(
      0,
      Math.min(100, skillProgress)
    );

    const existingSkill = user.skills.find(
      (item) =>
        item.name.toLowerCase() ===
        skillName.toLowerCase()
    );

    if (existingSkill) {
      existingSkill.progress = skillProgress;
    } else {
      user.skills.push({
        name: skillName,
        progress: skillProgress,
      });
    }

    await user.save();

    res.json({
      message: "Skill added successfully",
      skills: user.skills,
    });

  } catch (error) {
    console.log(
      "ADD SKILL ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Failed to add skill",
    });
  }
});


// ================================
// REMOVE SKILL
// ================================

router.delete(
  "/skills/:skillName",
  async (req, res) => {
    try {
      const authHeader =
        req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          message: "No token provided",
        });
      }

      const token =
        authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(
        decoded.userId
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const skillName = decodeURIComponent(
        req.params.skillName
      );

      user.skills = user.skills.filter(
        (item) =>
          item.name.toLowerCase() !==
          skillName.toLowerCase()
      );

      await user.save();

      res.json({
        message: "Skill removed successfully",
        skills: user.skills,
      });

    } catch (error) {
      console.log(
        "REMOVE SKILL ERROR:",
        error.message
      );

      res.status(500).json({
        message: "Failed to remove skill",
      });
    }
  }
);


// ================================
// UPDATE BIO
// ================================

router.put("/bio", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.bio = String(
      req.body.bio || ""
    ).trim();

    await user.save();

    res.json({
      message: "Bio updated successfully",
      bio: user.bio,
    });

  } catch (error) {
    console.log(
      "BIO ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update bio",
    });
  }
});


module.exports = router;