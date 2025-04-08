import { Image, Send, X, Mic } from "lucide-react";
import { useCallback, useMemo, useState, useRef,useEffect } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { toast } from 'react-toastify';

const TypeInput = ({
  message,
  setMessage,
  submitHandler,
  imagePreview,
  fileInputRef,
  setImagePreview,
  loading,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  // Close picker when clicking outside
  const handleClickOutside = useCallback((e) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target)) {
      setPickerOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitHandler(e);
      }
    },
    [submitHandler]
  );

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImagePreview(file);
    },
    [setImagePreview]
  );

  const removeImage = useCallback(() => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [setImagePreview, fileInputRef]);

  const isSubmitDisabled = useMemo(
    () => !message.trim() && !imagePreview,
    [message, imagePreview]
  );

  return (
    <div className="fixed bottom-0 left-0 lg:left-90 right-0 border-gray-200 dark:border-gray-700">
      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 pt-3 relative">
          <div className="relative inline-block">
            <img
              src={URL.createObjectURL(imagePreview)}
              alt="Preview"
              className="max-w-[150px] max-h-[150px] object-contain rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
              type="button"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="flex items-center gap-2 w-full p-3"
      >
        {/* Emoji Button */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setPickerOpen(!pickerOpen)}
            aria-label="Emoji picker"
          >
            <span className="text-xl">😊</span>
          </button>

          {/* Emoji Picker */}
          {pickerOpen && (
            <div
              ref={pickerRef}
              className="absolute z-20 bottom-12 left-0 shadow-lg rounded-lg overflow-hidden"
            >
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="dark"
                previewPosition="none"
              />
            </div>
          )}
        </div>

        {/* Attachment Button */}
        <label
          htmlFor="file-input"
          className={`p-2 rounded-full transition-colors ${
            imagePreview
              ? "text-green-500"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          aria-label="Upload image"
        >
          <Image className="w-5 h-5" />
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </label>

        {/* Message Input */}
        <div className="flex-1">
          <input
            type="text"
            className="w-full py-2 px-4 bg-gray-100 dark:bg-neutral-700 rounded-full border-none focus:outline-none transition-all"
            placeholder="Type a message..."
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Type a message"
          />
        </div>

        {/* Send/Voice Message Button */}
        <div className="ml-2">
          {message.trim() || imagePreview ? (
            <button
              type="submit"
              className="w-10 h-10 p-2 rounded-full bg-gray-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center transition-colors"
              disabled={isSubmitDisabled || loading}
              aria-label="Send message"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          ) : (
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Voice message"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TypeInput;
