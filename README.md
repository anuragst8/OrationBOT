# 🚀 OrationBot - AI Career Assistant

A modern, multilingual career guidance chatbot built with Next.js, TypeScript, and AI integration.

## ✨ Features

- **🤖 AI-Powered**: OpenAI/Gemini integration for intelligent responses
- **🌍 Multilingual**: Hindi and English support with auto-detection
- **🎨 Modern UI**: Beautiful, responsive design with animations
- **📱 Mobile-First**: Works perfectly on all devices
- **⚡ Fast**: Built with Next.js 15 and optimized performance
- **🔧 Customizable**: Easy to modify colors, text, and features

## 🛠️ Quick Customization Guide

### 1. **Change App Branding** (`src/constants/config.ts`)
```typescript
export const APP_CONFIG = {
  appName: "YourAppName",           // Change app name
  description: "Your Description",  // Change description
  colors: {
    primary: "#6366f1",            // Change primary color
    secondary: "#8b5cf6",          // Change secondary color
    // ... more colors
  }
}
```

### 2. **Modify Text Content** (`src/constants/config.ts`)
```typescript
text: {
  welcome: {
    title: "Your Welcome Title",
    subtitle: "Your welcome message",
    hindi: {
      title: "आपका स्वागत शीर्षक",
      subtitle: "आपका स्वागत संदेश"
    }
  }
}
```

### 3. **Update AI Behavior** (`src/server/routers/chat.ts`)
- Line 104-106: Modify system prompts
- Line 118-120: Change mock responses
- Line 102-106: Adjust language detection

### 4. **Customize UI Components** (`src/components/ui.tsx`)
- `LanguageToggle`: Language selector
- `ChatMessage`: Message bubbles
- `SessionItem`: Session list items
- `LoadingSpinner`: Loading animations

### 5. **Add New Features** (`src/lib/utils.ts`)
- `formatTime()`: Time formatting
- `isHindiText()`: Language detection
- `getPlaceholderText()`: Input placeholders

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main chat interface
│   └── globals.css     # Global styles & animations
├── components/         # Reusable UI components
│   └── ui.tsx         # All UI components
├── constants/          # Configuration files
│   └── config.ts      # App configuration
├── lib/               # Utility functions
│   └── utils.ts       # Helper functions
├── server/            # Backend logic
│   ├── routers/       # API routes
│   └── db.ts         # Database connection
├── types/             # TypeScript definitions
│   └── index.ts      # Type definitions
└── utils/            # Client utilities
    └── trpc.ts       # API client
```

## 🎨 Visual Customization

### Colors
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)  
- **Accent**: `#10b981` (Emerald)
- **Background**: `#f8fafc` (Light gray)

### Animations
- `animate-fade-in`: Smooth fade-in effect
- `hover-lift`: Hover elevation effect
- `animate-bounce`: Bouncing dots animation
- `spinner`: Loading spinner animation

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your API keys to .env

# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=file:./dev.db
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_gemini_key
OPENAI_USE_MOCK=true
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 📝 Common Customizations

### Change App Name
1. Edit `src/constants/config.ts` → `appName`
2. Update `package.json` → `name`

### Add New Language
1. Add language option to `Language` type
2. Update `getPlaceholderText()` function
3. Add translations to config

### Modify AI Responses
1. Edit system prompts in `chat.ts`
2. Adjust language detection logic
3. Update mock responses

### Change Color Scheme
1. Update colors in `config.ts`
2. Modify CSS variables in `globals.css`
3. Test dark/light mode compatibility

## 🎯 Key Files to Modify

| File | Purpose | Common Changes |
|------|---------|----------------|
| `src/constants/config.ts` | App configuration | Colors, text, features |
| `src/app/page.tsx` | Main interface | Layout, styling |
| `src/components/ui.tsx` | UI components | Component behavior |
| `src/server/routers/chat.ts` | AI logic | Prompts, responses |
| `src/lib/utils.ts` | Helper functions | Text formatting, detection |

## 🆘 Troubleshooting

### Common Issues
1. **API Key Errors**: Check `.env` file
2. **Database Issues**: Run `npx prisma migrate dev`
3. **Build Errors**: Check TypeScript types
4. **Styling Issues**: Verify Tailwind classes

### Getting Help
- Check the code comments for guidance
- Look at the configuration files for options
- Review the component structure for modifications

## 📄 License

MIT License - feel free to modify and use!

---

**Made with ❤️ for easy customization and beautiful user experience**