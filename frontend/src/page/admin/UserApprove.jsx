import { useEffect, useState, useContext} from "react";
import { authFetch } from "../../api/authFetch";
import AdminContext from "../../components/admin/adminContext";
import "../../styles/admin/UserApprove.css";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";

function UserApprove() {

  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [startPage, setstartPage] = useState(0);
  const [endPage, setEndPage] = useState(0);
  const [auth, setAuth] = useState(0); // 미확인 : 0, 비인증 : 2
  const {setAuthChange} = useContext(AdminContext);
  // 날짜 포맷 함수 추가
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }

  const approveUser = async (userIndex) => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/approveUser/${userIndex}`, {
        method: "POST"
      });

      if (!res.ok) {
        setError("서버 오류. 요청을 완료하지 못했습니다.");
      } else { alert("사용자 인증 요청을 수락했습니다."); }
      setReloadKey(prev => prev + 1);
      setAuthChange(prev => prev + 1);
    } catch (e) {
      setError(e.messge || "알 수 없는 오류 발생. 관리자에게 문의해 주세요");
    }
  };

  const rejectUser = async (userIndex) => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/rejectUser/${userIndex}`, {
        method: "PATCH"
      });

      if (!res.ok) {
        setError("서버 오류. 요청을 완료하지 못했습니다.");
      } else { alert("사용자 인증 요청을 거부했습니다."); }

      setReloadKey(prev => prev + 1);
      setAuthChange(prev => prev + 1);
    } catch (e) {
      setError(e.message || "알 수 없는 오류 발생. 관리자에게 문의해 주세요");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/userApprove?page=${startPage}&auth=${auth}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) {
          setError("서버 오류. 인증 리스트를 가져오지 못했습니다.");
          setLoading(false);
          return;
        }

        const res_data = await res.json();

        console.log("res_data : " + res_data.content);

        setData(res_data.content ?? []);
        setstartPage(res_data.number);
        setEndPage(Math.ceil(res_data.totalElements / 5));
        setLoading(false);

      } catch (e) {
        setError(e.message || "알 수 없는 오류 발생. 관리자에게 문의해 주세요");
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadKey, startPage, auth]);

  function toggleAuth(num) {
    if (num === 0) { setAuth(0); } else if (num === 2) { setAuth(2); }
  }

  return (
    <div>
      <header className="UP-header">
      <h2>유저 인증 페이지</h2>
      <div className="UP-check">
      <label>
        <input type="checkbox" checked={auth === 0} onChange={(e) => toggleAuth(0)} />
        미확인
      </label>
      <label>
        <input type="checkbox" checked={auth === 2} onChange={(e) => toggleAuth(2)} />
        비인증
      </label>
    </div>
    </header>
      {/* 로딩 */}
      {loading && <p>불러오는 중...</p>}

      {/* 오류 */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 데이터 없음 */}
      {!loading && data.length === 0 && !error && (
        <p>인증 대기 중인 사용자가 없습니다.</p>
      )}

      {/* 목록 카드 */}
      <div className="UA-content">

        {data.map((item) => (
          <div
            className="UA-user"
            key={item.userIndex}
          >
            <p><strong>이름:</strong> {item.userName}</p>
            <p><strong>전화번호:</strong> {item.userPhoneNumber}</p>
            <p><strong>생성일:</strong> {formatDate(item.createdAt)}</p>
            <div className="UA-ubt">
              <button type="button" onClick={() => { approveUser(item.userIndex) }}>인증</button>
              {item.authStatus !== 2 && <button type="button" style={{marginLeft:"0.3rem"}} onClick={() => { rejectUser(item.userIndex) }}>비인증</button>}
            </div>
          </div>
        ))}
      </div>
      {data.length > 0 && (
        <div className="UL-bt">
          <button style={{background:"none"}} onClick={() => { setstartPage(prev => prev - 1) }} disabled={startPage <= 0}><img src={leftArrow} alt="이전"/></button>
          <div>{startPage + 1} / {endPage}</div>
          <button style={{background:"none"}} onClick={() => { setstartPage(prev => prev - 1) }} disabled={endPage <= startPage + 1}><img src={rightArrow} alt="다음"/></button>
        </div>
      )}
    </div>
  );
}

export default UserApprove;