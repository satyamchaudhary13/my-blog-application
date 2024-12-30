import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Home from "../src/pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "../src/pages/PostDetail";
import EditPost from "./pages/EditPost";
import { useState, useEffect } from "react";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkToken();
  }, []); 


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isAuthenticated && (
          <>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
