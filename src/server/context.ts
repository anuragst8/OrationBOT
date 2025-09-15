import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
  return {
    // You can add any context data here
    // For example, user authentication data, database connection, etc.
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
