import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to={`/login?redirect=${location.pathname}`} />;
  }

  return children;
}

export default PrivateRoute;