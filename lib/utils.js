// lib/utils.js

// 📌 This function extracts all group admins from the group participants
export function getGroupAdmins(participants) {
  return participants
    .filter(p => p.admin) // Only those marked as 'admin'
    .map(p => p.id)       // Return just their WhatsApp IDs
}
