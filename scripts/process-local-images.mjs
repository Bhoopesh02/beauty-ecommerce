import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const artifactDir = 'C:\\Users\\bhoop\\.gemini\\antigravity-ide\\brain\\80c9901f-1f07-444a-98a3-5471a9c17b47';

async function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
}

function parseAspectRatio(ratioStr) {
    const mapped = {
        '16:9': { targetW: 1920, targetH: 1080 },
        '4:5': { targetW: 960, targetH: 1200 },
        '1:1': { targetW: 800, targetH: 800 },
        '3:4': { targetW: 900, targetH: 1200 },
        '3:2': { targetW: 1200, targetH: 800 },
    };
    return mapped[ratioStr] || { targetW: 800, targetH: 800 };
}

async function logCredit(id, prompt) {
    const creditsPath = path.join(rootDir, 'public/images/stock/CREDITS.md');
    const dateStr = new Date().toISOString().split('T')[0];
    const logLine = `| ${id} | AI-generated with Google Gemini | gemini-3.1-flash-image | ${dateStr} | ${prompt} | TODO |\n`;
    
    try {
        await fs.access(creditsPath);
    } catch {
        const header = `| ID | Source | Model | Date | Prompt | Used On |\n|---|---|---|---|---|---|\n`;
        await ensureDir(creditsPath);
        await fs.writeFile(creditsPath, header);
    }
    await fs.appendFile(creditsPath, logLine);
}

async function main() {
    const manifestPath = path.join(__dirname, 'image-manifest.json');
    const manifestStr = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestStr);
    
    const files = await fs.readdir(artifactDir);
    
    for (const item of manifest) {
        // Find the image in artifact dir
        const prefix = item.id.replace(/-/g, '_') + '_';
        const file = files.find(f => f.startsWith(prefix) && f.endsWith('.jpg'));
        
        if (!file) {
            console.log(`${item.id} | FAILED | (No raw image generated due to quota)`);
            continue;
        }

        const sourcePath = path.join(artifactDir, file);
        const outPath = path.join(rootDir, item.outputFile);
        const rawPath = path.join(rootDir, `public/images/stock-raw/ai/${item.id}.jpg`);

        const { targetW, targetH } = parseAspectRatio(item.aspectRatio);

        try {
            await ensureDir(rawPath);
            await fs.copyFile(sourcePath, rawPath);

            await ensureDir(outPath);
            const imagePipeline = sharp(sourcePath)
                .resize(targetW, targetH, { fit: 'cover', position: 'center' })
                .webp({ quality: 80 });
            
            const info = await imagePipeline.toFile(outPath);
            console.log(`${item.id} | SUCCESS | ${Math.round(info.size / 1024)} KB`);
            
            await logCredit(item.id, item.subject);
        } catch (e) {
            console.error(`${item.id} | ERROR:`, e.message);
        }
    }
}

main().catch(console.error);
