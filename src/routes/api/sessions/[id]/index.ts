import { db } from "@/config/db";
import { sessionChatTable } from "@/models/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { controller } from "@/middlewares/controller";

export const getSession = controller([], async (_ctx: any, id?: string) => {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
    if (!id) throw new Error("Missing id");
    const result = await db.select().from(sessionChatTable).where(eq(sessionChatTable.sessionId, id));
    if (!result || result.length === 0) throw new Error("Session not found");
    return result[0];
});

export const deleteSession = controller([], async (_ctx: any, id?: string) => {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
    if (!id) throw new Error("Missing id");
    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) throw new Error("User email not found");
    await db.delete(sessionChatTable).where(and(eq(sessionChatTable.sessionId, id), eq(sessionChatTable.createdBy, userEmail)));
    return { success: true, message: "Session deleted successfully" };
});
