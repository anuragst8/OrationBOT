import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../server/routers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
    onError({ error, path }) {
      console.error("tRPC error:", { path, message: error.message, code: error.code });
    },
  });
}

export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  try {
    const clone = req.clone();
    const bodyText = await clone.text();
    console.log("tRPC POST raw body:", bodyText);
  } catch (e) {
    console.log("tRPC POST body read error:", e);
  }
  return handler(req);
}


