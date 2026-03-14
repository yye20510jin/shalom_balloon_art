import { useNavigate } from "react-router-dom";
import "../../styles/error/ServerErrorPage.css";

export default function ServerErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-wrapper">
      <div className="error-card">
        <h1>404</h1>
        <p>유효하지 않은 주소입니다.</p>
      </div>
    </div>
  );
}