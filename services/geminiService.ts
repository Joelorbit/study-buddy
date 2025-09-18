import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

// For ease of setup, the Gemini API key is hardcoded here.
// You can replace this with your own key from Google AI Studio if needed.
const GEMINI_API_KEY = "AIzaSyAIjxKThuGlb_HLuugkfnB4GWI4TTvHNKw";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


// A helper function to transform our simple ChatMessage to the format Gemini expects
const transformHistoryForGemini = (messages: ChatMessage[]) => {
    // Drop the initial welcome message before sending to Gemini
    return messages.slice(1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
};

/**
 * Handles errors from the Gemini API, providing user-friendly messages.
 * @param {unknown} error - The error object caught from the API call.
 * @param {string} context - A string describing the operation that failed (e.g., "chat").
 * @throws {Error} Throws a new, more user-friendly error.
 */
const handleApiError = (error: unknown, context: string): never => {
    console.error(`Error in ${context}:`, error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('permission'))) {
        throw new Error('Your Gemini API key is not valid. Please check the key in services/geminiService.ts.');
    }
    throw new Error(`Failed to get a response from the AI for ${context}. Please try again.`);
};


export const sendMessageToAi = async (messages: ChatMessage[], newMessage: string) => {
  try {
    const history = transformHistoryForGemini(messages);
    const contents = [...history, { role: 'user', parts: [{ text: newMessage }] }];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: "You are StudyBuddy, an AI assistant helping users with their studies. Be helpful, encouraging, and clear in your explanations. Format your responses using markdown, including headings, bold text for emphasis, and lists for steps or key points."
        }
    });

    return response.text;

  } catch (error) {
    handleApiError(error, "chat");
  }
};

export const generateStudyNote = async (fileContent: string, daysUntilExam: number): Promise<string> => {
    try {
        const prompt = `Based on the following study material, create a concise, focused study note for today. The user's exam is in ${daysUntilExam} days. The note should highlight the most critical topics to review today to stay on track. Prioritize foundational concepts if the exam is far away, and key details or practice questions if it's very soon. Format the note using markdown: use headings for sections, bold for key terms, and bullet points for lists. Here is the material:\n\n---\n\n${fileContent}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
       handleApiError(error, "study note generation");
    }
};

export const generateSummary = async (fileContent: string): Promise<string> => {
    try {
        const prompt = `Summarize the following study material. The summary should be clear, well-structured, and cover all the main points and key concepts. Use markdown to organize the information effectively: use headings for main sections, bullet points for lists, and bold text for key terms. Here is the material:\n\n---\n\n${fileContent}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        handleApiError(error, "summary generation");
    }
};