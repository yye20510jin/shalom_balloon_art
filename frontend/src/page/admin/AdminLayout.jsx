import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      {/* 공통 UI */}
      <aside style={{ width: 200 }}>
        <h2>Admin</h2>
        <nav>
          <a href="/admin/userApprove">사용자 인증</a><br/>
          <a href="/admin/addAdmin">관리자 추가</a><br/>
          <a href="/admin/posts">글 추가</a>
        </nav>
      </aside>

      {/* 여기부터 바뀌는 영역 */}
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}