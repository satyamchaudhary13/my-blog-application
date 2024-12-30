import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/posts/${id}`);
        setPost(res.data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user"); // Clear invalid data if parsing fails
      }
    }
  }, []);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiUrl}/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post deleted successfully");
        navigate("/");
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  if (!post) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Display post title */}
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">{post.title}</h2>
        {/* Display post author */}
        {post.author && (
          <p className="text-gray-600 mb-4">
            By <span className="font-medium text-blue-600">{post.author.username}</span>
          </p>
        )}
        {/* Display publication date */}
        <p className="text-gray-500 text-sm mb-4">
          Published on: {new Date(post.createdAt).toLocaleDateString()} at{" "}
          {new Date(post.createdAt).toLocaleTimeString()}
        </p>
        {/* Display post image if available */}
        {post.image && (
          <img
            src={`${apiUrl}${post.image}`}
            alt={post.title}
            className="w-full h-64 object-cover mb-6 rounded"
          />
        )}
        {/* Display post content */}
        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
        {/* Edit and delete options for the author */}
        {post.author && user && user.id === post.author._id && (
          <div className="mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded mr-4"
            >
              Delete Post
            </button>
            <button
              onClick={() => navigate(`/edit/${post._id}`)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Edit Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
