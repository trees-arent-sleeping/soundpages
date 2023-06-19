import React, { useEffect } from "react";
import NavIndex from "./NavIndex";
import Soundboards from "./Soundboards";

const IndexPage = ({ isLoading, user, soundboards }) => {
  useEffect(() => {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "/styles/frontpage.css";
    document.head.appendChild(linkElement);

    return () => {
      document.head.removeChild(linkElement);
    };
  }, []);

  return (
    <div>
      <NavIndex isLoading={isLoading} user={user} />
      <Soundboards />
    </div>
  );
};

export default IndexPage;
