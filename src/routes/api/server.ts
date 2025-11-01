// Server-only API exports
// Import route modules (which themselves use server-only libs like Clerk, DB, nodemailer)
import { getSessions as listSessions, createSession } from "@/routes/api/sessions";
import { getSession, deleteSession } from "@/routes/api/sessions/[id]";
import { postMessage as postSessionMessage } from "@/routes/api/sessions/[id]/messages";
import { getDoctorPhone } from "@/routes/api/doctors/[id]/phone";
import { suggestDoctors } from "@/routes/api/suggest-doctors";
import { getUser, createUser } from "@/routes/api/users";
import { sendContact } from "@/routes/api/contact";

export { listSessions, createSession, getSession, deleteSession, postSessionMessage, getDoctorPhone, suggestDoctors, getUser, createUser, sendContact };
