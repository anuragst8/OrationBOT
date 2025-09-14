"use client";
import * as React from "react";
import { trpc } from "../utils/trpc";
import { Language, SessionPage } from "../types";
import { 
  LanguageToggle, 
  ChatMessage, 
  SessionItem, 
  TypingIndicator 
} from "../components/ui";
import { 
  formatTime, 
  getPlaceholderText, 
  getWelcomeText, 
  getChatHeaderText 
} from "../lib/utils";
import { APP_CONFIG } from "../constants/config";

export default function Home() {
  const utils = trpc.useUtils();
  const [isHydrated, setIsHydrated] = React.useState(false);
  React.useEffect(() => setIsHydrated(true), []);
  
  const sessions = trpc.chat.listSessions.useInfiniteQuery(
    { limit: 20 },
    { getNextPageParam: (last: SessionPage) => last.nextCursor }
  );
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  const messages = trpc.chat.getMessages.useQuery(
    { sessionId: activeSessionId ?? "" },
    { enabled: !!activeSessionId }
  );
  const createSession = trpc.chat.createSession.useMutation({
    onSuccess(s) {
      setActiveSessionId(s.id);
      utils.chat.listSessions.invalidate();
    },
  });
  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess(res) {
      if (res?.sessionId) {
        setActiveSessionId(res.sessionId);
        utils.chat.listSessions.invalidate();
        utils.chat.getMessages.invalidate({ sessionId: res.sessionId });
      }
    },
  });
  
  const deleteSession = trpc.chat.deleteSession.useMutation({
    onSuccess() {
      utils.chat.listSessions.invalidate();
      if (activeSessionId) {
        setActiveSessionId(null);
      }
    },
  });
  
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [preferredLanguage, setPreferredLanguage] = React.useState<Language>('auto');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sendMessage.isPending) return;
    
    setIsTyping(true);
    let sessionId = activeSessionId;
    const toSend = trimmed;
    setInput("");
    
    try {
      if (sessionId) {
        await sendMessage.mutateAsync({ sessionId, content: toSend });
      } else {
        await sendMessage.mutateAsync({ content: toSend } as any);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const chatHeaderText = getChatHeaderText(preferredLanguage, !!activeSessionId);
  const welcomeText = getWelcomeText(preferredLanguage);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex">
      {/* Enhanced Sidebar */}
      <aside className="w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-xl">
        {/* Branded Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{APP_CONFIG.appName}</h1>
                <p className="text-sm text-indigo-100">{APP_CONFIG.description}</p>
              </div>
            </div>
          </div>
          <button
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 hover-lift focus-ring flex items-center justify-center space-x-2"
            onClick={() => createSession.mutate({ title: "New session" })}
            disabled={createSession.isPending}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {(sessions.data?.pages?.flatMap((p: SessionPage) => p?.items ?? []) ?? []).map((s: SessionPage["items"][number], index) => (
            <SessionItem
              key={s.id}
              session={s}
              isActive={activeSessionId === s.id}
              onClick={() => setActiveSessionId(s.id)}
              onDelete={() => deleteSession.mutate({ sessionId: s.id })}
              formatTime={formatTime}
              isHydrated={isHydrated}
              index={index}
            />
          ))}
          {sessions.hasNextPage && (
            <button 
              className="w-full text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-3 px-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium"
              onClick={() => sessions.fetchNextPage()}
            >
              Load more sessions
            </button>
          )}
        </div>
      </aside>

      {/* Enhanced Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl">
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {chatHeaderText.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {chatHeaderText.subtitle}
                </p>
              </div>
            </div>
            
            <LanguageToggle 
              language={preferredLanguage} 
              onLanguageChange={setPreferredLanguage} 
            />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!activeSessionId && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-6 animate-fade-in max-w-md">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {welcomeText.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                    {welcomeText.subtitle}
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {Array.isArray(messages.data) ? (
            messages.data.length > 0 ? (
              messages.data.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isHydrated={isHydrated}
                  formatTime={formatTime}
                />
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No messages in this conversation yet
              </div>
            )
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              Loading messages...
            </div>
          )}

          {isTyping && <TypingIndicator />}
        </div>

        {/* Enhanced Input Area */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-6 py-4 pr-16 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus-ring text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                placeholder={getPlaceholderText(preferredLanguage)}
                disabled={sendMessage.isPending}
              />
              <button
                type="submit"
                disabled={sendMessage.isPending || !input.trim()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-lift shadow-lg"
              >
                {sendMessage.isPending ? (
                  <div className="spinner w-5 h-5"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}