import { useNavigate } from "react-router-dom";
import "../../styles/error/ServerErrorPage.css";

export default function ServerErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-wrapper">
      <div className="error-card">
        <h1>403</h1>
        <p>이 페이지에 접근할 권한이 없습니다.</p>

        <div className="btn-group">

          <button onClick={() => navigate("/")}>
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}