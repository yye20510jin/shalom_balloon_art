import{BrowserRouter, Routes, Route} from"react-router-dom"
import{routes} from"../app/routes";
import{AuthProvider} from "../auth/AuthContext";
import AuthContext from "../auth/AuthContext";
import { useContext } from "react";
import ScrollToTop from "../components/common/ScrollToTop";

function App(){
  return(
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const {bootstrapping} = useContext(AuthContext);
  if (bootstrapping) {
    return null;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {routes.map((route) => renderRoute(route))}
      </Routes>
    </>
  );
}

function renderRoute(route){
  if(route.children){
    return(
      <Route path={route.path} element={route.element} key={route.path}>
        {route.children.map((child)=>(<Route
          key={`${route.path}::${child.path}`}
          path={child.path}
          element={child.element}
        />))}
      </Route>
    );
  }
  return<Route key={route.path} path={route.path} element={route.element}/>
}export default App;