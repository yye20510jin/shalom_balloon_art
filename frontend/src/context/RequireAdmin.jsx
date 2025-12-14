import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { isLoggedIn, roles } = useContext(AuthContext);

  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (!roles.includes("ROLE_ADMIN")) return <Navigate to="/" replace />; 

  return children;
}