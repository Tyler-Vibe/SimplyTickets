import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid ticket ID' },
        { status: 400 }
      );
    }
    
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });
    
    if (!ticket) {
      return NextResponse.json(
        { message: 'Ticket not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { message: 'Error fetching ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Get the ticket with its attachments before deletion
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { attachments: true }
    });

    if (!ticket) {
      return new NextResponse('Ticket not found', { status: 404 });
    }

    // Delete associated files
    for (const attachment of ticket.attachments) {
      try {
        const filePath = join(process.cwd(), attachment.path);
        await unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
        // Continue with deletion even if file removal fails
      }
    }

    // Delete the ticket (this will cascade delete attachments due to prisma schema)
    await prisma.ticket.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);

    if (isNaN(id)) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const body = await request.json();

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority,
        owner: body.owner,
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 