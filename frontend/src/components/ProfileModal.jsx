import { useAuth } from "../context/AuthProvider";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ProfileModal = () => {
  const {
    user,
    isProfileModalOpen,
    setIsProfileModalOpen,
    updateProfile,
    logout,
  } = useAuth();

  const [formData, setFormData] = useState({
    profileImage: "",
  });
  const [loading, setLoading] = useState({
    image: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (user && isProfileModalOpen) {
      setFormData({
        profileImage: user.user.profileImage || "",
      });
    }
  }, [user, isProfileModalOpen]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading((prev) => ({ ...prev, image: true }));
    setError(null);
    setSuccess(null);

    try {
      const uploadData = new FormData();
      uploadData.append("profileImage", file);

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/users/upload-image/${
          user?.user?._id
        }`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (res.data?.success) {
        const newProfileImage = res.data.profileImage;

        // Update form data
        setFormData({
          profileImage: newProfileImage,
        });

        // Update context
        await updateProfile({ profileImage: newProfileImage });

        // Update local storage
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          userData.user.profileImage = newProfileImage;
          localStorage.setItem("user", JSON.stringify(userData));
        }

        setSuccess("Profile image updated successfully");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
    }
  };

  if (!isProfileModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => !loading.image && setIsProfileModalOpen(false)}
        />

        <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            disabled={loading.image}
            className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
          >
            ✕
          </button>

          <h3 className="text-xl font-semibold text-white mb-6">Profile</h3>

          {user ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 w-full text-center">
                  <label
                    htmlFor="profileImageInput"
                    className="cursor-pointer relative inline-block"
                  >
                    <img
                      src={
                        formData.profileImage ||
                        user.user.profileImage ||
                        "/default-profile.png"
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-600 mx-auto hover:opacity-80 transition-opacity"
                    />
                    {loading.image && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </label>
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading.image}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Click image to upload new photo
                  </p>
                </div>

                <div className="text-center w-full">
                  <h2 className="text-xl font-bold text-white">
                    {user.user.userName}
                  </h2>
                  <p className="text-gray-400">{user.user.email}</p>

                  {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                  )}
                  {success && (
                    <p className="text-green-400 text-sm mt-2">{success}</p>
                  )}

                  <div className="mt-6">
                    <button
                      onClick={logout}
                      disabled={loading.image}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Please log in to view profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
