import mammoth from 'mammoth';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = ['.txt', '.docx'];

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx >= 0 ? filename.substring(idx).toLowerCase() : '';
}

/**
 * Convert plain text into HTML paragraphs.
 * Each non-empty line becomes a <p> block.
 */
function textToHtml(text: string): string {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p>${line}</p>`)
    .join('');
}

/**
 * Read a .txt file and return HTML paragraphs.
 */
async function readTxtFile(file: File): Promise<string> {
  const text = await file.text();
  return textToHtml(text);
}

/**
 * Read a .docx file using mammoth and return clean HTML.
 */
async function readDocxFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value; // clean HTML string
}

export interface ImportResult {
  html: string;
  fileName: string;
}

/**
 * Import a file (.txt or .docx) and return HTML content.
 * Throws on invalid extension or file too large.
 */
export async function importFile(file: File): Promise<ImportResult> {
  const ext = getExtension(file.name);

  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error(
      `The "${ext}" format is not supported. Accepted formats: ${SUPPORTED_EXTENSIONS.join(', ')}`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    );
  }

  let html: string;

  if (ext === '.txt') {
    html = await readTxtFile(file);
  } else {
    html = await readDocxFile(file);
  }

  return { html, fileName: file.name };
}
