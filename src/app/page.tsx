"use client";
import * as React from "react";
import { trpc } from "../utils/trpc";

export default function Home() {
	const utils = trpc.useUtils();
	const [isHydrated, setIsHydrated] = React.useState(false);
	React.useEffect(() => setIsHydrated(true), []);
	type SessionPage = { items: { id: string; title: string; createdAt: Date; updatedAt: Date }[]; nextCursor?: string };
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
	const [input, setInput] = React.useState("");
	return (
		<div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-screen">
			<aside className="border-r border-gray-200 p-4 space-y-2">
				<div className="flex items-center justify-between">
					<h1 className="font-semibold">Sessions</h1>
					<button
						className="px-2 py-1 bg-black text-white rounded"
						onClick={() => createSession.mutate({ title: "New session" })}
					>
						New
					</button>
				</div>
				<div className="space-y-1 overflow-auto h-[calc(100vh-5rem)]">
					{(sessions.data?.pages?.flatMap((p: SessionPage) => p?.items ?? []) ?? []).map((s: SessionPage["items"][number]) => (
						<button
							key={s.id}
							onClick={() => setActiveSessionId(s.id)}
							className={`block w-full text-left px-2 py-1 rounded ${activeSessionId === s.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
						>
							<div className="truncate">{s.title}</div>
							<div className="text-xs text-gray-500" suppressHydrationWarning>
								{isHydrated
									? new Date(s.createdAt as unknown as string).toLocaleString()
									: new Date(s.createdAt as unknown as string).toISOString()}
							</div>
						</button>
					))}
					{sessions.hasNextPage && (
						<button className="text-sm text-blue-600" onClick={() => sessions.fetchNextPage()}>
							Load more
						</button>
					)}
				</div>
			</aside>
			<main className="flex flex-col h-screen">
				<div className="flex-1 overflow-auto p-4 space-y-3">
					{!activeSessionId && <div className="text-gray-500">Create or select a session</div>}
					{messages.data?.map((m) => (
						<div key={m.id} className="space-y-1">
							<div className="text-xs uppercase text-gray-400">{m.role}</div>
							<div className="whitespace-pre-wrap">{m.content}</div>
						</div>
					))}
				</div>
				<form
					className="border-t p-3 flex gap-2"
					onSubmit={async (e) => {
						e.preventDefault();
						const trimmed = input.trim();
						if (!trimmed) return;
						let sessionId = activeSessionId;
						const toSend = trimmed;
						setInput("");
						if (sessionId) {
							await sendMessage.mutateAsync({ sessionId, content: toSend });
						} else {
							await sendMessage.mutateAsync({ content: toSend } as any);
						}
					}}
				>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="flex-1 border rounded px-3 py-2"
						placeholder="Type your message..."
					/>
					<button
						className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
						type="submit"
						disabled={sendMessage.isPending || !input.trim()}
					>
						Send
					</button>
				</form>
			</main>
		</div>
	);
}
