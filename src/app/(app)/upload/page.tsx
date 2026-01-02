// app/upload/page.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function UploadPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setMessage('');
    const supabase = createClient();

    // Upload file to the 'book-pdfs' bucket
    const { error } = await supabase.storage
      .from('book-pdfs')
      .upload(file.name, file, {
        cacheControl: '3600',
        upsert: false, // Set to true to overwrite existing files
      });

    setUploading(false);

    if (error) {
      setMessage(`Error uploading file: ${error.message}`);
    } else {
      setMessage('File uploaded successfully!');
    }
  };

  return (
    <div className="container mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Upload PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} disabled={uploading} className="bg-blue-500 px-4 py-2 rounded">
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}