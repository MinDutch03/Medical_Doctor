"use server";

import { listSessions, createSession, deleteSession, getSession, postSessionMessage } from "@/routes/api/server";

export async function listSessionsAction() { return await listSessions({}); }
export async function createSessionAction(params: { notes: string; selectedDoctor: any }) { return await createSession({ body: params }); }
export async function deleteSessionAction(sessionId: string) { return await deleteSession({}, sessionId); }
export async function getSessionAction(sessionId: string) { return await getSession({}, sessionId); }
export async function postMessageAction(sessionId: string, message: string) { return await postSessionMessage({ body: { message } }, sessionId); }


