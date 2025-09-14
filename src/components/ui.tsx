// ========================================
// REUSABLE UI COMPONENTS
// ========================================
// Easy to modify and customize

import React from 'react';
import { Language } from '../types';

// Language Toggle Component
export const LanguageToggle: React.FC<{
  language: Language;
  onLanguageChange: (lang: Language) => void;
}> = ({ language, onLanguageChange }) => (
  <div className="flex items-center space-x-2">
    <span className="text-sm text-slate-500 dark:text-slate-400">Language:</span>
    <select
      value={language}
      onChange={(e) => onLanguageChange(e.target.value as Language)}
      className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus-ring"
    >
      <option value="auto">Auto</option>
      <option value="hindi">हिंदी</option>
      <option value="english">English</option>
    </select>
  </div>
);

// Chat Message Component
export const ChatMessage: React.FC<{
  message: { role: string; content: string; createdAt: Date };
  isHydrated: boolean;
  formatTime: (date: Date) => string;
}> = ({ message, isHydrated, formatTime }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
    <div className={`max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
      message.role === 'user' 
        ? 'message-user' 
        : 'message-assistant'
    }`}>
      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
      <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
        {isHydrated ? formatTime(message.createdAt) : "Loading..."}
      </div>
    </div>
  </div>
);

// Session Item Component
export const SessionItem: React.FC<{
  session: { id: string; title: string; createdAt: Date };
  isActive: boolean;
  onClick: () => void;
  formatTime: (date: Date) => string;
  isHydrated: boolean;
  index: number;
}> = ({ session, isActive, onClick, formatTime, isHydrated, index }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover-lift animate-fade-in ${
      isActive 
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" 
        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
    }`}
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="truncate font-medium">{session.title}</div>
    <div className={`text-xs mt-1 ${isActive ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"}`}>
      {isHydrated ? formatTime(session.createdAt) : "Loading..."}
    </div>
  </button>
);

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`spinner ${sizeClasses[size]}`}></div>
  );
};

// Typing Indicator Component
export const TypingIndicator: React.FC = () => (
  <div className="flex justify-start animate-fade-in">
    <div className="message-assistant px-4 py-3 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-slate-500">Thinking...</span>
      </div>
    </div>
  </div>
);
