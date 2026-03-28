import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  return token
    ? children
    : <Navigate to={`/login?redirect=${location.pathname}`} />;
}

export default PrivateRoute;