import { openai } from "@/config/openaiModel";
import { AIDoctorAgents } from "@/constants/doctorAgents";

export async function suggestDoctorsFromNotes(notes: string) {
	const prompt = `Based on these patient notes and symptoms: "${notes}", suggest the most appropriate doctors from the following list: ${JSON.stringify(
		AIDoctorAgents
	)}. Return a JSON object with a "doctors" array. Use this format: {"doctors": [{"id": 1, "specialist": "...", ...}]}`;

	const completion = await openai.chat.completions.create({
		model: "gemini-2.5-flash",
		messages: [{ role: "user", content: prompt }],
		response_format: { type: "json_object" },
	});

	const rawResponse = completion.choices[0].message.content?.trim() || "";
	let suggestedIds: number[] = [];
	try {
		const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const rawJson = JSON.parse(jsonMatch[0]);
			let rawArray: any[] = [];
			if (Array.isArray(rawJson.doctors)) rawArray = rawJson.doctors;
			else if (Array.isArray(rawJson)) rawArray = rawJson;
			suggestedIds = rawArray.map((doc: any) => doc.id).filter((id: any) => typeof id === "number");
		}
	} catch (_) {
		try {
			const numbers = rawResponse.match(/\b(\d{1,2})\b/g);
			if (numbers) {
				suggestedIds = numbers.map((id) => parseInt(id)).filter((id) => id >= 1 && id <= 10).slice(0, 3);
			}
		} catch {}
	}

	let doctorsArray: any[] = [];
	if (suggestedIds.length > 0) {
		doctorsArray = suggestedIds
			.map((id) => AIDoctorAgents.find((doc) => doc.id === id))
			.filter((doc): doc is any => doc !== undefined);
	}
	if (!doctorsArray || doctorsArray.length === 0) doctorsArray = AIDoctorAgents;
	return doctorsArray;
}


