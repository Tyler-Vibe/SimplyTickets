import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = await params;
    const ticketId = parseInt(paramId);
    
    if (isNaN(ticketId)) {
      return new NextResponse('Invalid ticket ID', { status: 400 });
    }

    const body = await request.json();

    const attachment = await prisma.attachment.create({
      data: {
        filename: body.filename,
        path: body.path,
        mimetype: body.mimetype,
        size: body.size,
        ticketId: ticketId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('Create attachment error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 