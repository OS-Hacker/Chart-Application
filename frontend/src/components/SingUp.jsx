import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";

const SingUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirm_pass: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleProfileImage = (e) => {
    setProfileImage(e.target.files[0]);
    setError("");
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // remove error
    setError("");

    setLoading(false);
  };

  const Navigate = useNavigate();

  const [user, setUser] = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    const { userName, email, password, confirm_pass } = formData;

    // validations

    if (!userName.trim() || !email.trim() || !password.trim()) {
      setError("All Fields Required!");
      return;
    }

    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    // email
    if (!regex.test(email)) {
      setError("Please Enter Valid Email!");
      return;
    }

    // check password & confirm_pass
    if (password !== confirm_pass) {
      setError("Passwords do not match");
      return;
    } else if (password.length < 8) {
      setError("Password should be greater than 8 character");
      return;
    }

    // Check if profile image is selected
    if (!profileImage) {
      setError("Please select a profile image");
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("userName", userName);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    formDataToSend.append("confirm_pass", confirm_pass);
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/signup`,
        formDataToSend
      );

      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem("user", JSON.stringify(data));
        toast.success(data.msg, {
          position: "top-center",
        });
        Navigate("/");
        setUser(data);
        setFormData({
          userName: "",
          email: "",
          password: "",
          confirm_pass: "",
        });
        setProfileImage(null);
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        setError(
          error.response.data.message ||
            "An error occurred while creating the account. Please try again."
        );

        toast.error(response?.error?.data?.msg || "Failed to update user", {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center align-center m-auto">
      <div className="p-7 h-screen flex flex-col justify-center">
        <form onSubmit={submitHandler}>
          <label htmlFor="profile" className="text-white flex justify-center">
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    className="cursor-pointer"
                  />
                ) : (
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Default Profile"
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </label>

          <input
            hidden
            type="file"
            name="profile"
            id="profile"
            onChange={handleProfileImage}
            accept="image/*"
          />

          <h3 className="text-lg w-1/2 font-medium mb-2">What's your name</h3>
          <input
            className="bg-[#eeeeee] mb-7 text-black rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={formData.userName}
            name="userName"
            onChange={handleChange}
            type="text"
            placeholder="Enter Full Name"
          />

          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            value={formData.email}
            name="email"
            onChange={handleChange}
            className="bg-[#eeeeee] mb-7 text-black rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">
            Enter Password & Confirm-password
          </h3>

          <div className="flex gap-4 mb-7">
            <input
              className="bg-[#eeeeee] w-1/2 text-black rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="password"
              placeholder="Password"
              value={formData.password}
              name="password"
              onChange={handleChange}
            />
            <input
              className="bg-[#eeeeee] w-1/2 text-black rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="password"
              placeholder="Confirm-password"
              value={formData.confirm_pass}
              name="confirm_pass"
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-infinity loading-lg"></span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center">
          Already have an account?
          <Link to="/login" className="text-blue-600">
            {"  "} Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SingUp;
