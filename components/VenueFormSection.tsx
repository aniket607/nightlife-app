"use client";

import { useState, useTransition } from "react";
import UploadForm from "@/components/UploadForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { putvenuedata } from "@/app/actions/putvenuedata";
import toast, { Toaster } from 'react-hot-toast';

export default function VenueFormSection() {
  const [imageUrl, setImageUrl] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    if (!isImageUploaded) {
      toast.error("Please upload an image before submitting the form.");
      return;
    }
    startTransition(() => {
      putvenuedata(formData)
        .then(() => toast.success("Form submitted successfully!"))
        .catch(() => toast.error("An error occurred while submitting the form."));
    });
  };

  return (
<div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-2xl">
    <Toaster position="top-right" />
    <div className="flex flex-col md:flex-row gap-8 items-center">
        
      <div className="w-full md:w-1/2 ">
          <div className="px-28 font-bold">Upload Venue Image</div>
            <UploadForm setImageUrl={setImageUrl} setIsImageUploaded={setIsImageUploaded} />
      </div>

    <div className="w-full md:w-1/2">
      <form className="space-y-6 border p-5 rounded-lg shadow-md border-rose-500" action={handleSubmit}>
        <input type="hidden" name="imageUrl" value={imageUrl} />
    
        <div className="space-y-2">
          <Label htmlFor="venue_name" className="block mb-1">Venue Name</Label>
          <Input type="text" placeholder="One8 Commune" name="venue_name" id="venue_name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue_area" className="block mb-1">Venue Area</Label>
          <Input type="text" placeholder="Vijay Nagar" name="venue_area" id="venue_area" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue_rating" className="block mb-1">Venue Rating</Label>
          <Input 
            type="number" 
            step="0.1" 
            min="0" 
            max="5" 
            placeholder="Rating (0-5)"
            name="venue_rating"
            id="venue_rating"
            required
            className="w-32"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue_addr" className="block mb-1">Venue Address</Label>
          <Input type="text" placeholder="Enter Venue's Complete Address" name="venue_addr" id="venue_addr" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue_Url" className="block mb-1">Venue Location Url</Label>
          <Input type="text" placeholder="Enter Venue's Google maps Url" name="venue_Url" id="venue_Url" required />
        </div>

        <button 
            type="submit"
            className={`w-full py-2 px-4 rounded transition duration-300 ${
              !isPending
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={isPending}
        >
            {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  </div>
  </div>
  );
}
