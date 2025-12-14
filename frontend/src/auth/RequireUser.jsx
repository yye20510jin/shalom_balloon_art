import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

export default function RequireUser({children}){
    const{isLoggedIn, roles} = useContext(AuthContext);

    if (!isLoggedIn) return <Navigate to="/" replace />;
    if (!roles.includes("ROLE_ADMIN") && !roles.includes("ROLE_USER")) return <Navigate to="/" replace />;

    return children;
}