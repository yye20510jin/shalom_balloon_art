import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

export default function RequireAdmin({ children }) {
  const { isLoggedIn, roles, bootstrapping } = useContext(AuthContext);

  if (!bootstrapping && !isLoggedIn ) return <Navigate to="/" replace />;
  if (!bootstrapping && !roles.includes("ROLE_ADMIN")) return <Navigate to="/" replace />; 

  return children;
}