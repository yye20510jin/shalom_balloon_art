import { createContext,useMemo,useState,useCallback,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setOnUnauthorized } from "../api/authFetch"
 
//통로 생성 : 후에 다른 컴포넌트에서 값 가져갈 때 사용
const AuthContext = createContext();

// App.jsx에서 가져다 쓸 함수
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const [roles, setRoles] = useState(() => {
    try { return JSON.parse(localStorage.getItem("roles") || "[]"); }
    catch { return []; }
  });

  const login = useCallback((accessToken, userId, roles)=>{
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("roles", JSON.stringify(roles));

    setIsLoggedIn(true);
    setRoles(roles);
  },[]);

  const logout = useCallback(() => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRoles([]);
    navigate("/"); // Home
  },[navigate]);

  const navHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    setOnUnauthorized(logout,navHome);
  }, [logout,navHome]); 

  const value = useMemo(() => ({ login ,logout, isLoggedIn, roles }), [login,logout,isLoggedIn, roles]);
  
  return (
    <AuthContext.Provider value={ value }>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;