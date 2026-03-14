const User = require("../models/User");
const { generateToken } = require("../utils/token");

const register = async (req, res) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted, bio, location, hourlyRate } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
      bio: bio || "",
      location: location || "",
      hourlyRate: hourlyRate || 0,
    });

    const token = generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "Registration successful",
      token,
      user: userObj,
    });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err.message);
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: "Login successful",
      token,
      user: userObj,
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error("❌ GETME ERROR:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login, getMe };