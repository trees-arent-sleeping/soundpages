import React, { useEffect, useState } from "react";
import axios from "axios";
import Index from "./components/Index";
import ShowPage from "./components/Show";
import Create from "./components/Create";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user", { withCredentials: true })
      .then((res) => {
        console.log("user data!:", res.data);
        setUser(res.data);
      })
      .catch((err) => console.error("error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index isLoading={isLoading} user={user} />} />
        <Route path="/soundboards/:id" element={<ShowPage user={user} />} />
        <Route path="/soundboards/create" element={<Create />} />
      </Routes>
    </Router>
  );
}

export default App;
