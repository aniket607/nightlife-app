"use client"
import { useState, useRef } from "react";
import { uploadFile } from "@/actions/uploadFile";

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
        <div className="max-w-md mx-auto p-6 bg-primary rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                {!uploading && !uploadedImageUrl && (
                    <div className="relative">
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
                            className="cursor-pointer bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition duration-300 inline-block"
                        >
                            Choose an Image
                        </label>
                    </div>
                )}
                {preview && !uploading && !uploadedImageUrl && (
                    <div className="relative">
                        <img src={preview} alt="Preview" className="max-w-full max-h-48 mx-auto rounded" />
                        <button 
                            type="button" 
                            onClick={handleRemove} 
                            className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
                {!uploadedImageUrl && (
                    <button 
                        type="submit" 
                        disabled={!file || uploading} 
                        className={`w-full py-2 px-4 rounded transition duration-300 ${
                            !file || uploading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-800 hover:bg-green-700 text-white'
                        }`}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                )}
            </form>
            {uploading && (
                <div className="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                        style={{width: `${uploadProgress}%`}}
                    ></div>
                </div>
            )}
            {uploadedImageUrl && (
                <div className="mt-4">
                    <p className="text-center font-semibold text-green-500">File uploaded successfully!</p>
                    <img src={uploadedImageUrl} alt="Uploaded" className="max-w-full mt-2 rounded" />
                </div>
            )}
        </div>    
    );
}
