// // src/api.js
// export async function getConversations() {
//   const res = await fetch('http://localhost:8080/api/conversations');
//   return res.json();
// }

// export async function getMessages(wa_id) {
//   const res = await fetch(`http://localhost:8080/api/messages/${wa_id}`);
//   return res.json();
// }

// export async function getConversations() {
//   const res = await fetch('http://localhost:8080/conversations');
//   return res.json();
// }

// export async function getMessages(wa_id) {
//   const res = await fetch(`http://localhost:8080/messages/${wa_id}`);
//   return res.json();
// }


// src/api.js

export async function getConversations() {
  const res = await fetch('http://localhost:8080/api/conversations');
  return res.json();
}

export async function getMessages(wa_id) {
  const res = await fetch(`http://localhost:8080/api/messages/${wa_id}`);
  return res.json();
}
