import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { prisma } from "../db";
import OpenAI from "openai";

export const chatRouter = router({
  listSessions: publicProcedure
    .input(z.object({ cursor: z.string().nullish(), limit: z.number().min(1).max(50).default(20) }).default({ limit: 20 }))
    .query(async ({ input }) => {
      const limit = input.limit ?? 20;
      const sessions = await prisma.chatSession.findMany({
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        select: { id: true, title: true, createdAt: true, updatedAt: true },
      });
      let nextCursor: string | undefined = undefined;
      if (sessions.length > limit) {
        const next = sessions.pop();
        nextCursor = next?.id;
      }
      return { items: sessions, nextCursor };
    }),

  createSession: publicProcedure
    .input(z.object({ title: z.string().min(1) }).nullish())
    .mutation(async ({ input }) => {
      const title = input?.title ?? "New session";
      const session = await prisma.chatSession.create({ data: { title } });
      return session;
    }),

  getMessages: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: { sessionId: input.sessionId },
        orderBy: { createdAt: "asc" },
      });
      return messages;
    }),

  sendMessage: publicProcedure
    // Accept loosely to work around any client/batch serialization quirks
    .input(z.any())
    .mutation(async ({ input }) => {
      console.log("sendMessage raw input:", input);
      let sessionId: string | undefined;
      let content: string | undefined;

      // Normalize various possible shapes due to batching/serialization
      const unwrapPossibleWrappers = (val: unknown): unknown => {
        if (Array.isArray(val)) return val[0];
        if (val && typeof val === "object") {
          const obj = val as Record<string, unknown>;
          if ("input" in obj) return (obj as any).input;
          if ("json" in obj) return (obj as any).json;
          if ("0" in obj) return (obj as any)["0"]; // some clients send index keys in batch
        }
        return val;
      };

      const normalized = unwrapPossibleWrappers(input);

      if (typeof normalized === "string") {
        try {
          const parsed = JSON.parse(normalized);
          sessionId = parsed?.sessionId;
          content = parsed?.content;
        } catch {
          // ignore and fall through
        }
      } else if (typeof normalized === "object" && normalized !== null) {
        sessionId = (normalized as any).sessionId;
        content = (normalized as any).content;
      }

      // Require content, but if sessionId is missing, auto-create a session
      if (!content || typeof content !== "string" || !content.trim()) {
        console.error("sendMessage invalid input parsed:", { sessionId, content, input });
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid input for sendMessage" });
      }

      if (!sessionId || typeof sessionId !== "string") {
        const derivedTitle = content.length > 48 ? content.slice(0, 48) + "…" : content;
        const createdSession = await prisma.chatSession.create({
          data: { title: derivedTitle || "New session" },
        });
        sessionId = createdSession.id;
      }
      const createdUserMessage = await prisma.message.create({
        data: { sessionId, role: "user", content },
      });

      const history = await prisma.message.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
        select: { role: true, content: true },
      });

      const systemPrompt = "You are a helpful, professional career counsellor. Provide structured, actionable advice. Do not repeat or rephrase the user's message; respond with new guidance only.";

      // If forced mock or no provider key, return a local mock response so the UI still works
      const hasOpenAIKey = typeof process.env.OPENAI_API_KEY === "string" && process.env.OPENAI_API_KEY.trim().length > 0;
      const geminiKey = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "").trim();
      const forceMock = process.env.OPENAI_USE_MOCK === "true";
      console.log(
        "sendMessage providers:",
        { openai: hasOpenAIKey, gemini: !!geminiKey, forceMock }
      );
      if (forceMock || (!hasOpenAIKey && !geminiKey)) {
        const lastUser = history.filter((m) => m.role === "user").slice(-1)[0]?.content ?? content;
        const mock = `Mock response (no AI available). Your message: "${lastUser}"\n\n- This is a local placeholder while AI is disabled or quota is exceeded.\n- Add or fix OPENAI_API_KEY and remove OPENAI_USE_MOCK to get real answers.`;
        const assistant = await prisma.message.create({
          data: { sessionId, role: "assistant", content: mock },
        });
        return { sessionId, user: createdUserMessage, assistant };
      }

      try {
        // Prefer Gemini if configured, otherwise use OpenAI
        if (geminiKey) {
          const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
          const url = `https://generativelanguage.googleapis.com/v1/models/${geminiModel}:generateContent?key=${encodeURIComponent(geminiKey)}`;

          // Map history to Gemini's roles: user/model
          const geminiContents = [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...history.map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
          ];

          const geminiRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: geminiContents, generationConfig: { temperature: 0.4 } }),
          });

          if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            throw new Error(`Gemini error ${geminiRes.status}: ${errText}`);
          }

          const geminiJson: any = await geminiRes.json();
          const parts = geminiJson?.candidates?.[0]?.content?.parts ?? [];
          const aiMessage = parts.map((p: any) => p?.text).filter(Boolean).join("\n");
          console.log("sendMessage Gemini response preview:", aiMessage.slice(0, 200));
          const assistant = await prisma.message.create({
            data: { sessionId, role: "assistant", content: aiMessage },
          });
          return { sessionId, user: createdUserMessage, assistant };
        } else {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...history.map((m) => ({ role: m.role as any, content: m.content })),
            ],
            temperature: 0.4,
          });

          const aiMessage = completion.choices?.[0]?.message?.content?.toString() ?? "";
          console.log("sendMessage OpenAI response preview:", aiMessage.slice(0, 200));
          const assistant = await prisma.message.create({
            data: { sessionId, role: "assistant", content: aiMessage },
          });
          return { sessionId, user: createdUserMessage, assistant };
        }
      } catch (error: any) {
        console.error("sendMessage OpenAI error:", error);
        const isQuota = error?.code === "insufficient_quota" || error?.status === 429;
        const contentForUser = isQuota
          ? "The AI service quota was exceeded. Please check billing or try again later."
          : "Sorry, I couldn\'t generate a response right now. Please try again in a moment.";
        const assistant = await prisma.message.create({
          data: { sessionId, role: "assistant", content: contentForUser },
        });
        return { sessionId, user: createdUserMessage, assistant };
      }
    }),
});


