import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ticket Management System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            href="/tickets" 
            className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">View All Tickets</h2>
            <p className="text-gray-600 dark:text-gray-300">Browse, search and manage all tickets in the system</p>
          </Link>
          
          <Link 
            href="/tickets/new" 
            className="p-6 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Create New Ticket</h2>
            <p className="text-gray-600 dark:text-gray-300">Submit a new ticket to the system</p>
          </Link>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About This System</h2>
          <p className="mb-4">This ticket management system allows you to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Create tickets with unique ticket numbers</li>
            <li>Assign tickets to owners</li>
            <li>Set priority levels for each ticket</li>
            <li>Search and filter through all tickets</li>
            <li>View detailed information for each ticket</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
