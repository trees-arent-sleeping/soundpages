import React from "react";
import "../styles/style.css";

function Soundboards({ soundboards }) {
  return (
    <div id="soundboards-container">
      {soundboards.map((soundboard, index) => (
        <div key={index} className="soundboard">
          <a href={`/soundboards/${soundboard._id}`}>
            <img
              src={`http://localhost:3000/image/${soundboard._id}`}
              alt={soundboard.name}
            />
          </a>
          <p className="soundboard-name">{soundboard.title}</p>
        </div>
      ))}
    </div>
  );
}

export default Soundboards;
