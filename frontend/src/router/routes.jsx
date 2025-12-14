import Home from "../Home";
import AdminLogin from "../admin/AdminLogin";
import AdminDashboard from "../admin/AdminDashboard"
import AddAdmin from "../admin/AddAdmin";
import Membership from "../User/Membership";
import UserLogin from "../User/UserLogin";
import PostForm from "../components/PostEditor/PostForm";
import PostList from "../components/PostEditor/PostList";
import PostDetails from "../components/PostEditor/PostDetails";
import EditPostPage from "../components/PostEditor/EditPostPage";
import UserApprove from "../admin/UserApprove";
import AdminLayout from "../admin/AdminLayout";
import RequireAdmin from "../context/RequireAdmin";
import RequireUser from "../context/RequireUser";
import UserLayout from "../User/UserLayout";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/admin/adminLogin", element: <AdminLogin /> },
  { path: "/membership", element: <Membership /> },
  { path: "/userLogin", element: <UserLogin /> },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout /> 
      </RequireAdmin>
    ),
    children: [
      { path: "", element: <AdminDashboard /> }, 
      { path: "addAdmin", element: <AddAdmin /> }, 
      { path: "userApprove", element: <UserApprove /> },
      { path: "posts", element: <PostForm /> },
      { path: "posts/editPostPage/:id", element: <EditPostPage /> },
    ],
  },
  {
    path: "/user",
    element:(
      <RequireUser>
        <UserLayout/>
      </RequireUser>
    ),
    children:[
      { path: "posts/postList", element: <PostList /> },
      { path: "posts/postDetails/:id", element: <PostDetails /> },
    ],
  },

];