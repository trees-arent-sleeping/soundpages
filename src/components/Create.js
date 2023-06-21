import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateSoundboard = () => {
  const [stylesheetLoaded, setStylesheetLoaded] = useState(false);
  const [sounds, setSounds] = useState([{ title: "", file: null }]);

  useEffect(() => {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "/styles/edit.css";
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

  const addSound = () => {
    setSounds([...sounds, { title: "", file: null }]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    sounds.forEach((sound, index) => {
      formData.append(`audioTitle[${index}]`, sound.title);
      formData.append(`audioFiles[${index}]`, sound.file);
    });
    try {
      await axios.post("http://localhost:3000/soundboards", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      // redirect to home
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Error creating soundboard. Please try again.");
    }
  };

  if (!stylesheetLoaded) {
    return null;
  }

  return (
    <div className="formerlyHTML">
      <h1>Create a Soundboard</h1>
      <hr />
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <label htmlFor="title">Title:</label>
        <br />
        <input type="text" id="title" name="title" required />
        <br />
        <label htmlFor="description">Description:</label>
        <br />
        <input type="text" id="description" name="description" required />
        <br />
        <label htmlFor="image">Image:</label>
        <br />
        <input type="file" id="image" name="image" required />
        <br />
        <br />
        {sounds.map((sound, index) => (
          <div id="newSoundsContainer" key={index}>
            <div className="marg">
              <input
                type="text"
                className="audioTitle"
                placeholder="TITLE"
                onChange={(e) => {
                  const newSounds = [...sounds];
                  newSounds[index].title = e.target.value;
                  setSounds(newSounds);
                }}
              />
              ——————
              <input
                type="file"
                className="audioFile"
                onChange={(e) => {
                  const newSounds = [...sounds];
                  newSounds[index].file = e.target.files[0];
                  setSounds(newSounds);
                }}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addSound}>
          Add another audio file
        </button>
        <br />
        <input type="submit" value="Create" />
      </form>
    </div>
  );
};

export default CreateSoundboard;
