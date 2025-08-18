import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/UseAuth";
import { useDropdown } from "../../hooks/UseDropdown";
import DropdownMenu from "./DropdownMenu";
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const { ref, isOpen, toggle, close } = useDropdown();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/profile" className="navbar-logo">
          Online Shop
        </Link>
        <div className="nav-buttons">
          {isLoggedIn ? (
            <div className="dropdown-container" ref={ref}>
              <button onClick={toggle} className="profile-button">
                My Profile
                <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
                  ▼
                </span>
              </button>
              {isOpen && (
                <DropdownMenu onLogout={handleLogout} onClose={close} />
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
