// @ts-expect-error - pdf-parse has a test-execution bug in ESM context when loading index.js directly, so we load the library file directly.
import pdfParser from "pdf-parse/lib/pdf-parse.js";
import type pdf from "pdf-parse";
import mammoth from "mammoth";

// Cast the direct file import to the correct pdf-parse types
const parsePdf = pdfParser as unknown as typeof pdf;

/**
 * Extracts plain text from an uploaded document (PDF, Word, or TXT).
 */
export async function parseDocument(buffer: Buffer, mimeType: string, filename?: string): Promise<string> {
  const fileExt = filename ? filename.split(".").pop()?.toLowerCase() : "";

  try {
    if (mimeType === "application/pdf" || fileExt === "pdf") {
      const parsed = await parsePdf(buffer);
      if (!parsed || typeof parsed.text !== "string") {
        throw new Error("Parsed PDF text is invalid or empty");
      }
      return parsed.text.trim();
    }

    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileExt === "docx"
    ) {
      const parsed = await mammoth.extractRawText({ buffer });
      if (!parsed || typeof parsed.value !== "string") {
        throw new Error("Parsed DOCX text is invalid or empty");
      }
      return parsed.value.trim();
    }

    // Default: treat as plain text file
    return buffer.toString("utf-8").trim();
  } catch (error: any) {
    console.error(`Error parsing document (mimeType: ${mimeType}, ext: ${fileExt}):`, error);
    // Fallback to raw string conversion if parser fails
    return buffer.toString("utf-8").trim();
  }
}
