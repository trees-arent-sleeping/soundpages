import React, { useEffect, useState } from "react";
import NavIndex from "./NavIndex";
import Soundboards from "./Soundboards";

const IndexPage = ({ isLoading, user, soundboards }) => {
  const [stylesheetLoaded, setStylesheetLoaded] = useState(false);

  useEffect(() => {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "/styles/frontpage.css";
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

  return (
    <div>
      <NavIndex isLoading={isLoading} user={user} />
      <Soundboards />
    </div>
  );
};

export default IndexPage;
