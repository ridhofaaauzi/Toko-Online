import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useGoogleAuth = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: response.credential },
        { withCredentials: true }
      );
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("username", data.user.username);
      navigate("/profile");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
  };

  return { handleGoogleSuccess, handleGoogleError };
};
