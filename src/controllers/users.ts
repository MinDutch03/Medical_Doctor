import { db } from "@/config/db";
import { usersTable } from "@/models/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getOrCreateCurrentUser() {
	const user = await currentUser();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// @ts-ignore clerk typing
	const email = user?.primaryEmailAddress?.emailAddress as string | undefined;
	if (!email) {
		throw new Error("User email not found");
	}

	const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
	if (existing.length > 0) {
		return existing[0];
	}

	const created = await db
		.insert(usersTable)
		.values({
			// @ts-ignore
			name: user?.fullName,
			email,
			credits: 10,
		})
		.returning();
	return created[0];
}

export async function getCurrentUser() {
	const user = await currentUser();
	if (!user) {
		throw new Error("Unauthorized");
	}
	// @ts-ignore
	const email = user?.primaryEmailAddress?.emailAddress as string | undefined;
	if (!email) {
		throw new Error("User email not found");
	}
	const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
	if (existing.length === 0) {
		throw new Error("User not found");
	}
	return existing[0];
}


