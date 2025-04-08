import { Image, Send, X, Mic } from "lucide-react";
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
    () => !message.trim() && !imagePreview,
    [message, imagePreview]
  );

  return (
    <div className="fixed bottom-0 left-0 lg:left-90 right-0">
      {/* Image Preview */}
      {imagePreview && (
        <div className="px-2 pt-2">
          <div className="relative inline-block">
            <img
              src={URL.createObjectURL(imagePreview)}
              alt="Preview"
              className="w-[100px] h-[100px] object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm"
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
        className="flex items-center gap-2 w-full p-2"
      >
        {/* Emoji Button */}
        <button
          type="button"
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Emoji"
        >
          <span className="text-xl">😊</span>
        </button>

        {/* Attachment Button */}
        <label
          htmlFor="file-input"
          className={`p-2 rounded-full ${
            imagePreview
              ? "text-green-500"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          aria-label="Upload image"
        >
          <Image className="w-5 h-5" />
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Message Input */}
        <div className="flex-1">
          <input
            type="text"
            className="w-full py-2 px-4 bg-gray-100 dark:bg-neutral-700 rounded-full border-none focus:outline-none "
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
              className="w-9 h-9 p-2 rounded-full bg-gray-500 text-white disabled:opacity-50 flex items-center justify-center"
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
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
