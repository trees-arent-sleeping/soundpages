import React, { useEffect, useState } from "react";
import axios from "axios";
import IndexPage from "./components/Index";

function App() {
  const [soundboards, setSoundboards] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user", { withCredentials: true })
      .then((res) => {
        console.log("User data!:", res.data);
        setUser(res.data);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setIsLoading(false));
    axios
      .get("http://localhost:3000/soundboards")
      .then((res) => {
        console.log("Soundboards data:", res.data);
        setSoundboards(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <IndexPage isLoading={isLoading} user={user} soundboards={soundboards} />
    </div>
  );
}

export default App;
