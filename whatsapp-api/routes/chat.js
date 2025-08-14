const express = require('express');
const router = express.Router();
const ProcessedMessage = require('../models/ProcessedMessage');

// GET all conversations
router.get('/conversations', async (req, res) => {
  try {
    const chats = await ProcessedMessage.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$wa_id',
          name: { $first: '$name' },
          lastMessage: { $first: '$text' },
          lastTimestamp: { $first: '$timestamp' }
        }
      },
      { $sort: { lastTimestamp: -1 } }
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET messages by wa_id
router.get('/messages/:wa_id', async (req, res) => {
  try {
    const messages = await ProcessedMessage.find({ wa_id: req.params.wa_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST send new message
router.post('/send', async (req, res) => {
  try {
    const { wa_id, name, text } = req.body;
    const newMessage = new ProcessedMessage({
      msg_id: Date.now().toString(),
      wa_id,
      name,
      direction: "outbound",
      type: "text",
      text,
      timestamp: new Date(),
      status: "sent",
      raw: {}
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
