'use client';

import { useState } from 'react';
import EditTicketForm from './EditTicketForm';

interface EditTicketButtonProps {
  ticket: {
    id: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    owner: string;
    attachments: Array<{
      id: number;
      filename: string;
      size: number;
    }>;
  };
}

export default function EditTicketButton({ ticket }: EditTicketButtonProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsEditing(true)}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors mr-2"
      >
        Edit Ticket
      </button>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Ticket</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <EditTicketForm 
              ticket={ticket} 
              onClose={() => setIsEditing(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
} 