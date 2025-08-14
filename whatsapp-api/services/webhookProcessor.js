
const ProcessedMessage = require("../models/ProcessedMessage");
const fs = require("fs");
const path = require("path");

const processPayloads = async () => {
  try {
    const payloadsDir = path.join(__dirname, "../sample_payloads");

    if (!fs.existsSync(payloadsDir)) {
      console.log("⚠ No sample_payloads folder found, skipping processing.");
      return;
    }

    const files = fs.readdirSync(payloadsDir);
    console.log("📂 Found payload files:", files);

    if (!files.length) {
      console.log("⚠ No payload files found in sample_payloads.");
      return;
    }

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      console.log(`📄 Processing file: ${file}`);
      const payload = JSON.parse(fs.readFileSync(path.join(payloadsDir, file), "utf8"));

      // Navigate to nested messages
      const changes = payload.metaData?.entry?.[0]?.changes || [];
      for (const change of changes) {
        const value = change.value || {};
        const contacts = value.contacts || [];
        const name = contacts[0]?.profile?.name || null;
        const wa_id = contacts[0]?.wa_id || null;

        // Messages array
        if (value.messages) {
          for (const msg of value.messages) {
            console.log("💬 Inserting message:", msg.id, msg.text?.body || "[no text]");
            await ProcessedMessage.updateOne(
              { msg_id: msg.id },
              {
                $set: {
                  msg_id: msg.id,
                  meta_msg_id: null,
                  wa_id: wa_id || msg.from,
                  name,
                  direction: "inbound",
                  type: msg.type,
                  text: msg.text?.body || null,
                  timestamp: msg.timestamp
                    ? new Date(parseInt(msg.timestamp) * 1000)
                    : new Date(),
                  status: "received",
                  raw: msg
                }
              },
              { upsert: true }
            );
          }
        }
      }
    }

    console.log("✅ Payloads processed successfully & saved to DB");
  } catch (err) {
    console.error("❌ Error processing payloads:", err);
  }
};

module.exports = processPayloads;
