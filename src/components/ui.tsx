// ========================================
// REUSABLE UI COMPONENTS
// ========================================
// Easy to modify and customize

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Language } from '../types';

// Typing Indicator Component
export const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Typing...</span>
  </div>
);

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
  onDelete: () => void;
  formatTime: (date: Date) => string;
  isHydrated: boolean;
  index: number;
}> = ({ session, isActive, onClick, onDelete, formatTime, isHydrated, index }) => (
  <div className={`group relative rounded-xl transition-all duration-200 hover-lift animate-fade-in ${
    isActive 
      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" 
      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
  }`} style={{ animationDelay: `${index * 50}ms` }}>
    <button
      onClick={onClick}
      className="w-full text-left p-3 pr-10"
    >
      <div className="truncate font-medium">{session.title}</div>
      <div className={`text-xs mt-1 ${isActive ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"}`}>
        {isHydrated ? formatTime(session.createdAt) : "Loading..."}
      </div>
    </button>
    
    {/* Delete Button - Shows on hover */}
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
      <DeleteButton onDelete={onDelete} sessionTitle={session.title} />
    </div>
  </div>
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

// Delete Button Component
export const DeleteButton: React.FC<{
  onDelete: () => void;
  sessionTitle: string;
}> = ({ onDelete, sessionTitle }) => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleDelete = () => {
    onDelete();
    setShowConfirm(false);
  };

  // Create portal target
  const modalRoot = typeof document !== 'undefined' ? document.body : null;
  
  if (!mounted || !modalRoot) return null;

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        title="Delete chat"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Confirmation Dialog - Rendered in a portal */}
      {showConfirm && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              maxWidth: '28rem',
              width: '100%',
              position: 'relative',
              zIndex: 10001,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            className="dark:bg-slate-800 dark:border-red-800 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center p-2">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Chat</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">This action cannot be undone</p>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6 text-base">
                Delete "<span className="font-medium text-red-600 dark:text-red-400">{sessionTitle}</span>"?
                <span className="block text-sm text-slate-500 dark:text-slate-400 mt-1">All messages will be removed</span>
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>,
        modalRoot
      )}
    </>
  );
};
