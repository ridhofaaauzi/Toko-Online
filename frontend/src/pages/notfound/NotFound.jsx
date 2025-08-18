import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>Not Found</h1>
      <Link to="/dashboard">Back to Page</Link>
    </div>
  );
};

export default NotFound;
