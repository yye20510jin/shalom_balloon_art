import { createContext, useMemo, useState, useCallback, useEffect, useRef } from "react";
import { setOnUnauthorized, fncSetAccessToken, tryRefreshToken } from "../api/authFetch"
import { startBootstrapping, setBootstrappingDone, setBootstrappingFailed } from "../auth/authGate";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const isLoggedIn = !!accessToken;
  const [roles, setRoles] = useState([]);
  const [bootstrapping, setBootstrapping] = useState(true);
  const bootOnceRef = useRef(false);
  const navigate = useNavigate();
  const serverError = () => navigate("/error/500");
  useEffect(() => {
    if (bootOnceRef.current) return;
    bootOnceRef.current = true;
    let alive = true;

    (async () => {
      try {
        
        startBootstrapping();
        const data = await tryRefreshToken();
        if (!alive) return;

        if (data) {
          fncSetAccessToken(data.accessToken);
          setAccessToken(data.accessToken);
          setRoles(data.roles ?? []);
          setUserId(data.userId ?? null);
        } else {
          fncSetAccessToken("");
          setAccessToken("");
          setRoles([]);
          setUserId(null);
        }
        setBootstrappingDone();
      } catch (e) {
        if(!alive) return;
        setBootstrappingFailed(e);
      } finally {
        if (alive) setBootstrapping(false);
      }

      return () => {
        alive = false;
      };
    })();

  }, []);

  const login = useCallback((accessToken, userId, roles) => {
    fncSetAccessToken(accessToken);
    setAccessToken(accessToken);
    setUserId(userId);
    setRoles(roles);
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh/logout`, {
      method: "POST",
      credentials: "include"
    });
    fncSetAccessToken("");
    setAccessToken("");
    setRoles([]);
    setUserId("");

    window.location.replace("/");

  }, []);

  const navHome = useCallback(() => {
    window.location.replace("/");
  }, []);

  const onAccessTokenChanged = useCallback((t) => {
    setAccessToken(t);
  }, []);

  useEffect(() => {
    setOnUnauthorized(logout, navHome, onAccessTokenChanged,serverError);
  }, [logout, navHome, onAccessTokenChanged, serverError]);


  const value = useMemo(() => ({ bootstrapping, login, logout, isLoggedIn, roles, accessToken, userId }), [bootstrapping, login, logout, isLoggedIn, roles, accessToken, userId]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;