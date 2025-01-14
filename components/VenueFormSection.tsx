"use client";

import { useState, useTransition, FormEvent } from "react";
import UploadForm from "@/components/UploadForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { putVenueData } from "@/actions/putVenueData";
import toast, { Toaster } from "react-hot-toast";
import { ZodIssue } from "zod";

export default function VenueFormSection() {
  const [imageUrl, setImageUrl] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(false); // New state to manage click disabling

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submit & reload

    if (!isImageUploaded) {
      toast.error("Please upload an image before submitting the form.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await putVenueData(formData);

        if (result.success) {
          setIsDisabled(true); // Disable all inputs and buttons
          toast.success("Venue Added Successfully! Redirecting back to dashboard...");

          // Redirect after a delay
          setTimeout(() => {
            window.location.href = "/organizer";
          }, 3000); // Redirect after 3 seconds
        } else if (result.errors) {
          // Handle validation errors from Zod
          const errorMessages = result.errors.map((issue: ZodIssue) => issue.message).join("\n");
          toast.error(`Validation errors:\n${errorMessages}`);
        } else if (result.error) {
          // Handle server-side errors like duplicate venue names
          toast.error(result.error); // Display the error returned by the server
        }
      } catch (error) {
        console.error("Unexpected Error:", error);
        toast.error("An unexpected error occurred while submitting the form.");
      }
    });
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-secondary rounded-lg shadow-2xl">
      <Toaster position="top-right" />
  
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2">
          <div className="px-24 font-bold text-lg text-gray-200 mb-5">Upload Venue Image:</div>
          <UploadForm
            setImageUrl={setImageUrl}
            setIsImageUploaded={setIsImageUploaded}
          />
        </div>
  
        <div className="w-full md:w-1/2">
          <form
            className="space-y-6 border border-gray-700 p-5 rounded-lg shadow-md bg-gray-900/50"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="venueImgUrl" value={imageUrl} />
  
            <div className="space-y-2">
              <Label htmlFor="venue_name" className="block mb-1 text-gray-300">
                Venue Name
              </Label>
              <Input
                type="text"
                placeholder="One8 Commune"
                name="venue_name"
                id="venue_name"
                required
                disabled={isDisabled} // Disable input if form is submitted
                className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_area" className="block mb-1 text-gray-300">
                Venue Area
              </Label>
              <Input
                type="text"
                placeholder="Vijay Nagar"
                name="venue_area"
                id="venue_area"
                required
                disabled={isDisabled}
                className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600"

              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_rating" className="block mb-1 text-gray-300">
                Venue Rating
              </Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating (0-5)"
                name="venue_rating"
                id="venue_rating"
                required
                className="w-32 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 "
                disabled={isDisabled}
                
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_addr" className="block mb-1 text-gray-300">
                Venue Address
              </Label>
              <Input
                type="text"
                placeholder="Enter Venue's Complete Address"
                name="venue_addr"
                id="venue_addr"
                required
                disabled={isDisabled}
                className=" bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 "

              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationUrl" className="block mb-1 text-gray-300">
                Venue Location Url
              </Label>
              <Input
                type="text"
                placeholder="Enter Venue's Google maps Url"
                name="locationUrl"
                id="locationUrl"
                required
                disabled={isDisabled}
                className=" bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 "

              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending || isDisabled} // Disable during pending or after success
              className={`w-full py-2 px-4 rounded transition duration-300 ${
                isPending || isDisabled
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
