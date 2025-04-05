import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Define the upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Save a file to the upload directory
export async function saveFile(file: File): Promise<{ filename: string; path: string; mimetype: string; size: number }> {
  await ensureUploadDir();
  
  // Generate a unique filename
  const timestamp = Date.now();
  const originalName = file.name;
  const extension = path.extname(originalName);
  const basename = path.basename(originalName, extension);
  const sanitizedBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${sanitizedBasename}_${timestamp}${extension}`;
  
  // Create the file path
  const filePath = path.join(UPLOAD_DIR, filename);
  const relativePath = `/uploads/${filename}`;
  
  // Convert the file to an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Write the file to disk
  await writeFile(filePath, buffer);
  
  return {
    filename: originalName,
    path: relativePath,
    mimetype: file.type,
    size: file.size,
  };
} 