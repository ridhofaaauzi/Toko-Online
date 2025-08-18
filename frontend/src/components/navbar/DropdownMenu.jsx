import { Link } from "react-router-dom";

const DropdownMenu = ({ onLogout, onClose }) => (
  <div className="dropdown-menu">
    <Link to="/dashboard" className="dropdown-item" onClick={onClose}>
      Dashboard
    </Link>
    <Link to="/profile" className="dropdown-item" onClick={onClose}>
      View Profile
    </Link>
    <button onClick={onLogout} className="dropdown-item logout">
      Logout
    </button>
  </div>
);

export default DropdownMenu;
