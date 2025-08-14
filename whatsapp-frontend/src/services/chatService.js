import api from './api';

// Get all conversations
export async function getConversations() {
  const res = await api.get('/api/conversations');
  return res.data;
}

// Get messages for a specific chat
export async function getMessages(wa_id) {
  const res = await api.get(`/api/messages/${wa_id}`);
  return res.data;
}
