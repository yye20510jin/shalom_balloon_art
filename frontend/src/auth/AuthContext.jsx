import { createContext,useMemo,useState,useCallback,useEffect } from "react";
import { setOnUnauthorized, fncSetAccessToken } from "../api/authFetch"

//통로 생성 : 후에 다른 컴포넌트에서 값 가져갈 때 사용
const AuthContext = createContext();

// App.jsx에서 가져다 쓸 함수
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const isLoggedIn = !!accessToken;
  const [roles, setRoles] = useState([]);

  useEffect(() => {
  (async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh`, { 
      method : "POST",
      credentials: "include" });
    if (res.status === 401 || !res.ok){
      return;
    }
    if (res.ok) {
      const data = await res.json(); // { accessToken, roles, userId }
      setAccessToken(data.accessToken);
      setRoles(data.roles);
      setUserId(data.userId);
    }
  })();
}, []);

  const login = useCallback((accessToken, userId, roles)=>{
    setAccessToken(accessToken);
    setUserId(userId);
    setRoles(roles);
  },[]);

  const logout = useCallback(async() => {

      await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh/logout`,{
        method:"POST",
        credentials:"include"
      });


      setAccessToken("");
      setRoles([]);
      setUserId("");
      //href => 리로드, 히스토리 남음
      //replace => 리로드, 히스트로 안남음
      window.location.replace("/");

  },[]);

  const navHome = useCallback(() => {
    window.location.replace("/");
  }, []);

  useEffect(() => {
    setOnUnauthorized(logout,navHome);
    fncSetAccessToken(accessToken);
  }, [logout,navHome,accessToken]); 

  const value = useMemo(() => ({ login ,logout, isLoggedIn, roles, accessToken, userId }), [login,logout,isLoggedIn, roles, accessToken, userId]);
  
  return (
    <AuthContext.Provider value={ value }>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;