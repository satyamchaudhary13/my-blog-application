import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });

      // Save the token and user details in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user details

      navigate("/"); // Redirect to the home page after login
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
