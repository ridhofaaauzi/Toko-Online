import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <Link to="/" className="sidebar-title">
        My Dashboard
      </Link>
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link">
            Dashboard
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/dashboard/products" className="sidebar-link">
            Product Manage
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
