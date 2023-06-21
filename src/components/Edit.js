import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// to make sure redirect only happens after deletion
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditSoundboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [soundboard, setSoundboard] = useState({
    title: "",
    description: "",
    sounds: [],
  });
  const [newSounds, setNewSounds] = useState([]);
  const [deleteSounds, setDeleteSounds] = useState([]);

  useEffect(() => {
    const fetchSoundboard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/soundboard/${id}`
        );
        console.log("fetched soundboard data:", response.data);
        setSoundboard({ ...response.data, sounds: response.data.sounds || [] });
      } catch (err) {
        console.error(err);
        alert("Error fetching soundboard. Please try again.");
      }
    };

    fetchSoundboard();
  }, [id]);

  const [stylesheetLoaded, setStylesheetLoaded] = useState(false);

  // dynamically load css
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

  if (!stylesheetLoaded) {
    // renders the page only when the stylesheet has been loaded
    return null;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", soundboard.title);
    formData.append("description", soundboard.description);
    formData.append("image", e.target.image.files[0]);

    soundboard.sounds.forEach((sound, index) => {
      const updatedTitle = e.target.elements[`editTitles[${sound._id}]`].value;
      const updatedSound =
        e.target.elements[`editSounds[${sound._id}]`].files[0];
      formData.append(`editTitles[${sound._id}]`, updatedTitle);
      formData.append(`editSounds[${sound._id}]`, updatedSound);
    });

    deleteSounds.forEach((soundId) => {
      formData.append("deleteSounds[]", soundId);
    });

    newSounds.forEach((sound, index) => {
      formData.append(`newTitle[${index}]`, sound.title);
      formData.append(`audioFile[${index}]`, sound.file);
    });

    try {
      console.log("deleteSounds:", deleteSounds);
      // send the form data to the server
      const response = await axios.put(
        `http://localhost:3000/soundboards/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // delete sounds on frontend
      setSoundboard((prevSoundboard) => {
        const updatedSounds = prevSoundboard.sounds.filter(
          (sound) => !deleteSounds.includes(sound._id)
        );
        return { ...prevSoundboard, sounds: updatedSounds };
      });

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (err) {
      console.error(err);
      alert("Error updating soundboard. Please try again.");
    }
  };

  const addNewSoundField = () => {
    setNewSounds((prevSounds) => [...prevSounds, { title: "", file: null }]);
  };

  const deleteSoundboard = async () => {
    try {
      console.log(`deleting soundboard with ID: ${id}`);
      await axios.delete(`http://localhost:3000/soundboards/${id}`, {
        withCredentials: true,
      });
      // prevent page from trying to grab the deleted soundboard
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error deleting soundboard. Please try again.");
    }
  };

  const toggleDelete = (soundId) => {
    console.log("toggling delete for soundId:", soundId);

    setDeleteSounds((prevDeleteSounds) => {
      const updatedDeleteSounds = prevDeleteSounds.includes(soundId)
        ? prevDeleteSounds.filter((id) => id !== soundId)
        : [...prevDeleteSounds, soundId];

      console.log("updated deleteSounds:", updatedDeleteSounds);
      return updatedDeleteSounds;
    });
  };

  const handleTitleChange = (e) => {
    setSoundboard({ ...soundboard, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setSoundboard({ ...soundboard, description: e.target.value });
  };

  return (
    <div className="newBODY">
      <h1>Editing {soundboard.title}</h1>
      <hr />
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <div className="grid-container">
          <div className="grid-item">
            <label htmlFor="title">Title:</label>
            <br />
            <input
              type="text"
              name="title"
              value={soundboard.title}
              onChange={handleTitleChange}
            />
            <br />
          </div>
          <div className="grid-item">
            <label htmlFor="description">Description:</label>
            <br />
            <input
              type="text"
              name="description"
              value={soundboard.description}
              onChange={handleDescriptionChange}
            />
            <br />
          </div>
          <div className="grid-item">
            <label htmlFor="image">Image:</label>
            <br />
            <input type="file" name="image" />
            <br />
          </div>
        </div>
        <h2>Edit buttons and select button to delete</h2>
        <div className="edit-container">
          {soundboard.sounds &&
            soundboard.sounds.map((sound) => (
              <div className="edit-item" key={sound._id}>
                <p className="yes"></p>
                <input
                  className="button-check"
                  type="checkbox"
                  name="deleteSounds[]"
                  value={sound._id}
                  onChange={() => toggleDelete(sound._id)}
                />
                <input
                  className="edit-input"
                  type="text"
                  name={`editTitles[${sound._id}]`}
                  defaultValue={sound.title}
                />
                <input
                  className="edit-input"
                  type="file"
                  name={`editSounds[${sound._id}]`}
                />
              </div>
            ))}
        </div>
        <h2>Add more buttons</h2>
        <div id="newSoundsContainer">
          {newSounds.map((sound, index) => (
            <div className="sound" key={index}>
              <input
                type="text"
                name={`newTitle[${index}]`}
                placeholder="TITLE"
                onChange={(e) => {
                  const updatedSounds = [...newSounds];
                  updatedSounds[index].title = e.target.value;
                  setNewSounds(updatedSounds);
                }}
              />
              ——————
              <input
                type="file"
                name={`audioFile[${index}]`}
                onChange={(e) => {
                  const updatedSounds = [...newSounds];
                  updatedSounds[index].file = e.target.files[0];
                  setNewSounds(updatedSounds);
                }}
              />
            </div>
          ))}
        </div>
        <div className="button-container">
          <input
            type="button"
            value="Add New Sound"
            onClick={addNewSoundField}
          />
        </div>
        <hr />
        <button type="submit">Submit Changes</button>
      </form>
      <a href={`/soundboards/${id}`}>
        <button type="button">Return to Soundboard</button>
      </a>
      <div className="button-container">
        <button type="button" onClick={deleteSoundboard}>
          Delete Soundboard
        </button>
      </div>
    </div>
  );
};

export default EditSoundboard;
