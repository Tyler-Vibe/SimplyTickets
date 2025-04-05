import prisma from '@/lib/prisma';
import Link from 'next/link';
import { SearchForm } from './search-form';
import { Suspense } from 'react';
import PriorityBadge from './components/PriorityBadge';

type Attachment = {
  id: number;
  filename: string;
  size: number;
  mimetype: string;
  isMatch?: boolean;
};

type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  owner: string;
  ticketNumber: string;
  createdAt: Date;
  attachments: Attachment[];
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  // Await searchParams and destructure q
  const { q } = await searchParams;
  const searchQuery = typeof q === 'string' ? q : '';
  
  try {
    // Query that includes attachment filename search
    const tickets = await prisma.ticket.findMany({
      where: searchQuery ? {
        OR: [
          { title: { contains: searchQuery } },
          { description: { contains: searchQuery } },
          { owner: { contains: searchQuery } },
          { ticketNumber: { contains: searchQuery } },
          {
            attachments: {
              some: {
                filename: { contains: searchQuery }
              }
            }
          }
        ]
      } : undefined,
      include: {
        attachments: {
          select: {
            id: true,
            filename: true,
            size: true,
            mimetype: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Highlight matching attachments in the results
    const processedTickets = tickets.map(ticket => {
      if (!searchQuery) return ticket as Ticket;
      
      // Mark matching attachments
      const highlightedAttachments = ticket.attachments.map(attachment => ({
        ...attachment,
        isMatch: searchQuery && attachment.filename.toLowerCase().includes(searchQuery.toLowerCase())
      }));
      
      return {
        ...ticket,
        attachments: highlightedAttachments
      } as Ticket;
    });

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
          <main className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">All Tickets</h1>
              <Link 
                href="/tickets/new"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
              >
                Create New Ticket
              </Link>
            </div>
            
            <SearchForm initialSearch={searchQuery} />
            
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {processedTickets.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {searchQuery ? 'No tickets found matching your search.' : 'No tickets have been created yet.'}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ticket #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attachments</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {processedTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/tickets/${ticket.id}`} className="text-blue-500 hover:underline">
                            {ticket.ticketNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                            {ticket.title}
                          </Link>
                          {ticket.attachments.some(a => a.isMatch) && (
                            <div className="mt-1 text-xs text-gray-500">
                              Matching attachments: {ticket.attachments.filter(a => a.isMatch).map(a => a.filename).join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{ticket.owner}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {ticket.attachments.length > 0 && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ticket.attachments.some(a => a.isMatch) 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              {ticket.attachments.length} file{ticket.attachments.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error("Database error:", error);
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto bg-red-50 p-4 rounded-md border border-red-200">
          <h1 className="text-xl font-bold text-red-700">Database Error</h1>
          <p className="mt-2">There was a problem connecting to the database. Please try again later.</p>
        </div>
      </div>
    );
  }
} 