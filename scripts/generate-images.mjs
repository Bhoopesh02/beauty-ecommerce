import fs from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const MODEL_NAME = 'imagen-3.0-generate-002'; // the recommended Imagen 3 model

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GLOBAL_RULES = "Style: soft, minimal, premium botanical editorial photography feel; natural light; clean uncluttered composition with generous empty space for text overlays. Palette: soft pink (#F7B9C4), blush (#DE638A), mimi pink (#F3D9E5), thistle lilac (#C6BADE), deep violet (#4A3267) accents, cream, natural leaf greens. No text, no letters, no logos, no watermarks, no packaging, no people, no hands, no brand names.";
const STRONG_RULES = "Absolutely NO TEXT, NO LETTERS, NO WORDS. No watermarks, no people, no packaging, no hands. Only natural botanical elements.";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Ensure directory exists
async function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
}

// Validate generated image
// For a script without vision-LM, "obvious problems" might mean checking if the file is extremely small.
// To truly check for text/faces, we would need a vision model. For now, we will do a basic validation.
async function validateImage(buffer) {
    const metadata = await sharp(buffer).metadata();
    if (!metadata || metadata.size < 5000) { // Very small file
        return false;
    }
    return true;
}

// Convert aspect ratio requested into supported aspect ratio and sharp resize options
function parseAspectRatio(ratioStr) {
    const mapped = {
        '16:9': { gen: '16:9', targetW: 1920, targetH: 1080 },
        '4:5': { gen: '3:4', targetW: 960, targetH: 1200 }, // Generate 3:4, crop to 4:5
        '1:1': { gen: '1:1', targetW: 800, targetH: 800 },
        '3:4': { gen: '3:4', targetW: 900, targetH: 1200 },
        '3:2': { gen: '4:3', targetW: 1200, targetH: 800 }, // Generate 4:3, crop to 3:2
    };
    return mapped[ratioStr] || { gen: '1:1', targetW: 800, targetH: 800 };
}

async function logCredit(id, prompt) {
    const creditsPath = path.join(rootDir, 'public/images/stock/CREDITS.md');
    const dateStr = new Date().toISOString().split('T')[0];
    const logLine = `| ${id} | AI-generated with Google Gemini | ${MODEL_NAME} | ${dateStr} | ${prompt} | TODO |\n`;
    
    try {
        await fs.access(creditsPath);
    } catch {
        const header = `| ID | Source | Model | Date | Prompt | Used On |\n|---|---|---|---|---|---|\n`;
        await fs.mkdir(path.dirname(creditsPath), { recursive: true });
        await fs.writeFile(creditsPath, header);
    }
    await fs.appendFile(creditsPath, logLine);
}

async function processImage(item, force = false) {
    const outPath = path.join(rootDir, item.outputFile);
    const rawPath = path.join(rootDir, `public/images/stock-raw/ai/${item.id}.png`);
    
    if (!force) {
        try {
            await fs.access(outPath);
            console.log(`${item.id} | SKIPPED | File exists`);
            return;
        } catch {}
    }

    const { gen: genRatio, targetW, targetH } = parseAspectRatio(item.aspectRatio);
    
    let success = false;
    let attempts = 0;
    const maxAttempts = 3;
    let finalBuffer = null;

    while (attempts < maxAttempts && !success) {
        try {
            let prompt = `${item.subject}. ${GLOBAL_RULES}`;
            if (attempts > 0) {
                prompt = `${item.subject}. ${GLOBAL_RULES} ${STRONG_RULES}`;
            }

            const response = await ai.models.generateImages({
                model: MODEL_NAME,
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg', // Imagen 3 returns jpeg usually when requested, or png
                    aspectRatio: genRatio
                }
            });

            const base64Image = response.generatedImages[0].image.imageBytes;
            const buffer = Buffer.from(base64Image, 'base64');
            
            const isValid = await validateImage(buffer);
            if (!isValid) {
                console.log(`${item.id} | ATTEMPT ${attempts + 1} FAILED VALIDATION`);
                attempts++;
                await sleep(2000);
                continue;
            }

            await ensureDir(rawPath);
            await fs.writeFile(rawPath, buffer);
            finalBuffer = buffer;
            await logCredit(item.id, prompt);
            success = true;
        } catch (error) {
            console.error(`${item.id} | API ERROR:`, error.message);
            if (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('billing')) {
                console.error("QUOTA OR BILLING ERROR - STOPPING SCRIPT.");
                process.exit(1);
            }
            attempts++;
            await sleep(2000);
        }
    }

    if (!success || !finalBuffer) {
        console.log(`${item.id} | FAILED | After ${maxAttempts} attempts`);
        return;
    }

    // Resize and save as WebP
    await ensureDir(outPath);
    let imagePipeline = sharp(finalBuffer)
        .resize(targetW, targetH, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 });
    
    const info = await imagePipeline.toFile(outPath);
    console.log(`${item.id} | SUCCESS | ${Math.round(info.size / 1024)} KB`);
}

async function main() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("ERROR: GEMINI_API_KEY not found in .env.local");
        process.exit(1);
    }

    const manifestPath = path.join(__dirname, 'image-manifest.json');
    const manifestStr = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestStr);
    
    const args = process.argv.slice(2);
    const forceIds = args.filter(a => a.startsWith('--force=')).map(a => a.split('=')[1]);

    for (const item of manifest) {
        const force = forceIds.includes(item.id);
        await processImage(item, force);
        await sleep(3000); // Short delay between requests
    }
}

main().catch(err => {
    console.error("UNEXPECTED ERROR:", err);
});
