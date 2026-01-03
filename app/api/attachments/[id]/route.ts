import { readFile, unlink } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

// Helper function to ensure uploads directory exists
const UPLOADS_DIR = join(process.cwd(), 'uploads');

import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure params.id exists and is a number
    const { id: paramId } = await context.params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return notFound();
    }

    // Get attachment info from database
    const attachment = await prisma.attachment.findUnique({
      where: { id }
    });

    if (!attachment) {
      return notFound();
    }

    try {
      // Remove leading slash if present and join with process.cwd()
      const relativePath = attachment.path.replace(/^\//, '');
      const filePath = join(process.cwd(), relativePath);
      
      console.log('Attempting to read file from:', filePath);
      console.log('Full process.cwd():', process.cwd());
      console.log('Attachment path from DB:', attachment.path);
      
      const fileBuffer = await readFile(filePath);

      // Return the file with appropriate headers
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': attachment.mimetype || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${attachment.filename}"`,
        },
      });
    } catch (fileError) {
      console.error('File read error:', fileError);
      return new Response('File not found', { status: 404 });
    }

  } catch (error) {
    console.error('API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await context.params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return new Response('Invalid ID', { status: 400 });
    }

    // Get attachment info before deletion
    const attachment = await prisma.attachment.findUnique({
      where: { id }
    });

    if (!attachment) {
      return new Response('Attachment not found', { status: 404 });
    }

    try {
      // Remove leading slash if present and join with process.cwd()
      const relativePath = attachment.path.replace(/^\//, '');
      const filePath = join(process.cwd(), relativePath);
      
      // Delete the file
      await unlink(filePath);
    } catch (fileError) {
      console.error('File deletion error:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete the database record
    await prisma.attachment.delete({
      where: { id }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 