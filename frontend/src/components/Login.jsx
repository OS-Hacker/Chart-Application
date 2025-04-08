import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { MessageSquare } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = formData;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/login`,
        { email, password }
      );

      if (response.status === 200) {
        const data = response.data;
        let userName = data?.user?.userName.split(" ")[0];

        toast.success(`Welcome ${userName} 👋`, {
          position: "top-center",
        });

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setFormData({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-center w-[400px] m-auto">
      <div>
        <div className="w-16 h-16 rounded-2xl m-auto mb-4 bg-primary/10 flex items-center justify-center animate-bounce">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            value={formData.email}
            name="email"
            onChange={handleChange}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-black text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            required
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <div className="relative mb-7">
            <input
              className="bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-black text-lg placeholder:text-base pr-10"
              value={formData.password}
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-6 py-2 w-full text-xl placeholder:text-lg cursor-pointer hover:bg-[#333] transition-all duration-300 flex items-center justify-center"
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
          New here?{" "}
          <Link to="/signup" className="text-blue-600 cursor-pointer ml-1">
            Create new Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
