import { db } from "@/config/db";
import { sessionChatTable } from "@/models/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function listSessionsForCurrentUser() {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");
	// @ts-ignore
	const email = user.primaryEmailAddress?.emailAddress as string | undefined;
	const result = await db
		.select()
		.from(sessionChatTable)
		.where(eq(sessionChatTable.createdBy, email as any))
		.orderBy(desc(sessionChatTable.id));
	return result;
}

export async function createSessionForCurrentUser(params: { notes: string; selectedDoctor: any }) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");
	const sessionId = uuidv4();
	const result = await db
		.insert(sessionChatTable)
		.values({
			sessionId,
			// @ts-ignore
			createdBy: user?.primaryEmailAddress?.emailAddress,
			notes: params.notes,
			selectedDoctor: params.selectedDoctor,
			createdOn: new Date().toString(),
		})
		.returning();
	return result[0];
}

export async function getSessionById(sessionId: string) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");
	const result = await db.select().from(sessionChatTable).where(eq(sessionChatTable.sessionId, sessionId));
	if (!result || result.length === 0) throw new Error("Session not found");
	return result[0];
}

export async function deleteSessionById(sessionId: string) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");
	const userEmail = user.primaryEmailAddress?.emailAddress;
	if (!userEmail) throw new Error("User email not found");
	await db
		.delete(sessionChatTable)
		.where(and(eq(sessionChatTable.sessionId, sessionId), eq(sessionChatTable.createdBy, userEmail)));
	return { success: true };
}


