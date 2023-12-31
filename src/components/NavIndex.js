import React from "react";
import Create from "./Create";

const NavIndex = ({ isLoading, user }) => {
  if (isLoading) {
    return (
      <nav>
        <div className="nav-left">
          <h1>Soundpages</h1>
        </div>
        <div className="nav-right">
          <div className="links">
            <a href="http://localhost:3000/auth/google">Login with Google</a>
            <a href="http://localhost:3000/soundboards/create">
              Create New Soundboard
            </a>
          </div>
        </div>
      </nav>
    );
  }

  if (user) {
    return (
      <nav>
        <div className="nav-left">
          <h1>Soundpages</h1>
        </div>
        <div className="nav-right">
          <div className="links-logged-in">
            <a href="/">Welcome, {user.username}!</a>
            <a href="http://localhost:3000/logout">Logout</a>
            <a href="http://localhost:3000/soundboards/create">
              Create New Soundboard
            </a>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav>
        <div className="nav-left">
          <h1>Soundpages</h1>
        </div>
        <div className="nav-right">
          <div className="links">
            <a href="http://localhost:3000/auth/google">Login with Google</a>
            <a href="http://localhost:3000/soundboards/create">
              Create New Soundboard
            </a>
          </div>
        </div>
      </nav>
    );
  }
};

export default NavIndex;
