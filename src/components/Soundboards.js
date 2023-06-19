import React, { useEffect, useState } from "react";
import axios from "axios";

function SoundboardsContainer() {
  const [soundboards, setSoundboards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/soundboards")
      .then((res) => {
        console.log("soundboards data:", res.data);
        const reducedData = res.data.map(({ _id, title }) => ({ _id, title }));
        setSoundboards(reducedData);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div id="soundboards-container" />;
  }

  return (
    <div id="soundboards-container">
      {soundboards.map((soundboard, index) => (
        <div key={index} className="soundboard">
          <a href={`/soundboards/${soundboard._id}`}>
            <img
              src={`http://localhost:3000/image/${soundboard._id}`}
              alt={soundboard.title}
            />
          </a>
          <p className="soundboard-name">{soundboard.title}</p>
        </div>
      ))}
    </div>
  );
}

export default SoundboardsContainer;
