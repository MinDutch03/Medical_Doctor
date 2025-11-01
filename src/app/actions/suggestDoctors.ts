"use server";

import { suggestDoctors } from "@/routes/api/server";

export async function suggestDoctorsAction(notes: string) { return await suggestDoctors({ body: { notes } }); }


