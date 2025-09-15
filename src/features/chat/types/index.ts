// ========================================
// TYPE DEFINITIONS
// ========================================
// All TypeScript types in one place for easy modification

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export type Language = 'auto' | 'hindi' | 'english';

export interface AppConfig {
  appName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  enableHindi: boolean;
  enableDarkMode: boolean;
}

export interface SessionPage {
  items: ChatSession[];
  nextCursor?: string;
}
