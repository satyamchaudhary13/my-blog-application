import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const profilePictureUrl = profilePicture ? `${apiUrl}${profilePicture}` : null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
      setProfilePicture(user.profilePicture);
    }
  }, [localStorage.getItem("user")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsername(null);
    setProfilePicture(null);
    navigate("/login");
  };

  return (
    <nav className="bg-purple-700 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-yellow-300 text-2xl font-bold">
          Blogging Application
        </Link>

        <ul className="flex space-x-6 text-yellow-100">
          <li>
            <Link to="/" className="hover:text-yellow-300 transition duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-300 transition duration-200">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-yellow-300 transition duration-200">
              Contact
            </Link>
          </li>

          {!localStorage.getItem("token") ? (
            <>
              <li>
                <Link to="/login" className="hover:text-yellow-300 transition duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-yellow-300 transition duration-200">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/create-post" className="hover:text-yellow-300 transition duration-200">
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-yellow-300 transition duration-200">
                  Dashboard
                </Link>
              </li>
              <li className="flex items-center">
                {profilePictureUrl && (
                  <img
                    src={profilePictureUrl}
                    alt="Profile Picture"
                    className="w-8 h-8 rounded-full border-2 border-yellow-300 mr-2"
                  />
                )}
                <span className="text-yellow-200 font-medium">
                  Welcome, <span className="text-yellow-300">{username}</span>!
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 py-1 px-4 rounded-md text-white hover:bg-red-600 transition duration-200 shadow-md"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
