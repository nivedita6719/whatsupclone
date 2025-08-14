function extractMessages(payload) {
  const out = [];
  const entries = payload.entry || [];
  for (const e of entries) {
    const changes = e.changes || [];
    for (const ch of changes) {
      const val = ch.value || {};
      const contacts = val.contacts?.[0];
      const wa_id = contacts?.wa_id || val.from;
      const name = contacts?.profile?.name;
      if (Array.isArray(val.messages)) {
        for (const m of val.messages) {
          out.push({
            msg_id: m.id,
            meta_msg_id: m.context?.id || null,
            wa_id,
            name,
            direction: "inbound",
            type: m.type || "text",
            text: m.text?.body || "",
            timestamp: new Date(m.timestamp * 1000),
            status: "received",
            status_timestamps: { received: new Date() },
            raw: m
          });
        }
      }
    }
  }
  return out;
}

function extractStatuses(payload) {
  const statuses = [];
  const entries = payload.entry || [];
  for (const e of entries) {
    for (const ch of e.changes || []) {
      const val = ch.value || {};
      if (Array.isArray(val.statuses)) {
        for (const s of val.statuses) {
          statuses.push({
            id: s.id,
            status: s.status,
            timestamp: new Date(s.timestamp * 1000)
          });
        }
      }
    }
  }
  return statuses;
}

module.exports = { extractMessages, extractStatuses };
