"use client"
import { useState, useRef } from "react";
import { uploadFile } from "@/actions/uploadFile";
import Image from "next/image";

export default function UploadForm({ 
    setImageUrl, 
    setIsImageUploaded
  }: { 
    setImageUrl: (url: string) => void,
    setIsImageUploaded: (isUploaded: boolean) => void
  })  {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleRemove = () => {
        setFile(undefined);
        setPreview(null);
        setUploadProgress(0);
        setUploadedImageUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file) {
            setUploading(true);
            setUploadProgress(0);
            try {
                const formData = new FormData();
                formData.append("file", file);
                
                const interval = setInterval(() => {
                    setUploadProgress(prev => Math.min(prev + 10, 90));
                }, 500);
    
                const result = await uploadFile(formData);
                clearInterval(interval);
                setUploadProgress(100);
                
                if (result.url) {
                    setImageUrl(result.url);
                    setUploadedImageUrl(result.url);
                    setIsImageUploaded(true);  // Set to true when upload is successful
                } else {
                    console.error("Upload failed: No URL returned");
                }
            } catch (error) {
                console.error("Upload error:", error);
            } finally {
                setUploading(false);
            }
        }
    };
    

    return (
        <div className="w-full bg-gray-900/30 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
                {!uploading && !uploadedImageUrl && (
                    <div className="flex flex-col items-center justify-center p-5 sm:p-6 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-500 transition-colors">
                        <input 
                            type="file" 
                            name="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="sr-only"
                            id="file-upload"
                        />
                        <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer text-center"
                        >
                            <div className="p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-3 text-sm sm:text-base text-gray-400">Click to upload venue image</p>
                                <p className="mt-2 text-xs sm:text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </label>
                    </div>
                )}
                
                {preview && !uploading && !uploadedImageUrl && (
                    <div className="relative rounded-lg overflow-hidden">
                        <Image
                            src={preview}
                            alt="Preview"
                            width={500}
                            height={300}
                            className="w-full h-56 sm:h-64 object-cover"
                        />
                        <button 
                            type="button" 
                            onClick={handleRemove} 
                            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-2.5 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button 
                            type="submit" 
                            disabled={!file || uploading} 
                            className={`absolute bottom-3 right-3 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                !file || uploading 
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                            }`}
                        >
                            Upload
                        </button>
                    </div>
                )}
            </form>
            
            {uploading && (
                <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm sm:text-base text-gray-400">Uploading image...</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out" 
                            style={{width: `${uploadProgress}%`}}
                        ></div>
                    </div>
                </div>
            )}
            
            {uploadedImageUrl && (
                <div className="p-5 sm:p-6 space-y-4">
                    <div className="rounded-lg overflow-hidden">
                        <Image
                            src={uploadedImageUrl}
                            alt="Uploaded"
                            width={500}
                            height={300}
                            className="w-full h-56 sm:h-64 object-cover"
                        />
                    </div>
                    <p className="text-sm sm:text-base font-medium text-green-500 text-center">
                        Image uploaded successfully!
                    </p>
                </div>
            )}
        </div>    
    );
}
