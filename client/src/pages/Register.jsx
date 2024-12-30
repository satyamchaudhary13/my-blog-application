import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [profilePicture, setProfilePicture] = useState(null); // For handling the profile picture
  const apiUrl = import.meta.env.VITE_API_URL;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    try {
      await axios.post(`${apiUrl}/api/auth/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Registration successful!");
    } catch (err) {
      alert("Error: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              name="username"
              type="text"
              id="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="profilePicture" className="block text-gray-700">Profile Picture</label>
            <input
              name="profilePicture"
              type="file"
              id="profilePicture"
              onChange={handleFileChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
