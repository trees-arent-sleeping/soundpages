import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ShowPage = ({ user }) => {
  const { id } = useParams();
  const [soundboard, setSoundboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [keys, setKeys] = useState({});
  const [stylesheetLoaded, setStylesheetLoaded] = useState(false);

  useEffect(() => {
    const fetchSoundboard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/soundboard/${id}`
        );
        console.log("fetched soundboard data:", response.data);
        setSoundboard(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchSoundboard();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keys[key]) {
        playSound(keys[key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys]);

  useEffect(() => {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "/styles/show.css";
    document.head.appendChild(linkElement);

    const handleLoad = () => {
      setStylesheetLoaded(true);
    };

    linkElement.addEventListener("load", handleLoad);

    return () => {
      document.head.removeChild(linkElement);
      linkElement.removeEventListener("load", handleLoad);
    };
  }, []);

  if (!stylesheetLoaded) {
    // renders the page only when the stylesheet has been loaded
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!soundboard) {
    return <div>Soundboard not found</div>;
  }

  const { title, image, sounds, description } = soundboard;
  let originalDescription = description;
  let currentSoundTitle = originalDescription;
  let playingSounds = [];

  const playSound = (id) => {
    const audio = document.getElementById(`sound-${id}`);
    const item = document.getElementById(`sound-item-${id}`);
    const descriptionElement = document.querySelector(
      ".soundboard-description"
    );

    if (audio.paused || audio.ended) {
      // only play if the audio is paused or has ended. prevent react error
      audio.play().catch((error) => {
        if (error.name === "NotAllowedError") {
          // the play request was interrupted, so pause and reset the audio
          audio.pause();
          audio.currentTime = 0;
        }
      });

      item.style.backgroundColor = "#889bbb";
      item.style.borderColor = "#889bbb";

      const completeTitle = document.getElementById(`button-${id}`).dataset
        .fulltitle;
      const img = document.querySelector(".soundboard-image").cloneNode(true);
      const container = document.createElement("div");
      container.className = "speaker";
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.appendChild(img);
      container.innerHTML += `<span style="vertical-align: middle;">➥ ${completeTitle}</span>`;
      descriptionElement.innerHTML = "";
      descriptionElement.appendChild(container);
      currentSoundTitle = completeTitle;

      if (!playingSounds.includes(id)) {
        playingSounds.push(id);
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
      item.style.backgroundColor = "#a6b7e2";
      item.style.borderColor = "#889bbb";

      const index = playingSounds.indexOf(id);
      if (index > -1) {
        playingSounds.splice(index, 1);
      }

      if (playingSounds.length === 0) {
        descriptionElement.innerText = originalDescription;
        currentSoundTitle = originalDescription;
      }
    }

    audio.addEventListener("ended", function () {
      item.style.backgroundColor = "#a6b7e2";
      item.style.borderColor = "#889bbb";

      const index = playingSounds.indexOf(id);
      if (index > -1) {
        playingSounds.splice(index, 1);
      }

      if (playingSounds.length === 0) {
        descriptionElement.innerText = originalDescription;
        currentSoundTitle = originalDescription;
      }
    });
  };

  const bindKey = (id) => {
    const keyElement = document.getElementById(`key-${id}`);
    const key = keyElement.value;
    setKeys((prevKeys) => ({ ...prevKeys, [key.toLowerCase()]: id }));
  };

  return (
    <div className="formerlyHTML">
      <div className="formerlyHead">
        <title>Soundpages - {title}</title>
      </div>
      <div className="formerlyBody">
        <nav>
          <div className="nav-top">
            <div className="title-image">
              {image && (
                <img
                  className="soundboard-image"
                  src={`http://localhost:3000/image/${id}`}
                  alt={title}
                />
              )}
              <h1>Soundpages - {title}</h1>
            </div>
          </div>
          <div className="nav-bottom">
            {user ? (
              <div className="links-logged-in">
                <div>
                  <a>Welcome, {user.username}!</a>
                  <a href={`/soundboards/${id}/edit`}>Edit this Soundboard</a>
                </div>
                <div className="nav-right">
                  <a href="http://localhost:3000/logout">Logout</a>
                  <a href="/">Return to Index</a>
                </div>
              </div>
            ) : (
              <div className="links">
                <a href="http://localhost:3000/auth/google">
                  Login with Google
                </a>
                <a href="/">Return to Index</a>
              </div>
            )}
          </div>
        </nav>
        <main>
          <div className="soundboard-header">
            {user && user.username && (
              <h2>
                {title} - a collection by {user.username} ☻
              </h2>
            )}
          </div>
          <div className="sounds-grid">
            {sounds.map((sound) => (
              <div
                className="sound-item"
                id={`sound-item-${sound.uniqueID}`}
                key={sound.uniqueID}
              >
                <div className="key-bind">
                  <input
                    type="text"
                    size="1"
                    id={`key-${sound.uniqueID}`}
                    maxLength="1"
                    placeholder=""
                    onChange={() => bindKey(sound.uniqueID)}
                  />
                </div>
                <button
                  onClick={() => playSound(sound.uniqueID)}
                  className="sound-button"
                  id={`button-${sound.uniqueID}`}
                  data-fulltitle={sound.title}
                >
                  {sound.title.slice(0, 29)}
                </button>
                <audio id={`sound-${sound.uniqueID}`}>
                  <source
                    src={`http://localhost:3000/sounds/${sound.uniqueID}`}
                    type={sound.contentType}
                  />
                </audio>
              </div>
            ))}
          </div>
        </main>
        <footer>
          <p className="soundboard-description">{description}</p>
        </footer>
        <script>
          {`
            document.addEventListener("DOMContentLoaded", () => {
              const handleKeyDown = (e) => {
                const key = e.key.toLowerCase();
                if (keys[key]) {
                  playSound(keys[key]);
                }
              };

              window.addEventListener("keydown", handleKeyDown);

              return () => {
                window.removeEventListener("keydown", handleKeyDown);
              };
            });
          `}
        </script>
      </div>
    </div>
  );
};

export default ShowPage;
