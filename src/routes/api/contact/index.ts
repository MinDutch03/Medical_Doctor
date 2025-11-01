import { controller } from "@/middlewares/controller";
import { validate, body } from "@/utils/validate";
import { Resend } from "resend";

export const sendContact = controller(
	[
		validate.required("name", { checker: body, trim: true }),
		validate.required("email", { checker: body, trim: true }),
		validate.required("subject", { checker: body, trim: true }),
		validate.required("message", { checker: body, trim: true }),
	],
	async (ctx) => {
		const { name, email, subject, message } = ctx.body ?? {};
		if (!process.env.RESEND_API_KEY || !process.env.RECEIVED_GMAIL) throw new Error("Email service not configured. Please set RESEND_API_KEY and RECEIVED_GMAIL in your environment variables.");
		const resend = new Resend(process.env.RESEND_API_KEY);
		await resend.emails.send({
			from: `${name} <${email}>`,
			to: process.env.RECEIVED_GMAIL,
			replyTo: email,
			subject: `Contact Form: ${subject}`,
			html: `<div><h2>New Contact Form Submission</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Subject:</b> ${subject}</p><p>${message}</p></div>`
		});
		return { success: true };
	}
);


