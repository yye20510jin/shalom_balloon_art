import { useNavigate } from "react-router-dom";
import "../../styles/error/ServerErrorPage.css";

export default function ServerErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-wrapper">
      <div className="error-card">
        <h1>500</h1>
        <h2>일시적인 문제가 발생했습니다.</h2>
        <p>잠시 후 다시 시도해 주세요.</p>

        <div className="btn-group">
          <button onClick={() => window.location.reload()}>
            다시 시도
          </button>

          <button onClick={() => navigate("/")}>
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}