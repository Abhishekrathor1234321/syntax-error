import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return (token && user) ? children : <Navigate to="/login" />;
}

export default PrivateRoute;