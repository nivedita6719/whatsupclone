require("dotenv").config({ override: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const processPayloads = require("./services/webhookProcessor");
const ProcessedMessage = require("./models/ProcessedMessage");

const app = express();

// ✅ Middlewares
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON requests

// ✅ Process payloads into DB on startup (Task 1)
processPayloads();

// Log MongoDB URI type for debugging
console.log(
  "MONGO_URI scheme:",
  process.env.MONGO_URI?.startsWith("mongodb+srv://") ? "mongodb+srv" : "mongodb"
);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Webhook route
const webhookRouter = require("./routes/webhook");
app.use("/api/webhook", webhookRouter);

/* ----------------------------------------------------------------
   TASK 2: Conversations & Messages APIs
---------------------------------------------------------------- */

// 📌 Get all conversations grouped by wa_id (latest message first)
app.get("/api/conversations", async (req, res) => {
  try {
    const chats = await ProcessedMessage.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          lastMessage: { $first: "$text" },
          lastTimestamp: { $first: "$timestamp" }
        }
      },
      { $sort: { lastTimestamp: -1 } }
    ]);
    res.json(chats);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get all messages for a specific wa_id
app.get("/api/messages/:wa_id", async (req, res) => {
  try {
    const messages = await ProcessedMessage.find({ wa_id: req.params.wa_id })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------------------------
   TASK 3: Send Message API (Demo Only)
---------------------------------------------------------------- */

// 📌 Create & store a new outbound message
app.post("/api/messages/send", async (req, res) => {
  try {
    const { wa_id, text, name } = req.body;

    if (!wa_id || !text) {
      return res.status(400).json({ error: "wa_id and text are required" });
    }

    const newMessage = await ProcessedMessage.create({
      msg_id: `local-${Date.now()}`,
      meta_msg_id: null,
      wa_id,
      name: name || null,
      direction: "outbound",
      type: "text",
      text,
      timestamp: new Date(),
      status: "sent",
      status_timestamps: { sent: new Date() }
    });

    res.json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: err.message });
  }
});
// // POST /messages - Save a new message to DB
// app.post('/messages', async (req, res) => {
//   const newMessage = req.body;

//   try {
//     const result = await collection.insertOne(newMessage);
//     res.status(200).json({
//       success: true,
//       insertedId: result.insertedId,
//     });
//   } catch (error) {
//     console.error('Error saving message:', error);
//     res.status(500).json({ error: 'Failed to save message' });
//   }
// });

/* ----------------------------------------------------------------
   START SERVER
---------------------------------------------------------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});