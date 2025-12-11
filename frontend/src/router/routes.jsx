import Home from "../Home";
import AdminLogin from "../admin/AdminLogin";
import Admin from "../admin/Admin"
import AddAdmin from "../admin/AddAdmin";
import Membership from "../User/Membership";
import UserLogin from "../User/UserLogin";
import PostForm from "../components/PostEditor/PostForm";
import PostList from "../components/PostEditor/PostList";
import PostDetails from "../components/PostEditor/PostDetails";
import EditPostPage from "../components/PostEditor/EditPostPage";
import UserApprove from "../admin/UserApprove";

export const routes=[
    {path: "/", element: <Home />},
    {path:"/admin/adminLogin", element: <AdminLogin />},
    {path:"/admin", element: <Admin/>},
    {path:"/membership", element:<Membership/>},
    {path:"/userLogin",element:<UserLogin/>},
    {path:"/admin/addAdmin",element:<AddAdmin/>},
    {path:"/posts",element:<PostForm/>},
    {path:"/posts/postList",element:<PostList/>},
    {path:"/posts/postDetails/:id",element:<PostDetails/>},
    {path:"/posts/editPostPage/:id",element:<EditPostPage/>},
    {path:"/admin/userApprove",element:<UserApprove/>},
];