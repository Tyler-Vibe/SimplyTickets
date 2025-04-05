import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { isImageFile } from '@/app/lib/file-utils';

export default async function ViewAttachmentPage({ params }: { params: { id: string } }) {
  const { id: paramId } = await params;
  const id = parseInt(paramId);
  
  if (isNaN(id)) {
    notFound();
  }

  const attachment = await prisma.attachment.findUnique({
    where: { id }
  });

  if (!attachment || !isImageFile(attachment.mimetype)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="relative max-w-[75vw] max-h-[90vh] mx-auto">
        <div className="flex items-center justify-center">
          <img
            src={`/api/attachments/${attachment.id}`}
            alt={attachment.filename}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
        <div className="absolute top-0 right-0 m-4 bg-black/50 p-2 rounded text-white text-sm">
          {attachment.filename}
        </div>
      </div>
    </div>
  );
} 