import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!token || !user) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;