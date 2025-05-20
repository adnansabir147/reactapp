import { useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Logout() {
  const { signout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    signout().then(() => {
      navigate("/signin", { replace: true });
    });
    // If signout is not a promise, remove .then and just call navigate after signout()
    // signout();
    // navigate("/signin", { replace: true });
  }, [signout, navigate]);

  return <div>Signing out...</div>;
}

export default Logout;