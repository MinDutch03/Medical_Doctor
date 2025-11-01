import { db } from "@/config/db";
import { sessionChatTable } from "@/models/schema";
import { openai } from "@/config/openaiModel";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { controller, RequestContext } from "@/middlewares/controller";
import { validate, body } from "@/utils/validate";

export const postMessage = controller(
    [validate.required("message", { checker: body, trim: true })],
    async (ctx: RequestContext, id?: string) => {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");
        if (!id) throw new Error("Missing id");
        const { message } = ctx.body ?? {};

        const session = await db.select().from(sessionChatTable).where(eq(sessionChatTable.sessionId, id));
        if (!session || session.length === 0) throw new Error("Session not found");

        const sessionData = session[0] as any;
        const selectedDoctor = sessionData.selectedDoctor as any;
        const conversationHistory = (sessionData.conversation as any[]) || [];

        const messages = [
            { role: "system", content: selectedDoctor?.agentPrompt || "You are a helpful medical assistant." },
            ...conversationHistory.map((msg: any) => ({ role: msg.role, content: msg.content })),
            { role: "user", content: message },
        ];

        const completion = await openai.chat.completions.create({ model: "gemini-2.5-flash", messages: messages as any });
        const aiResponse = completion.choices[0].message.content;

        const updatedConversation = [
            ...conversationHistory,
            { role: "user", content: message },
            { role: "assistant", content: aiResponse },
        ];

        await db.update(sessionChatTable).set({ conversation: updatedConversation }).where(eq(sessionChatTable.sessionId, id));

        return { response: aiResponse };
    }
);
