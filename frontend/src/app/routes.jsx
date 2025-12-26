import Home from "../page/home/Home";
import AdminLogin from "../page/admin/AdminLogin";
import AdminDashboard from "../page/admin/AdminDashboard"
import AddAdmin from "../page/admin/AddAdmin";
import Membership from "../page/User/Membership";
import UserLogin from "../page/User/UserLogin";
import PostForm from "../components/post/PostForm";
import PostList from "../page/post/PostList";
import PostDetails from "../page/post/PostDetails";
import EditPostPage from "../page/post/EditPostPage";
import UserApprove from "../page/admin/UserApprove";
import AdminLayout from "../page/admin/AdminLayout";
import RequireAdmin from "../auth/RequireAdmin";
import RequireUser from "../auth/RequireUser";
import UserLayout from "../page/User/UserLayout";
import UserList from "../page/admin/UserList";

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
      { path: "userList", element: <UserList /> },
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