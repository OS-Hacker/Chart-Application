import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";
import { FaSpinner } from "react-icons/fa"; // Import the spinner icon
import { MessageSquare } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // For navigation after login

  const { user, setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    const { email, password } = formData;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/login`,
        { email, password } // Send as JSON
      );

      if (response.status === 200) {
        const data = response.data;
        let userName = data?.user?.userName.split(" ")[0];

        toast.success(`Welcome ${userName} 👋`, {
          position: "top-center",
        });

        setUser(data);
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(data));

        // Clear form data
        setFormData({
          email: "",
          password: "",
        });

        // Redirect to home or another protected route
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg, {
        position: "top-center",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-center w-[400px] m-auto">
      <div>
        <div
          className="w-16 h-16 rounded-2xl m-auto mb-4 bg-primary/10 flex items-center
                     justify-center animate-bounce"
        >
          <MessageSquare className="w-8 h-8 text-primary " />
        </div>
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            // required
            value={formData.email}
            name="email"
            onChange={handleChange}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-black text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-black text-lg placeholder:text-base"
            value={formData.password}
            name="password"
            onChange={handleChange}
            // required
            type="password"
            placeholder="password"
          />

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-6 py-2  w-full text-xl placeholder:text-lg cursor-pointer hover:bg-[#333] transition-all duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center">
          New here?{"  "}
          <Link to="/signup" className="text-blue-600 cursor-pointer ml-1">
            Create new Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
