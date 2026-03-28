import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const location = useLocation();

  return (token && user) 
    ? children 
    : <Navigate to={`/login?redirect=${location.pathname}`} />;
}

export default PrivateRoute;