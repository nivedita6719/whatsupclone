const express = require("express");
const fs = require("fs");
const path = require("path");
const ProcessedMessage = require("../models/ProcessedMessage");
const { extractMessages, extractStatuses } = require("../utils/waParser");

const router = express.Router();

router.post("/load-samples", async (req, res) => {
  const dir = path.join(__dirname, "../payloads");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  let inserted = 0, updated = 0;

  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const msgs = extractMessages(data);
    for (const m of msgs) {
      await ProcessedMessage.updateOne(
        { $or: [{ msg_id: m.msg_id }, { meta_msg_id: m.meta_msg_id }] },
        { $setOnInsert: m },
        { upsert: true }
      );
      inserted++;
    }
    const stats = extractStatuses(data);
    for (const s of stats) {
      const set = { status: s.status };
      set[`status_timestamps.${s.status}`] = s.timestamp;
      const resu = await ProcessedMessage.updateMany(
        { $or: [{ msg_id: s.id }, { meta_msg_id: s.id }] },
        { $set: set }
      );
      updated += resu.modifiedCount || 0;
    }
  }
  res.json({ inserted, updated });
});

module.exports = router;
