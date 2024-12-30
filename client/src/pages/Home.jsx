import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/posts`);
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiUrl}/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(posts.filter((post) => post._id !== postId)); // Update state locally
        alert("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Blog Posts</h1>
      {loading ? (
        <div className="text-center mt-52">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
            >
              {post.image && (
                <img
                  src={`${apiUrl}${post.image}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">{post.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{post.content.substring(0, 150)}...</p>
                <p className="text-gray-500 text-xs mt-2">
                  Published on: {new Date(post.createdAt).toLocaleDateString()} at{" "}
                  {new Date(post.createdAt).toLocaleTimeString()}
                </p>
                <div className="mt-4">
                  <Link to={`/posts/${post._id}`} className="text-blue-500 hover:text-blue-700 font-medium">
                    Read More
                  </Link>
                  {user && user.id === post.author._id && (
                    <>
                      <Link
                        to={`/edit/${post._id}`}
                        className="ml-4 text-green-500 hover:text-green-700 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="ml-4 text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">
          {user ? (
            <>
              <p className="text-gray-600 text-lg">No posts available. Create the first post now!</p>
              <Link
                to="/create"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Post
              </Link>
            </>
          ) : (
            <p className="text-gray-600 text-lg">No posts available. Log in to create posts!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
