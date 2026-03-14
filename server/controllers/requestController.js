const Request = require("../models/Request");
const User = require("../models/User");

const sendRequest = async (req, res) => {
  try {
    const { receiverId, message, skillOffered, skillWanted } = req.body;
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }
    const existing = await Request.findOne({ sender: req.user._id, receiver: receiverId });
    if (existing) return res.status(400).json({ message: "Request already sent" });
    const request = await Request.create({
      sender: req.user._id, receiver: receiverId,
      message: message || "I'd like to connect and exchange skills!",
      skillOffered, skillWanted,
    });
    await request.populate("sender receiver", "name avatar skillsOffered");
    res.status(201).json({ message: "Request sent", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const sent = await Request.find({ sender: req.user._id }).populate("receiver", "name avatar skillsOffered location");
    const received = await Request.find({ receiver: req.user._id }).populate("sender", "name avatar skillsOffered location");
    res.json({ sent, received });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    request.status = status;
    await request.save();
    if (status === "accepted") {
      await User.findByIdAndUpdate(request.sender, { $addToSet: { connections: request.receiver } });
      await User.findByIdAndUpdate(request.receiver, { $addToSet: { connections: request.sender } });
    }
    res.json({ message: "Request updated", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({ _id: req.params.id, sender: req.user._id });
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { sendRequest, getMyRequests, respondToRequest, deleteRequest };