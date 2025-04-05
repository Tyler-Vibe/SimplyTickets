'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  onUploadComplete: (fileData: {
    filename: string;
    originalFilename: string;
    mimetype: string;
    size: number;
    path: string;
  }) => void;
  attachments: Array<{
    id: number;
    filename: string;
    size: number;
  }>;
  onDeleteAttachment: (attachmentId: number) => Promise<void>;
}

export default function FileUpload({ onUploadComplete, attachments, onDeleteAttachment }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const fileData = await response.json();
        onUploadComplete(fileData);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (attachmentId: number) => {
    if (!confirm('Are you sure you want to delete this attachment?')) {
      return;
    }
    await onDeleteAttachment(attachmentId);
  };

  return (
    <div className="space-y-4">
      {attachments.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Attachments</label>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div 
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-gray-900 dark:text-black">{attachment.filename}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(attachment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`px-4 py-2 text-blue-600 hover:text-blue-800 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Add Attachments'}
        </button>
      </div>
    </div>
  );
} 