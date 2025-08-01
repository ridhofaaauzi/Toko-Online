import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Online Shop
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-links">
              Services
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links">
              Contact
            </Link>
          </li>
        </ul>
        <div className="nav-buttons">
          {isLoggedIn ? (
            <div className="dropdown-container" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="profile-button">
                My Profile
                <span
                  className={`dropdown-arrow ${showDropdown ? "open" : ""}`}>
                  ▼
                </span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}>
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
