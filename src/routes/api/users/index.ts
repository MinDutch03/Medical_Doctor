import { db } from "@/config/db";
import { usersTable } from "@/models/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { controller } from "@/middlewares/controller";

export const getUser = controller([], async () => {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");
	// @ts-ignore
	const email = user?.primaryEmailAddress?.emailAddress as string | undefined;
	if (!email) throw new Error("User email not found");
	const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
	if (users.length === 0) throw new Error("User not found");
	return users[0];
});

export const createUser = controller([], async () => {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");
	// @ts-ignore
	const email = user?.primaryEmailAddress?.emailAddress as string | undefined;
	if (!email) throw new Error("User email not found");
	const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
	if (users.length > 0) return users[0];
	const result = await db
		.insert(usersTable)
		.values({
			// @ts-ignore
			name: user?.fullName,
			email,
			credits: 10,
		})
		.returning();
	return result[0];
});


