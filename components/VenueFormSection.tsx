"use client";

import { useState, useTransition, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { putVenueData } from "@/actions/putVenueData";
import DynamicUploadForm from "./DynamicUploadForm";
import { ZodIssue } from "zod";
import { toast, DynamicToaster } from './DynamicToast';

export default function VenueFormSection() {
  const [imageUrl, setImageUrl] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isImageUploaded) {
      toast.error("Please upload an image before submitting the form");
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await putVenueData(formData);

        if (result.success) {
          setIsDisabled(true);
          toast.success("Venue Added Successfully! Redirecting back to dashboard...");

          setTimeout(() => {
            window.location.href = "/organizer";
          }, 3000);
        } else if (result.errors) {
          const errorMessages = result.errors.map((issue: ZodIssue) => issue.message).join("\n");
          toast.error(`Validation errors:\n${errorMessages}`);
        } else if (result.error) {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred while adding the venue.");
        console.error(error);
      }
    });
  };

  return (
    <div className="w-full max-w-4xl bg-secondary rounded-xl shadow-2xl overflow-hidden">
      <DynamicToaster position="top-right" />
  
      <div className="flex flex-col md:flex-row">
        {/* Image Upload Section */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 bg-gray-900/50">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-5 sm:mb-6 text-center">
            Upload Venue Image
          </h2>
          <div className="max-w-sm mx-auto">
            <DynamicUploadForm
              setImageUrl={setImageUrl}
              setIsImageUploaded={setIsImageUploaded}
            />
          </div>
        </div>
  
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 bg-gray-800/50">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-5 sm:mb-6 text-center">
            Venue Details
          </h2>
          <div className="max-w-sm mx-auto">
            <form
              className="space-y-5"
              onSubmit={handleFormSubmit}
            >
              <input type="hidden" name="venueImgUrl" value={imageUrl} />
    
              <div className="space-y-2.5">
                <Label htmlFor="venue_name" className="text-sm sm:text-base text-gray-300">
                  Venue Name
                </Label>
                <Input
                  type="text"
                  placeholder="One8 Commune"
                  name="venue_name"
                  id="venue_name"
                  required
                  disabled={isDisabled}
                  className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 h-11"
                />
              </div>
  
              <div className="space-y-2.5">
                <Label htmlFor="venue_area" className="text-sm sm:text-base text-gray-300">
                  Area
                </Label>
                <Input
                  type="text"
                  placeholder="Vijay Nagar"
                  name="venue_area"
                  id="venue_area"
                  required
                  disabled={isDisabled}
                  className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 h-11"
                />
              </div>
  
              <div className="space-y-2.5">
                <Label htmlFor="venue_rating" className="text-sm sm:text-base text-gray-300">
                  Rating
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0-5"
                  name="venue_rating"
                  id="venue_rating"
                  required
                  disabled={isDisabled}
                  className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 h-11"
                />
              </div>
  
              <div className="space-y-2.5">
                <Label htmlFor="venue_addr" className="text-sm sm:text-base text-gray-300">
                  Complete Address
                </Label>
                <Input
                  type="text"
                  placeholder="Enter venue's complete address"
                  name="venue_addr"
                  id="venue_addr"
                  required
                  disabled={isDisabled}
                  className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 h-11"
                />
              </div>
  
              <div className="space-y-2.5">
                <Label htmlFor="locationUrl" className="text-sm sm:text-base text-gray-300">
                  Google Maps URL
                </Label>
                <Input
                  type="text"
                  placeholder="Enter venue's Google Maps URL"
                  name="locationUrl"
                  id="locationUrl"
                  required
                  disabled={isDisabled}
                  className="bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 h-11"
                />
              </div>
  
              <button
                type="submit"
                disabled={isPending || isDisabled}
                className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition duration-300 ${
                  isPending || isDisabled
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {isPending ? "Submitting..." : "Add Venue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
