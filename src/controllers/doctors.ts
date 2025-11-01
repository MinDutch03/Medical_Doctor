import { db } from "@/config/db";
import { realDoctorsTable } from "@/models/schema";
import { eq } from "drizzle-orm";

export async function getDoctorPhoneByAgentId(id: number) {
	const result = await db.select().from(realDoctorsTable).where(eq(realDoctorsTable.doctorAgentId, id));
	if (!result || result.length === 0) throw new Error("Doctor not found");
	return { phoneNumber: (result[0] as any).phoneNumber as string };
}


