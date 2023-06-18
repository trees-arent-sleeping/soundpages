import React from "react";
import NavIndex from "./NavIndex";
import Soundboards from "./Soundboards";
import "../styles/style.css";

const IndexPage = ({ isLoading, user, soundboards }) => {
  return (
    <div>
      <NavIndex isLoading={isLoading} user={user} />
      <Soundboards soundboards={soundboards} />
    </div>
  );
};

export default IndexPage;
