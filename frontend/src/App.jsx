import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthForm isLogin={true} />} />
          <Route path="/register" element={<AuthForm isLogin={false} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
