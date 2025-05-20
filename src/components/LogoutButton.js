// components/LogoutButton.js

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton"; // import MDButton for styling

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <MDButton variant="gradient" color="error" fullWidth onClick={handleLogout}>
      Logout
    </MDButton>
  );
};

export default LogoutButton;
