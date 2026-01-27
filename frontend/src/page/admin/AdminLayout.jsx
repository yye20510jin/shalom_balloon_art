import { Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../auth/AuthContext";
import "../../styles/admin/AdminLayout.css";

export default function AdminLayout() {
const{logout}=useContext(AuthContext);

  return (
    <div className="AdminLayout" style={{ display: "flex" }}>
      {/* 공통 UI */}
      <aside className="AdminLayout-aside">
        <h2>Admin</h2>
        <nav>
          <a href="/membership">관리자 추가</a>
          <a href="/admin/posts">글 추가</a>
          <a href="/user/posts/postList/list">목록보기</a>
          <a href="/admin/AdminHomeCard">홈 카드</a>
          <a  style={{cursor:"pointer"}} onClick={logout}>로그아웃</a>
        </nav>
      </aside>

      {/* 여기부터 바뀌는 영역 */}
      <main className="AdminLayout-m">
        <Outlet />
      </main>
    </div>
  );
}