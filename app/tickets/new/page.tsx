import Link from 'next/link';
import { NewTicketForm } from './new-ticket-form';

export default function NewTicketPage() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/tickets" className="text-blue-500 hover:underline">
            ← Back to all tickets
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Create New Ticket</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <NewTicketForm />
        </div>
      </main>
    </div>
  );
} 