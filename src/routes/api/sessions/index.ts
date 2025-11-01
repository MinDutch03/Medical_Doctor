import { db } from "@/config/db";
import { sessionChatTable } from "@/models/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { controller } from "@/middlewares/controller";
import { validate, body } from "@/utils/validate";

export const getSessions = controller([], async () => {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");
	const result = await db
		.select()
		.from(sessionChatTable)
		// @ts-ignore clerk typing
		.where(eq(sessionChatTable.createdBy, user.primaryEmailAddress?.emailAddress))
		.orderBy(desc(sessionChatTable.id));
	return result;
});

export const createSession = controller(
	[
		validate.required("notes", { checker: body, trim: true }),
		validate.required("selectedDoctor", { checker: body }),
	],
	async (ctx) => {
		const user = await currentUser();
		if (!user) throw new Error("Unauthorized");
		const { notes, selectedDoctor } = ctx.body ?? {};
		const sessionId = uuidv4();
		const result = await db
			.insert(sessionChatTable)
			.values({
				sessionId,
				// @ts-ignore clerk typing
				createdBy: user?.primaryEmailAddress?.emailAddress,
				notes,
				selectedDoctor,
				createdOn: new Date().toString(),
			})
			.returning();
		return result[0];
	}
);
