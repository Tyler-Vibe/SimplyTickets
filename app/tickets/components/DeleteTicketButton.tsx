'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteTicketButtonProps {
  ticketId: number;
}

export default function DeleteTicketButton({ ticketId }: DeleteTicketButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      router.push('/tickets');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete ticket. Please try again.');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`px-4 py-2 rounded-md text-white transition-colors ${
        showConfirm 
          ? 'bg-red-600 hover:bg-red-700' 
          : 'bg-red-500 hover:bg-red-600'
      } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isDeleting 
        ? 'Deleting...' 
        : showConfirm 
          ? 'Click again to confirm' 
          : 'Delete Ticket'
      }
    </button>
  );
} 