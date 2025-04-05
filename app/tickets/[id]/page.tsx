import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DownloadButton from '../components/DownloadButton';
import DeleteTicketButton from '../components/DeleteTicketButton';
import EditTicketButton from '../components/EditTicketButton';
import { isImageFile, formatFileSize } from '@/app/lib/file-utils';

export default async function TicketPage({ params }: { params: { id: string } }) {
  const { id: paramId } = await params;
  const id = parseInt(paramId);
  
  if (isNaN(id)) {
    notFound();
  }
  
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      attachments: true // Include attachments in the query
    }
  });
  
  if (!ticket) {
    notFound();
  }
  
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/tickets" className="text-blue-500 hover:underline">
            ← Back to all tickets
          </Link>
          <div className="flex gap-2">
            <EditTicketButton ticket={ticket} />
            <DeleteTicketButton ticketId={ticket.id} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{ticket.title}</h1>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    #{ticket.ticketNumber}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created on {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-6">
                <span className="text-sm font-medium">Priority:</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md whitespace-pre-wrap">
                {ticket.description}
              </div>
            </div>
            
            {/* Add attachments section */}
            {ticket.attachments.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Attachments</h2>
                <div className="space-y-4">
                  {ticket.attachments.map((attachment) => (
                    <AttachmentPreview 
                      key={attachment.id} 
                      attachment={attachment} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Owner</h2>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {ticket.owner.charAt(0).toUpperCase()}
                </div>
                <span>{ticket.owner}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple file icon component
function FileIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
      />
    </svg>
  );
}

function PriorityBadge({ priority }: { priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }) {
  const colors = {
    LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    MEDIUM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[priority]}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}

function AttachmentPreview({ attachment }: { 
  attachment: { 
    id: number;
    filename: string;
    mimetype: string;
    size: number;
  }
}) {
  if (isImageFile(attachment.mimetype)) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
            <div className="font-medium flex items-center justify-between">
              <span>{attachment.filename}</span>
              <span className="text-sm text-gray-500">
                {formatFileSize(attachment.size)}
              </span>
            </div>
            <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <img
                src={`/api/attachments/${attachment.id}`}
                alt={attachment.filename}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <DownloadButton 
            attachmentId={attachment.id} 
            filename={attachment.filename}
          />
          <a
            href={`/attachments/${attachment.id}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 text-blue-500 hover:text-blue-600 text-sm"
          >
            View Full Size
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
      <div className="flex items-center gap-3">
        <FileIcon className="w-5 h-5 text-gray-500" />
        <div>
          <div className="font-medium">{attachment.filename}</div>
          <div className="text-sm text-gray-500">
            {formatFileSize(attachment.size)}
          </div>
        </div>
      </div>
      <DownloadButton 
        attachmentId={attachment.id} 
        filename={attachment.filename}
      />
    </div>
  );
} 