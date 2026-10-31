import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function extractPdfText(filePath) {
    const buffer = await fs.readFile(filePath);

    const data = new Uint8Array(buffer);

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        text += content.items.map(item => item.str).join(" ") + "\n";
    }

    return text;
}