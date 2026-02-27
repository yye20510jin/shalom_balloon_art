import { createContext, useMemo, useState, useCallback, useEffect } from "react";
import { setOnUnauthorized, fncSetAccessToken} from "../api/authFetch"
import { startBootstrapping, setBootstrappingDone, setBootstrappingFailed } from "../auth/authGate";

//통로 생성 : 후에 다른 컴포넌트에서 값 가져갈 때 사용
const AuthContext = createContext();

// App.jsx에서 가져다 쓸 함수
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const isLoggedIn = !!accessToken;
  const [roles, setRoles] = useState([]);
  const [bootstrapping, setBootstrapping] = useState(true);

useEffect(() => {
  let alive = true;
  const controller = new AbortController();

  startBootstrapping();

  (async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
      });

      if (!alive) return;

      if (res.ok) {
        const data = await res.json();
        fncSetAccessToken(data.accessToken);
        setAccessToken(data.accessToken);
        setRoles(data.roles ?? []);
        setUserId(data.userId ?? null);
      }else{
        fncSetAccessToken("");
        setAccessToken("");
        setRoles([]);
        setUserId(null);
      }

      setBootstrappingDone();

    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
      setBootstrappingFailed(e);

    } finally {
      if (alive) setBootstrapping(false);
    }
  })();

  return () => {
    alive = false;
    controller.abort();
  };
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
    //href => 리로드, 히스토리 남음
    //replace => 리로드, 히스트로 안남음
    window.location.replace("/");

  }, []);

  const navHome = useCallback(() => {
    window.location.replace("/");
  }, []);
  
  const onAccessTokenChanged = useCallback((t) => {
    setAccessToken(t);
  }, []);

  useEffect(() => {
    setOnUnauthorized(logout, navHome, onAccessTokenChanged);
  }, [logout, navHome, onAccessTokenChanged]);


  const value = useMemo(() => ({ bootstrapping, login, logout, isLoggedIn, roles, accessToken, userId }), [bootstrapping, login, logout, isLoggedIn, roles, accessToken, userId]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;