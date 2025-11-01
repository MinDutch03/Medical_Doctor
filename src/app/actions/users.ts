"use server";

import { getOrCreateCurrentUser } from "@/controllers/users";

export async function getOrCreateUserAction() {
	const user = await getOrCreateCurrentUser();
	return user;
}


