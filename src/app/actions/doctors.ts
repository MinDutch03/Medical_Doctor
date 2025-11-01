"use server";

import { getDoctorPhone } from "@/routes/api/server";

export async function getDoctorPhoneAction(id: number) { return await getDoctorPhone({}, String(id)); }


