import { Resend } from "resend";

export async function sendContactEmail({ name, email, subject, message }: { name: string; email: string; subject: string; message: string; }) {
	if (!name || !email || !subject || !message) throw new Error("All fields are required");
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


