const mongoose = require("mongoose");

const ProcessedMessageSchema = new mongoose.Schema({
  msg_id: String,
  meta_msg_id: String,
  wa_id: String,
  name: String,
  direction: String,
  type: String,
  text: String,
  media: Object,
  timestamp: Date,
  status: { type: String, enum: ["sent", "delivered", "read", "received"], default: "sent" },
  status_timestamps: {
    sent: Date,
    delivered: Date,
    read: Date,
    received: Date
  },
  raw: Object
});



module.exports = mongoose.model("ProcessedMessage", ProcessedMessageSchema, "processed_messages");
