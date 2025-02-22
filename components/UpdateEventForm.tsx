"use client";

import {
  useState,
  useTransition,
  FormEvent,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import UploadForm from "@/components/UploadForm";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker"; // React Datepicker for date selection
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import { updateEventData } from "@/actions/updateEventData";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
} from "react-icons/fa";
import Placeholder from "@tiptap/extension-placeholder";
import { MdDelete } from "react-icons/md";
import { fetchArtists } from "@/actions/fetchArtists";
import { upsertArtists } from "@/actions/upsertArtists";


interface Event {
  eventId: number; // Assuming `Int` maps to `number`
  eventName: string;
  eventDescription?: string | null; // Optional field
  eventDate: Date; // Maps to `DateTime`
  eventTime: Date; // `DateTime @db.Time` also maps to `Date`
  stagGlCount: number;
  coupleGl: boolean;
  coupleGlCount: number | null;
  eventImgUrl?: string | null; // Optional field
  venueId: string;
  eventType: string;
  userId: string;
  createdAt: Date; // Maps to `DateTime`
  artists: Artist[];
}

interface EventFormSectionProps {
  eventData: Event | null;
}

interface Artist {
  id: number;
  name: string;
}

const EVENT_TYPES = [
  "Regular Night",
  "Ladies Night",
  "Bollywood Night",
  "EDM Night",
  "Live Music",
  "Special Event",
  "Private Party",
] as const;

const UpdateEventForm: React.FC<EventFormSectionProps> = ({ eventData }) => {
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(false);

  const [eventName, setEventName] = useState(eventData?.eventName);
  const [eventDescription, setEventDescription] = useState(
    eventData?.eventDescription ?? ""
  );
  const [eventDate, setEventDate] = useState<Date | null>(
    eventData?.eventDate ? new Date(eventData.eventDate) : null
  );
  const [content, setContent] = useState(eventData?.eventDescription ?? ""); // Initialize content with eventDescription

  // Move time parsing logic to a separate function
  const parseEventTime = (timeData: Date | null) => {
    if (!timeData) return null;
    const time = new Date(timeData);
    const localDate = new Date();
    localDate.setHours(time.getUTCHours(), time.getUTCMinutes(), 0, 0);
    return localDate;
  };

  // Use useMemo for the initial time value
  const initialTime = useMemo(
    () => parseEventTime(eventData?.eventTime ?? null),
    [eventData?.eventTime]
  );

  // Use the memoized value in useState
  const [eventTime, setEventTime] = useState<Date | null>(initialTime);

  const [eventType, setEventType] = useState(eventData?.eventType);
  const [stagGlCount, setStagGlCount] = useState(eventData?.stagGlCount);
  const [coupleGl, setCoupleGl] = useState<boolean>(() => {
    return eventData?.coupleGl === true;
  });
  const [originalCoupleGlCount] = useState(eventData?.coupleGlCount || 0);
  const [coupleGlCount, setCoupleGlCount] = useState(() => {
    return eventData?.coupleGl === true ? eventData?.coupleGlCount || 0 : 0;
  });

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const [currentImageUrl] = useState<string>(eventData?.eventImgUrl || "");
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [isImageUpdated, setIsImageUpdated] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const [fields, setFields] = useState<Artist[]>(
    eventData?.artists && eventData.artists.length > 0
      ? eventData.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        }))
      : [{ id: Date.now(), name: "" }]
  );
  console.log(fields)

   const [suggestions, setSuggestions] = useState<Record<number, Artist[]>>({});
  
    const fetchSuggestions = async (query:string, id:number) => {
      if (!query.trim()) {
        setSuggestions((prev) => ({ ...prev, [id]: [] }));
        return;
      }
  
      try {
        const res = await fetchArtists(query); // Replace with your API endpoint
        // const data = res.map((item) => item.name);
        setSuggestions((prev) => ({ ...prev, [id]: res }));
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
  
    const handleInputChange = (id:number, name:string) => {
      setFields((prev) =>
        prev.map((field) => (field.id === id ? { ...field, name } : field))
      );
      fetchSuggestions(name, id);
    };
  
    const handleSuggestionClick = (id:number, name:string) => {
      setFields((prev) =>
        prev.map((field) => (field.id === id ? { ...field, name } : field))
      );
      setSuggestions((prev) => ({ ...prev, [id]: [] })); // Hide suggestions
    };
  
    const addField = () => {
      if (fields.length < 4) {
        setFields([...fields, { id: Date.now(), name: "" }]);
      }
    };
  
    const removeField = (id:number) => {
      setFields(fields.filter((field) => field.id !== id));
      setSuggestions((prev) => {
        const newSuggestions = { ...prev };
        delete newSuggestions[id];
        return newSuggestions;
      });
    };

  // Function to check if any field has changed
  const checkIfFieldsChanged = useCallback(() => {
    // Improve image change detection with error handling
    const hasImageChanged =
      isImageUpdated &&
      newImageUrl !== "" &&
      !imageUploadError &&
      newImageUrl !== eventData?.eventImgUrl;

    // Add null checks for dates
    const hasDateChanged =
      eventDate && eventData?.eventDate
        ? eventDate.toISOString() !==
          new Date(eventData.eventDate).toISOString()
        : false;

    const time = new Date(eventData?.eventTime ?? "");
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();
    // Create new date with UTC hours and minutes
    const localDate = new Date();
    localDate.setHours(hours, minutes, 0, 0);

    const hasTimeChanged =
      eventTime && localDate
        ? eventTime.toISOString() !== localDate.toISOString()
        : false;

    // Check if artists have changed
    const currentArtists = fields.map(field => field.name).filter(name => name.trim() !== "");
    const originalArtists = eventData?.artists?.map(artist => artist.name) || [];
    
    const hasArtistsChanged = 
      currentArtists.length !== originalArtists.length ||
      currentArtists.some((artist, index) => artist !== originalArtists[index]);

    return (
      eventName !== eventData?.eventName ||
      eventDescription !== eventData?.eventDescription ||
      hasDateChanged ||
      hasTimeChanged ||
      eventType !== eventData.eventType ||
      stagGlCount !== eventData.stagGlCount ||
      coupleGl !== eventData.coupleGl ||
      coupleGlCount !== (eventData.coupleGlCount || 0) ||
      hasImageChanged ||
      hasArtistsChanged
    );
  }, [
    eventData,
    eventName,
    eventDescription,
    eventDate,
    eventTime,
    eventType,
    stagGlCount,
    coupleGl,
    coupleGlCount,
    isImageUpdated,
    newImageUrl,
    imageUploadError,
    fields // Add fields to the dependency array
  ]);

  // Update submit button state based on field changes
  useEffect(() => {
    setIsSubmitEnabled(checkIfFieldsChanged());
  }, [checkIfFieldsChanged, isImageUpdated, newImageUrl, imageUploadError]);

  // Function to handle image upload status
  const handleImageUpload = (success: boolean, url: string) => {
    if (success && url) {
      setNewImageUrl(url);
      setImageUploadError(null);
      setIsImageUpdated(true);
    } else {
      setNewImageUrl("");
      setImageUploadError("Image upload failed. Please try again.");
      setIsImageUpdated(false);
    }
  };

  // Handle couple GL toggle
  const handleCoupleGlToggle = (enabled: boolean) => {
    setCoupleGl(enabled);
    if (!enabled) {
      setCoupleGlCount(0);
    } else {
      setCoupleGlCount(originalCoupleGlCount);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Add comprehensive validation
    if (!eventData?.userId || !eventData?.eventId || !eventData?.venueId) {
      toast.error("Missing required event data");
      return;
    }

    if (!eventDate || !eventTime) {
      toast.error("Please select a valid date and time.");
      return;
    }

    // Enhanced image validation
    if (isImageUpdated) {
      if (!newImageUrl) {
        toast.error(
          "Image upload failed or is incomplete. Please try uploading again."
        );
        return;
      }
      if (imageUploadError) {
        toast.error("Please resolve image upload errors before submitting");
        return;
      }
    }

    const formData = new FormData();

    // Log the values being sent
    console.log("Submitting form with coupleGl:", coupleGl);
    console.log("Submitting form with coupleGlCount:", coupleGlCount);

    // Use new image URL if updated and valid, otherwise keep the current one
    const finalImageUrl =
      isImageUpdated && newImageUrl && !imageUploadError
        ? newImageUrl
        : currentImageUrl;

    try {
      // Format date as YYYY-MM-DD using local time
      const year = eventDate.getFullYear();
      const month = (eventDate.getMonth() + 1).toString().padStart(2, "0");
      const day = eventDate.getDate().toString().padStart(2, "0");
      formData.append("eventDate", `${year}-${month}-${day}`);

      // Format time as HH:mm in local time instead of UTC
      const hours = eventTime.getHours().toString().padStart(2, "0");
      const minutes = eventTime.getMinutes().toString().padStart(2, "0");
      formData.append("eventTime", `${hours}:${minutes}`);

      formData.append("eventName", eventName ?? "");
      formData.append("eventDescription", eventDescription ?? "");
      formData.append("stagGlCount", String(stagGlCount)); // Example count

      // Be explicit about boolean conversion
      const coupleGlValue = coupleGl === true ? "true" : "false";
      console.log("Submitting coupleGl value:", coupleGlValue);
      formData.append("coupleGl", coupleGlValue);

      // Only append coupleGlCount if coupleGl is true
      if (coupleGl === true) {
        console.log("Submitting coupleGlCount:", coupleGlCount);
        formData.append("coupleGlCount", String(coupleGlCount));
      } else {
        console.log("Setting coupleGlCount to 0 for submission");
        formData.append("coupleGlCount", "0");
      }

      formData.append("eventImgUrl", finalImageUrl);
      formData.append("eventType", eventType ?? "");

          const selectedArtists = fields.map((field) => field.name).filter((name) => name.trim() !== "");
          formData.append("artistNames", JSON.stringify(selectedArtists))
          upsertArtists(selectedArtists)

      console.log("Final form data:", Object.fromEntries(formData));

      startTransition(async () => {
        try {
          const result = await updateEventData(
            formData,
            String(eventData.userId),
            String(eventData.eventId),
            String(eventData.venueId)
          );

          if (result.success) {
            toast.success("Event Updated Successfully!");
            setIsDisabled(true);

            // Add error handling for navigation
            const redirectUrl = `/organizer/myevents`;
            setTimeout(() => {
              try {
                window.location.href = redirectUrl;
              } catch (error) {
                console.error("Navigation error:", error);
                toast.error("Error navigating to venue page");
              }
            }, 2000);
          } else {
            // Handle different types of errors
            if (result.errors) {
              const errorMessages = (
                result.errors as Array<{ message: string }>
              )
                .map((issue) => issue.message)
                .join("\n");
              toast.error(`Validation errors:\n${errorMessages}`);
            } else if (result.error) {
              toast.error(result.error);
            }
          }
        } catch (error) {
          console.error("Unexpected Error:", error);
          toast.error(
            "An unexpected error occurred while submitting the form."
          );
          setIsDisabled(false); // Re-enable form on error
        }
      });
    } catch (error) {
      console.error("Form data preparation error:", error);
      toast.error("Error preparing form data");
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
    ],
    content: eventData?.eventDescription ?? "", // Set initial content
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setContent(newContent);
      setEventDescription(newContent); // Update both states together
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <Toaster position="top-right" />

      <div className="w-full max-w-4xl p-8 bg-secondary rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">
          Update Event
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Upload Section */}
          <div className="w-full md:w-1/2 h-96 flex flex-col items-center my-10">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Event Image
            </h3>

            {/* Show current image */}
            {currentImageUrl && !isImageUpdated && (
              <div className="mb-4 h-72 w-56 flex flex-col items-center justify-center">
                <Image
                  src={currentImageUrl}
                  alt="Current event"
                  className="w-full rounded-lg mb-2"
                  layout="responsive"
                  width={10}
                  height={10}
                />
                <button
                  type="button"
                  onClick={() => setIsImageUpdated(true)}
                  disabled={isPending || isDisabled}
                  className={`mt-2 px-4 py-2 rounded text-sm font-semibold transition-all duration-300 ${
                    isPending || isDisabled
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50 hover:bg-gray-800"
                      : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  Change Image
                </button>
              </div>
            )}

            {/* Show upload form when user wants to update image */}
            {isImageUpdated && (
              <div className="flex flex-col items-center justify-center">
                <UploadForm
                  setImageUrl={(url: string) => {
                    if (url) {
                      handleImageUpload(true, url);
                    } else {
                      handleImageUpload(false, "");
                    }
                  }}
                  setIsImageUploaded={(success: boolean) => {
                    if (!success) {
                      handleImageUpload(false, "");
                    }
                  }}
                  disabled={isPending || isDisabled}
                />
                {imageUploadError && (
                  <p className="text-red-500 text-sm mt-2">
                    {imageUploadError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsImageUpdated(false);
                    setNewImageUrl("");
                    setImageUploadError(null);
                  }}
                  className="mt-4 px-4 py-2 bg-red-700/40 text-gray-200 rounded hover:bg-red-600/70 transition"
                >
                  Cancel Image Change
                </button>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2">
            <form
              className="space-y-6 border border-gray-700 p-5 rounded-lg shadow-md bg-gray-900/50"
              onSubmit={handleFormSubmit}
            >
              <input type="hidden" name="eventImgUrl" value={currentImageUrl} />

              {/* Event Name */}
              <div>
                <label
                  htmlFor="eventName"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
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
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              {/* Event Description */}
              <div>
                <label
                  htmlFor="eventDescription"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Event Description
                </label>
                <div className="">
                  {/* Formatting Buttons */}
                  <div className="flex gap-2 mb-2 outline-none">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`px-3 py-1 border rounded ${
                        editor.isActive("bold") ? "bg-gray-300" : ""
                      }`}
                    >
                      <FaBold className="text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={`px-3 py-1 border rounded ${
                        editor.isActive("italic") ? "bg-gray-300" : ""
                      }`}
                    >
                      <FaItalic className="text-white" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
                      className={`px-3 py-1 border rounded ${
                        editor?.isActive("underline") ? "bg-gray-300" : ""
                      }`}
                    >
                      <FaUnderline className="text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      className={`px-3 py-1 border rounded ${
                        editor.isActive("bulletList") ? "bg-gray-300" : ""
                      }`}
                    >
                      <FaListUl className="text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      className={`px-3 py-1 border rounded ${
                        editor.isActive("orderedList") ? "bg-gray-300" : ""
                      }`}
                    >
                      <FaListOl className="text-white" />
                    </button>
                  </div>
                  {/* Editor Content */}
                  <div className="mt-2 prose prose-p:m-0 prose-li:m-0 prose-ul:m-0 prose-ol:m-0 prose-ol:text-white text-white [&_strong]:text-white">
                    <div className="w-full bg-gray-800 border border-gray-700 rounded group focus-within:ring-2 focus-within:ring-gray-600 focus-within:border-gray-600">
                      <EditorContent
                        placeholder="Enter Event Description"
                        editor={editor}
                        className="w-full text-gray-200 placeholder:text-gray-500 p-3 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Time Container */}
              <div className="grid grid-cols-2 gap-4">
                {/* Event Date */}
                <div>
                  <label
                    htmlFor="eventDate"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Event Date
                  </label>
                  <DatePicker
                    selected={eventDate}
                    onChange={(date: Date | null) => setEventDate(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select Date"
                    minDate={new Date()}
                    className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    disabled={isDisabled}
                    calendarClassName="bg-gray-800 border-gray-700 text-gray-200"
                    dayClassName={() => "hover:bg-gray-700 rounded-full"}
                  />
                </div>

                {/* Event Time */}
                <div>
                  <label
                    htmlFor="eventTime"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Event Time
                  </label>
                  <DatePicker
                    selected={eventTime}
                    onChange={(time: Date | null) => setEventTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select Time"
                    className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    disabled={isDisabled}
                    calendarClassName="bg-gray-800 border-gray-700 text-gray-200"
                  />
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label
                  htmlFor="eventType"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Event Type
                </label>
                <select
                  name="eventType"
                  id="eventType"
                  required
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  disabled={isDisabled}
                  className="w-full bg-gray-800 border-gray-700 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  <option value="" className="bg-gray-800">
                    Select Event Type
                  </option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-gray-800">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stag Guest List Count */}
              <div>
                <label
                  htmlFor="stagGlCount"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Stag Guest List Count
                </label>
                <input
                  type="number"
                  name="stagGlCount"
                  id="stagGlCount"
                  min={0}
                  placeholder="Enter Stag GL Count"
                  required
                  disabled={isDisabled}
                  className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  value={stagGlCount}
                  onChange={(e) => setStagGlCount(Number(e.target.value))}
                />
              </div>

              {/* Couple GL Option */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Allow Couple Guest List?
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="coupleGl"
                      value="true"
                      checked={coupleGl === true}
                      onChange={() => handleCoupleGlToggle(true)}
                      disabled={isDisabled}
                      className="form-radio text-gray-600 bg-gray-800 border-gray-700"
                    />
                    <span className="ml-2 text-gray-300">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="coupleGl"
                      value="false"
                      checked={coupleGl === false}
                      onChange={() => handleCoupleGlToggle(false)}
                      disabled={isDisabled}
                      className="form-radio text-gray-600 bg-gray-800 border-gray-700"
                    />
                    <span className="ml-2 text-gray-300">No</span>
                  </label>
                </div>
              </div>

              {/* Couple GL Count - Conditionally rendered */}
              {coupleGl && (
                <div id="coupleGlCountContainer">
                  <label
                    htmlFor="coupleGlCount"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Couple Guest List Count
                  </label>
                  <input
                    type="number"
                    name="coupleGlCount"
                    id="coupleGlCount"
                    min={0}
                    placeholder="Enter Couple GL Count"
                    disabled={isDisabled}
                    value={coupleGlCount}
                    onChange={(e) => setCoupleGlCount(Number(e.target.value))}
                    className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Artists
                </label>

                {fields.map((field) => (
                  <div key={field.id} className="mb-4">
                    <div className="flex justify-center items-center">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        placeholder="Enter artist name"
                      />
                      {fields.length > 1 && (
                        <button
                          onClick={() => removeField(field.id)}
                          className="p-2 bg-red-500 text-white rounded ml-5"
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>

                    {suggestions[field.id]?.length > 0 && (
                      <ul className="border border-gray-300 mt-1 bg-white">
                        {suggestions[field.id].map((artist) => (
                          <li
                            key={artist.id}
                            onClick={() =>
                              handleSuggestionClick(field.id, artist.name)
                            }
                            className="p-2 cursor-pointer hover:bg-gray-100"
                          >
                            {artist.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {fields.length < 4 && (
                  <button
                    type="button"
                    className={`py-2 px-4 rounded transition duration-300 ${
                      isPending || isDisabled
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50 hover:bg-gray-800"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      addField();
                    }}
                    disabled={isPending || isDisabled}
                  >
                    Add More Artist
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || isDisabled || !isSubmitEnabled}
                className={`w-full py-2 px-4 rounded transition duration-300 ${
                  isPending || isDisabled || !isSubmitEnabled
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50 hover:bg-gray-800"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                }`}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Event"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventForm;
