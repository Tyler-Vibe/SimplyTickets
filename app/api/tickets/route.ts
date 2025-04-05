import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { saveFile } from '@/lib/file-storage';

async function generateSequentialTicketNumber() {
  // Find the highest ticket number
  const highestTicket = await prisma.ticket.findFirst({
    orderBy: {
      id: 'desc',
    },
  });

  let nextNumber = 1; // Start with 1 if no tickets exist
  
  if (highestTicket) {
    // Extract the number from the existing ticket number (e.g., "Ticket-123" -> 123)
    const match = highestTicket.ticketNumber.match(/Ticket-(\d+)/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }
  
  // Format with Ticket prefix and no padding (e.g., Ticket-1, Ticket-2)
  return `Ticket-${nextNumber}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON data
    const data = await request.json();

    // Generate sequential ticket number
    const ticketNumber = await generateSequentialTicketNumber();

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        owner: data.owner,
        ticketNumber, // Use the generated sequential number
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { message: 'Error creating ticket' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching tickets' },
      { status: 500 }
    );
  }
} 