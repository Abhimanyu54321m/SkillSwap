const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const { skill, location, minRate, maxRate, search } = req.query;
    const filter = { _id: { $ne: req.user._id } };
    if (skill) filter.skillsOffered = { $in: [new RegExp(skill, "i")] };
    if (location) filter.location = new RegExp(location, "i");
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { skillsOffered: { $in: [new RegExp(search, "i")] } },
        { skillsWanted: { $in: [new RegExp(search, "i")] } },
      ];
    }
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("connections", "name avatar skillsOffered");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, skillsOffered, skillsWanted, hourlyRate, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, skillsOffered, skillsWanted, hourlyRate, avatar },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("connections", "name avatar skillsOffered location isOnline");
    res.json({ connections: user.connections });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getAllUsers, getUserById, updateProfile, getConnections };