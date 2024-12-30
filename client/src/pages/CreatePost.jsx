import { useState } from "react";
import axios from "axios";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // State for the image file
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to create a post.");
        return;
      }

      // Create FormData to send text and file data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(`${apiUrl}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      if (response.status === 201) {
        alert("Post created successfully");
        setTitle("");
        setContent("");
        setImage(null);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("An error occurred while creating the post.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
