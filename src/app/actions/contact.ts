"use server";

import { sendContact } from "@/routes/api/server";

export async function sendContactAction(data: { name: string; email: string; subject: string; message: string }) { return await sendContact({ body: data }); }


