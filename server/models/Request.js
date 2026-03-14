const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "I'd like to connect and exchange skills with you!" },
    skillOffered: { type: String, required: true },
    skillWanted: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

requestSchema.index({ sender: 1, receiver: 1 }, { unique: true });
module.exports = mongoose.model("Request", requestSchema);