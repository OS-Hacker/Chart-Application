import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";
import { BsEyeFill, BsEyeSlash } from "react-icons/bs";
import imagePic from "../assets/Images/avatar.png";
import { FaSpinner } from "react-icons/fa"; // Import the spinner icon

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [togglePassword, setTogglPassword] = useState(false);

  const handleProfileImage = (e) => {
    setProfileImage(e.target.files[0]);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setError("");
  };

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { userName, email, password } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("userName", userName);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
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
        toast.success(data.msg, { position: "top-center" });
        navigate("/");
        setUser(data);
        setFormData({ userName: "", email: "", password: "" });
        setProfileImage(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg, {
        position: "top-center",
      });
      console.log(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center align-center m-auto">
      <div className="p-7 h-screen flex flex-col justify-center w-[400px]">
        {" "}
        {/* Increased container width */}
        <form onSubmit={submitHandler}>
          <label htmlFor="profile" className="text-white flex justify-center">
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2 hover:ring-4 transition-all duration-300">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    className="cursor-pointer rounded-full"
                  />
                ) : (
                  <div className="relative">
                    <img
                      src={imagePic}
                      alt="Default Profile"
                      className="cursor-pointer rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </label>
          <p className="text-center text-sm text-gray-400 mt-2">
            Click to upload a profile picture
          </p>

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
            className="bg-[#eeeeee] mb-7 text-black rounded-lg px-3 py-2 border w-full text-xl placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
            className="bg-[#eeeeee] mb-7 text-black rounded-lg px-3 py-2  border w-full text-xl placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <label className="relative">
            <input
              className="bg-[#eeeeee] mb-7 text-black w-full rounded-lg px-3 py-2  border text-xl placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              type={togglePassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              name="password"
              onChange={handleChange}
            />
            <span
              className="absolute right-5 top-0 text-black cursor-pointer text-xl"
              onClick={() => setTogglPassword((prev) => !prev)}
              aria-label={togglePassword ? "Hide password" : "Show password"}
            >
              {togglePassword ? <BsEyeSlash /> : <BsEyeFill />}
            </span>
          </label>

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-6 py-2  w-full text-xl placeholder:text-lg cursor-pointer hover:bg-[#333] transition-all duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>
        <p className="text-center">
          Already have an account?
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            {"  "} Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
