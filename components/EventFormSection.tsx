"use client";

import { useState, useTransition, FormEvent, useEffect } from "react";
import UploadForm from "@/components/UploadForm";
import { putEventData } from "@/actions/putEventData"; // Action for submitting event data
import { fetchArtists } from "@/actions/fetchArtists";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker"; // React Datepicker for date selection
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
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
import { MdDelete } from "react-icons/md";
import Placeholder from "@tiptap/extension-placeholder";
import { upsertArtists } from "@/actions/upsertArtists";

interface EventFormSectionProps {
  userId: string;
  venueId: string;
}

interface Artist {
  id: number;
  name: string;
}

interface Field {
  id: number;
  value: string;
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

const EventFormSection: React.FC<EventFormSectionProps> = ({
  userId,
  venueId,
}) => {
  const [imageUrl, setImageUrl] = useState(""); // For storing event image URL
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(false); // Disable form after submission
  const [eventDate, setEventDate] = useState<Date | null>(null); // State for selected date
  const [eventTime, setEventTime] = useState<Date | null>(null); // Changed to Date type for DatePicker
  const [content, setContent] = useState(""); // State to store editor content
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Field[]>([{ id: Date.now(), value: "" }]); // Initial input field
  const [suggestions, setSuggestions] = useState<Record<number, Artist[]>>({});
  const [coupleGl, setCoupleGl] = useState(false);
  const [coupleGlCount, setCoupleGlCount] = useState<number>(0);

  useEffect(() => {
    setDescription(content);
  }, [content]);

  const handleCoupleGlToggle = (enabled: boolean) => {
    setCoupleGl(enabled);
    if (!enabled) {
      setCoupleGlCount(0);
    }
  };

  const fetchSuggestions = async (query:string, id:number) => {
    if (!query.trim()) {
      setSuggestions((prev) => ({ ...prev, [id]: [] }));
      return;
    }

    try {
      const res = await fetchArtists(query);
      setSuggestions((prev) => ({ ...prev, [id]: res }));
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const handleInputChange = (id:number, value:string) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field))
    );
    fetchSuggestions(value, id);
  };

  const handleSuggestionClick = (id:number, name:string) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value: name } : field))
    );
    setSuggestions((prev) => ({ ...prev, [id]: [] })); // Hide suggestions
  };

  const addField = () => {
    if (fields.length < 4) {
      setFields([...fields, { id: Date.now(), value: "" }]);
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Start typing here.ff..",
      }),
    ], 
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

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

    // Format date as YYYY-MM-DD using local time
    const year = eventDate.getFullYear();
    const month = (eventDate.getMonth() + 1).toString().padStart(2, "0");
    const day = eventDate.getDate().toString().padStart(2, "0");
    formData.append("eventDate", `${year}-${month}-${day}`);

    // Format time as HH:mm
    const hours = eventTime.getHours().toString().padStart(2, "0");
    const minutes = eventTime.getMinutes().toString().padStart(2, "0");
    formData.append("eventTime", `${hours}:${minutes}`);

    formData.append("eventDescription", description);

    const selectedArtists = fields.map((field) => field.value).filter((name) => name.trim() !== "");
    formData.append("artistNames", JSON.stringify(selectedArtists))
    upsertArtists(selectedArtists)

    startTransition(async () => {
      try {
        const result = await putEventData(formData, userId, venueId);

        if (result.success) {
          setIsDisabled(true);
          toast.success("Event Added Successfully!");

          setTimeout(() => {
            window.location.href = `/organizer/venue?id=${encodeURIComponent(
              venueId
            )}`;
          }, 2000);
        } else if (result.errors) {
          // Updated error handling for Zod validation errors
          const errorMessages = (result.errors as Array<{ message: string }>)
            .map((issue) => issue.message)
            .join("\n");
          toast.error(`Validation errors:\n${errorMessages}`);
        } else if (result.error) {
          // Handle server-side errors
          toast.error(result.error);
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
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">
          Add New Event
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Upload Section */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Upload Event Image
            </h3>
            <UploadForm
              setImageUrl={setImageUrl}
              setIsImageUploaded={setIsImageUploaded}
            />
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
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`px-3 py-1 border rounded ${
                        editor.isActive("bold") ? "bg-gray-300" : ""
                      }`}
                    >
                      <FaBold className="text-white" />
                    </button>
                    <button
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
                <div>
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
                    required={coupleGl}
                    disabled={isDisabled}
                    value={coupleGlCount}
                    onChange={(e) => setCoupleGlCount(Number(e.target.value))}
                    className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>
              )}

              <div>
              <label
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Artists
                </label>

                {fields.map((field) => (
                  <div key={field.id} className="mb-4">
                    <div className="flex justify-center items-center">
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                      placeholder="Enter artist name"
                    />
                    {fields.length > 1 && (
                      <button
                        onClick={() => removeField(field.id)}
                        className=" p-2 bg-red-500 text-white rounded ml-5"
                      >
                        <MdDelete/>
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
