import Home from "../Home";
import AdminLogin from "../admin/AdminLogin";
import Admin from "../admin/Admin"
import AddAdmin from "../admin/AddAdmin";
import Membership from "../Membership";
import UserLogin from "../User/UserLogin";
import PostForm from "../components/PostEditor/PostForm";
import PostList from "../components/PostEditor/PostList";
import PostDetails from "../components/PostEditor/PostDetails";
import EditPostPage from "../components/PostEditor/EditPostPage";

export const routes=[
    {path: "/", element: <Home />},
    {path:"/adminLogin", element: <AdminLogin />},
    {path:"/admin", element: <Admin/>},
    {path:"/membership", element:<Membership/>},
    {path:"/userLogin",element:<UserLogin/>},
    {path:"/addAdmin",element:<AddAdmin/>},
    {path:"/posts",element:<PostForm/>},
    {path:"/posts/postList",element:<PostList/>},
    {path:"/posts/postDetails/:id",element:<PostDetails/>},
    {path:"/posts/editPostPage/:id",element:<EditPostPage/>},
];