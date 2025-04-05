import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest } from 'next/server';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
  try {
    // Ensure uploads directory exists
    try {
      await mkdir(UPLOADS_DIR, { recursive: true });
    } catch (err) {
      // Ignore error if directory already exists
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response('No file uploaded', { status: 400 });
    }

    // Generate a unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}-${randomString}-${safeFilename}`;
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const filePath = join(UPLOADS_DIR, uniqueFilename);
    await writeFile(filePath, buffer);

    // Return the file information with the correct relative path
    return new Response(JSON.stringify({
      filename: file.name, // Original filename
      originalFilename: file.name,
      mimetype: file.type,
      size: file.size,
      path: `/uploads/${uniqueFilename}` // Store path relative to project root with leading slash
    }), {
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response('Error uploading file', { status: 500 });
  }
} 