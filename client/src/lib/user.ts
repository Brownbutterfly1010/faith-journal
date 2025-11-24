import { v4 as uuidv4 } from 'crypto-js';

const USER_ID_KEY = 'faith_journal_user_id';

export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}
