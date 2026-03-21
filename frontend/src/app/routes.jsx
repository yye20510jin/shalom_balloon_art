import Home from "../page/home/Home";
import AdminLogin from "../page/admin/AdminLogin";
import AdminDashboard from "../page/admin/AdminDashboard"
import Membership from "../page/User/Membership";
import UserLogin from "../page/User/UserLogin";
import PostForm from "../page/post/PostForm";
import PostList from "../page/post/PostList";
import PostDetails from "../page/post/PostDetails";
import EditPostPage from "../page/post/EditPostPage";
import UserApprove from "../page/admin/UserApprove";
import AdminLayout from "../page/admin/AdminLayout";
import RequireAdmin from "../auth/RequireAdmin";
import RequireUser from "../auth/RequireUser";
import UserLayout from "../page/User/UserLayout";
import UserList from "../page/admin/UserList";
import AdminHomeCard from "../page/admin/AdminHomeCard";
import FindId from "../page/User/FindId";
import ResetPassword from "../page/User/ResetPassword";
import ResetPw from "../page/User/ResetPw";
import UserDashboard from "../page/User/UserDashboard";
import UserChangePw from "../page/User/UserChangePw";
import UserChangePhone from "../page/User/UserChangePhone";
import ServerErrorPage from "../page/error/ServerErrorPage";
import ForbiddenPage from "../page/error/ForbiddenPage";
import NotFoundPage from "../page/error/NotFoundPage";
import { AdminContext_f } from "../components/admin/adminContext";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/shalom/0322", element: <AdminLogin /> },
  { path: "/membership", element: <Membership /> },
  { path: "/userLogin", element: <UserLogin /> },
  { path: "/user/FindId", element: <FindId/>},
  { path: "/user/ResetPassword", element: <ResetPassword/>},
  { path: "/user/ResetPw", element:<ResetPw/>},
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminContext_f>
          <AdminLayout />
        </AdminContext_f>
      </RequireAdmin>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "userApprove", element: <UserApprove /> },
      { path: "userList", element: <UserList /> },
      { path: "posts", element: <PostForm /> },
      { path: "posts/editPostPage/:id", element: <EditPostPage /> },
      { path: "adminHomeCard" ,element:<AdminHomeCard/>},
    ],
  },
  {
    path: "/user",
    element: (
      <RequireUser>
        <UserLayout />
      </RequireUser>
    ),
    children: [
      { path: "posts/postList", element: <PostList /> },
      { path: "posts/postDetails/:id", element: <PostDetails /> },
      { path: "userDashboard", element: <UserDashboard/>},
      { path: "userChangePhone", element: <UserChangePhone/>},
      { path: "changePw", element: <UserChangePw/>}
    ],
  },
  {
    path:"/error",
    children:[
      {path:"500", element: <ServerErrorPage/>},
      {path:"403", element: <ForbiddenPage/>},
    ],
  },
  {path:"*", element: <NotFoundPage />},

];