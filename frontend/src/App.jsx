import{BrowserRouter, Routes, Route} from"react-router-dom"
import{routes} from"./router/routes";

function App(){
  return(
    <BrowserRouter>
        <Routes>
          {routes.map((route) => renderRoute(route))}
        </Routes>
    </BrowserRouter>
  );
}

function renderRoute(route){
  if(route.children){
    return(
      <Route path={route.path} element={route.element} key={route.path}>
        {route.children.map((child)=>(<Route
          key={route.path+child.path}
          path={child.path}
          element={child.element}
        />))}
      </Route>
    );
  }
  return<Route key={route.path} path={route.path} element={route.element}/>
}export default App;