import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

// Default model for chat completions
export const DEFAULT_MODEL = 'gemini-2.5-flash'; // Gemini 2.5 Flash

// Wrapper function to maintain OpenAI-like interface for compatibility
export const chatCompletions = {
  create: async (options: { model: string; messages: any[]; response_format?: any }) => {
    const { model, messages, response_format } = options;
    const modelName = model || DEFAULT_MODEL;
    
    try {
      // Get the model
      const geminiModel = genAI.getGenerativeModel({ model: modelName });

      // Extract system instruction and conversation history separately
      let systemInstruction: string | undefined = undefined;
      const conversationHistory: any[] = [];

      for (const msg of messages) {
        if (msg.role === 'system') {
          // Store system instruction separately
          systemInstruction = msg.content;
        } else if (msg.role === 'user') {
          conversationHistory.push({
            role: 'user',
            parts: [{ text: msg.content }]
          });
        } else if (msg.role === 'assistant') {
          conversationHistory.push({
            role: 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      // If we have conversation history, use chat mode
      if (conversationHistory.length > 0) {
        const chatConfig: any = {
          history: conversationHistory.slice(0, -1), // All except the last message
        };
        
        // Add system instruction in proper format (needs to be wrapped in Content format)
        if (systemInstruction) {
          chatConfig.systemInstruction = {
            parts: [{ text: systemInstruction }],
            role: 'system'
          };
        }
        
        const chat = geminiModel.startChat(chatConfig);

        const lastMessage = conversationHistory[conversationHistory.length - 1];
        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const response = result.response;
        const text = response.text();

        return {
          choices: [{
            message: {
              role: 'assistant',
              content: text
            }
          }]
        };
      } else {
        // Simple generate content for single message
        const lastMessage = messages[messages.length - 1];
        let prompt = lastMessage.content;
        
        // Add system instruction at the beginning if exists
        if (systemInstruction) {
          prompt = systemInstruction + '\n\n' + prompt;
        }
        
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return {
          choices: [{
            message: {
              role: 'assistant',
              content: text
            }
          }]
        };
      }
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      if (error.message?.includes('API key')) {
        throw new Error(`Invalid or missing GOOGLE_GEMINI_API_KEY. Please check your environment variables.`);
      }
      
      if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        throw new Error(`Gemini API quota exceeded or rate limit reached. Please try again later.`);
      }
      
      throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
    }
  }
};

// Maintain backward compatibility with existing code
export const openai = {
  chat: {
    completions: chatCompletions
  }
};
