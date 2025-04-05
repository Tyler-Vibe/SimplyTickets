'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';

export function NewTicketForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'LOW' as const,
    owner: '',
  });
  const [attachments, setAttachments] = useState<Array<{
    id: number;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the ticket first
      const ticketResponse = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!ticketResponse.ok) {
        throw new Error('Failed to create ticket');
      }

      const ticket = await ticketResponse.json();

      // Then create attachment records for the new ticket
      for (const attachment of attachments) {
        await fetch(`/api/tickets/${ticket.id}/attachments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: attachment.filename,
            path: attachment.path,
            mimetype: attachment.mimetype,
            size: attachment.size,
          }),
        });
      }

      router.push('/tickets');
      router.refresh();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to create ticket. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = (fileData: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  }) => {
    setAttachments(prev => [...prev, { ...fileData, id: Date.now() }]);
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-black"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-black"
          required
          rows={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Owner</label>
        <input
          type="text"
          value={formData.owner}
          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-black"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof formData.priority })}
          className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-black"
          required
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <FileUpload 
        onUploadComplete={handleUploadComplete}
        attachments={attachments}
        onDeleteAttachment={handleDeleteAttachment}
      />

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
} 