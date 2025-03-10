import { Image, Send, X } from "lucide-react";
import { useCallback, useMemo } from "react";

const TypeInput = ({
  message,
  setMessage,
  submitHandler,
  imagePreview,
  fileInputRef,
  setImagePreview,
  loading,
}) => {
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
      if (!file?.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

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
    () => !message.trim() || !imagePreview,
    [message, imagePreview]
  );

  return (
    <div className="fixed bottom-0 w-full sm:p-2">
      {imagePreview && (
        <div className="mb-3 flex flex-wrap justify-center sm:justify-start">
          <div className="relative max-w-[150px] sm:max-w-[100px]">
            <img
              src={URL.createObjectURL(imagePreview)}
              alt="Preview"
              className="w-full max-h-[150px] object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center"
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
        className="flex flex-wrap items-center gap-2"
      >
        <div className="flex gap-3 min-w-9/12">
          {/* Input Field */}
          <input
            type="text"
            className="flex-1 w-3xl input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Type a message"
          />

          {/* Clear Message Button */}
          {message && (
            <button
              type="button"
              className="btn btn-circle btn-sm sm:btn-md"
              onClick={() => setMessage("")}
              aria-label="Clear message"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Upload Image Button */}
          <label
            htmlFor="file-input"
            className={`btn btn-circle btn-sm sm:btn-md ${
              imagePreview ? "text-emerald-500" : "text-gray-400"
            }`}
            aria-label="Upload image"
          >
            <Image className="w-4 h-4 sm:w-5 sm:h-5" />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Send Message Button */}
          <button
            type="submit"
            className="btn btn-circle btn-sm sm:btn-md"
            disabled={isSubmitDisabled}
            aria-label="Send message"
          >
            {loading && (message.trim() || imagePreview) ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TypeInput;
