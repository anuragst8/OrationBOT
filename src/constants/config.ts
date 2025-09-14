// ========================================
// CONFIGURATION FILE
// ========================================
// Easy customization - change these values to modify the app

export const APP_CONFIG = {
  // App Identity
  appName: "OrationBot",
  description: "AI-Powered Career Assistant",
  
  // Colors (easily changeable)
  colors: {
    primary: "#6366f1",      // Indigo
    secondary: "#8b5cf6",    // Purple
    accent: "#10b981",        // Emerald
    background: "#f8fafc",    // Light gray
    text: "#1e293b",          // Dark slate
  },
  
  // Features
  features: {
    enableHindi: true,
    enableDarkMode: true,
    enableAnimations: true,
    enableTypingIndicator: true,
  },
  
  // Text Content (easily customizable)
  text: {
    welcome: {
      title: "Start Your Career Journey",
      subtitle: "Create a new chat session to get personalized career guidance",
      hindi: {
        title: "अपनी करियर यात्रा शुरू करें",
        subtitle: "व्यक्तिगत करियर मार्गदर्शन के लिए एक नया चैट सत्र बनाएं"
      }
    },
    placeholders: {
      english: "Ask about your career goals, skills, or job search...",
      hindi: "अपने करियर लक्ष्यों, कौशल या नौकरी की खोज के बारे में पूछें..."
    }
  },
  
  // AI Settings
  ai: {
    systemPrompt: {
      english: "You are a helpful, professional career counsellor. Provide structured, actionable advice. Do not repeat or rephrase the user's message; respond with new guidance only. If the user writes in Hindi, respond in Hindi. If they write in English, respond in English.",
      hindi: "आप एक सहायक, पेशेवर करियर काउंसलर हैं। संरचित, कार्य योग्य सलाह दें। उपयोगकर्ता के संदेश को दोहराएं या पुनः व्याख्या न करें; केवल नई मार्गदर्शन के साथ उत्तर दें। हिंदी में बात करें।"
    }
  }
} as const;
