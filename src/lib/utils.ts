// ========================================
// UTILITY FUNCTIONS
// ========================================
// Reusable helper functions

import { Language } from '../types';

// Format time in a user-friendly way
export const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

// Detect if text contains Hindi characters
export const isHindiText = (text: string): boolean => {
  return /[\u0900-\u097F]/.test(text);
};

// Get appropriate placeholder text based on language
export const getPlaceholderText = (language: Language): string => {
  switch (language) {
    case 'hindi':
      return "अपने करियर लक्ष्यों, कौशल या नौकरी की खोज के बारे में पूछें...";
    case 'english':
      return "Ask about your career goals, skills, or job search...";
    default:
      return "Ask about your career goals, skills, or job search...";
  }
};

// Get welcome text based on language
export const getWelcomeText = (language: Language) => {
  switch (language) {
    case 'hindi':
      return {
        title: "अपनी करियर यात्रा शुरू करें",
        subtitle: "व्यक्तिगत करियर मार्गदर्शन के लिए एक नया चैट सत्र बनाएं"
      };
    case 'english':
      return {
        title: "Start Your Career Journey",
        subtitle: "Create a new chat session to get personalized career guidance"
      };
    default:
      return {
        title: "Start Your Career Journey",
        subtitle: "Create a new chat session to get personalized career guidance"
      };
  }
};

// Get chat header text based on language and session state
export const getChatHeaderText = (language: Language, hasActiveSession: boolean) => {
  if (hasActiveSession) {
    return {
      title: language === 'hindi' ? 'करियर मार्गदर्शन चैट' : 'Career Guidance Chat',
      subtitle: language === 'hindi' ? 'अपने करियर के बारे में कुछ भी पूछें' : 'Ask me anything about your career'
    };
  } else {
    return {
      title: language === 'hindi' ? 'OrationBot में आपका स्वागत है' : 'Welcome to OrationBot',
      subtitle: language === 'hindi' ? 'शुरू करने के लिए एक नई बातचीत शुरू करें' : 'Start a new conversation to begin'
    };
  }
};
