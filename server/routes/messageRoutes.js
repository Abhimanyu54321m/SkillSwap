const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const isAuth = require("../middleware/isAuth");

router.get("/:roomId", isAuth, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;