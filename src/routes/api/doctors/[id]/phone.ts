import { db } from "@/config/db";
import { realDoctorsTable } from "@/models/schema";
import { eq } from "drizzle-orm";
import { controller } from "@/middlewares/controller";

export const getDoctorPhone = controller([], async (_ctx: any, id?: string) => {
    if (!id) throw new Error("Missing id");
    const result = await db.select().from(realDoctorsTable).where(eq(realDoctorsTable.doctorAgentId, parseInt(id)));
    if (result.length === 0) throw new Error("Doctor not found");
    return { phoneNumber: (result[0] as any).phoneNumber } as { phoneNumber: string };
});
