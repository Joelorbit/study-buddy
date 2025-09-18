export enum AppView {
  TIMER = 'TIMER',
  STREAK = 'STREAK',
  CHAT = 'CHAT',
  EXAM_PREP = 'EXAM_PREP',
}

export enum TimerMode {
  WORK = 'WORK',
  BREAK = 'BREAK',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Session {
  user: User;
}