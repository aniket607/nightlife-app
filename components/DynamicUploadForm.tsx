"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const UploadForm = dynamic(() => import("@/components/UploadForm"), {
  loading: () => (
    <div className="w-full aspect-video bg-gray-800/50 rounded-lg animate-pulse">
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading upload component...</div>
      </div>
    </div>
  ),
  ssr: false
});

interface DynamicUploadFormProps {
  setImageUrl: (url: string) => void;
  setIsImageUploaded: (isUploaded: boolean) => void;
}

export default function DynamicUploadForm({ setImageUrl, setIsImageUploaded }: DynamicUploadFormProps) {
  return (
    <Suspense fallback={
      <div className="w-full aspect-video bg-gray-800/50 rounded-lg animate-pulse">
        <div className="h-full flex items-center justify-center">
          <div className="text-gray-500">Loading upload component...</div>
        </div>
      </div>
    }>
      <UploadForm setImageUrl={setImageUrl} setIsImageUploaded={setIsImageUploaded} />
    </Suspense>
  );
}
