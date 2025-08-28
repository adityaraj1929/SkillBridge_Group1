const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware"); // if you use JWT auth

// ✅ Send a new message
router.post("/", auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: "Receiver and content are required" });
    }

    const newMessage = new Message({
      sender: req.user.id, // comes from auth middleware
      receiver: receiverId,
      content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ error: "Error sending message" });
  }
});

// ✅ Get messages with a specific user
router.get("/:userId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

module.exports = router;
