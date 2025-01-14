"use client";

import { useState, useTransition, FormEvent } from "react";
import UploadForm from "@/components/UploadForm";
import { putEventData } from "@/actions/putEventData"; // Action for submitting event data
import toast, { Toaster } from "react-hot-toast";
import { ZodIssue } from "zod";
import DatePicker from "react-datepicker"; // React Datepicker for date selection
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles

interface EventFormSectionProps {
  userId: string;
  venueId: string;
}

const EventFormSection: React.FC<EventFormSectionProps> = ({ userId, venueId }) => {
  const [imageUrl, setImageUrl] = useState(""); // For storing event image URL
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(false); // Disable form after submission
  const [eventDate, setEventDate] = useState<Date | null>(null); // State for selected date
  const [eventTime, setEventTime] = useState<string>(""); // State for selected time

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submit & reload

    if (!isImageUploaded) {
      toast.error("Please upload an image before submitting the form.");
      return;
    }

    if (!eventDate || !eventTime) {
      toast.error("Please select a valid date and time.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append("eventDate", eventDate.toISOString().split("T")[0]); // Add formatted date
    formData.append("eventTime", eventTime); // Add time

    startTransition(async () => {
      try {
        const result = await putEventData(formData, userId, venueId);

        if (result.success) {
          setIsDisabled(true); // Disable all inputs and buttons
          toast.success("Event Added Successfully!");

          // Redirect after a delay
          setTimeout(() => {
            window.location.href = `/organizer/venue?id=${encodeURIComponent(venueId)}`;
          }, 2000); // Redirect after 2 seconds
        } else if (result.errors) {
          // Handle validation errors from Zod
          const errorMessages = result.errors.map((issue: ZodIssue) => issue.message).join("\n");
          toast.error(`Validation errors:\n${errorMessages}`);
        } else if (result.error) {
          // Handle server-side errors like duplicate event names
          toast.error(result.error); // Display the error returned by the server
        }
      } catch (error) {
        console.error("Unexpected Error:", error);
        toast.error("An unexpected error occurred while submitting the form.");
      }
    });
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <Toaster position="top-right" />
  
      <div className="w-full max-w-4xl p-8 bg-secondary rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">Add New Event</h2>
  
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Upload Section */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Upload Event Image</h3>
            <UploadForm setImageUrl={setImageUrl} setIsImageUploaded={setIsImageUploaded} />
          </div>
  
          {/* Form Section */}
          <div className="w-full md:w-1/2">
            <form
              className="space-y-6 border border-gray-700 p-5 rounded-lg shadow-md bg-gray-900/50"
              onSubmit={handleFormSubmit}
            >
              <input type="hidden" name="eventImgUrl" value={imageUrl} />
  
              {/* Event Name */}
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-300 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  id="eventName"
                  placeholder="Enter Event Name"
                  required
                  disabled={isDisabled}
                  className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>
  
              {/* Event Description */}
              <div>
                <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-300 mb-1">
                  Event Description
                </label>
                <textarea
                  name="eventDescription"
                  id="eventDescription"
                  placeholder="Enter Event Description"
                  required
                  disabled={isDisabled}
                  className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                ></textarea>
              </div>
  
              {/* Event Date */}
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-300 mb-1">
                  Event Date
                </label>
                <DatePicker
                  selected={eventDate}
                  onChange={(date: Date | null) => setEventDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Event Date"
                  className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  disabled={isDisabled}
                />
              </div>
  
              {/* Event Time */}
              <div>
                <label htmlFor="eventTime" className="block text-sm font-medium text-gray-300 mb-1">
                  Event Time
                </label>
                <input
                  type="time"
                  name="eventTime"
                  id="eventTime"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                  disabled={isDisabled}
                  className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>
  
              {/* Guest List Count */}
              <div>
                <label htmlFor="glCount" className="block text-sm font-medium text-gray-300 mb-1">
                  Guest List Count (GL Count)
                </label>
                <input
                  type="number"
                  name="glCount"
                  id="glCount"
                  min={0}
                  placeholder="Enter GL Count"
                  required
                  disabled={isDisabled}
                  className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>
  
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || isDisabled}
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
    </div>
  );
  
};

export default EventFormSection;
