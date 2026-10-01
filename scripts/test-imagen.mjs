import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
    try {
        const interaction = await ai.interactions.create({
            model: 'gemini-3-pro-image-preview',
            input: 'Generate an image of a futuristic city.',
            response_modalities: ['image'],
        });
        for (const output of interaction.outputs) {
            if (output.type === 'image') {
                console.log(`Generated image with mime_type: ${output.mime_type}`);
                break;
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
