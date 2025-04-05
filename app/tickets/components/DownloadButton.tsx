'use client';

interface DownloadButtonProps {
  attachmentId: number;
  filename: string;
}

export default function DownloadButton({ attachmentId, filename }: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/attachments/${attachmentId}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
    >
      Download
    </button>
  );
} 