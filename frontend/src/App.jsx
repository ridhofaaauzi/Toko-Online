import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Profile from "./pages/profile/Profile";
import Home from "./pages/Home";
import EditProfile from "./pages/profile/EditProfile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm isLogin={true} />} />
          <Route path="/register" element={<AuthForm isLogin={false} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
