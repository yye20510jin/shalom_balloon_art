import { useEffect, useState, useContext } from "react";
import { authFetch } from "../../api/authFetch";
import { getJson } from "../../api/getJson";
import { showSuccess } from "../../util/toastUtil";
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
  const { setAuthChange } = useContext(AdminContext);
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
        const data = await getJson(res);
        setError(data.message || "요청을 완료하지 못했습니다.");
        return;
      }
      else {
        showSuccess("인증되었습니다."); 
      }

      setReloadKey(prev => prev + 1);
      setAuthChange(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const rejectUser = async (userIndex) => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/rejectUser/${userIndex}`, {
        method: "PATCH"
      });

      if (!res.ok) {
        const data = await getJson(res);
        setError(data.message || "비인증을 완료하지 못했습니다.");
        return;
      } else { 
        showSuccess("비인증되었습니다."); 
      }

      setReloadKey(prev => prev + 1);
      setAuthChange(prev => prev + 1);
    } catch (err) {
      console.error(err);
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

        const data = await getJson(res);

        if (!res.ok) {
          setError(data.message || "유저 인증 리스트를 가져오지 못했습니다.");
          setLoading(false);
          return;
        }

        setData(data.content ?? []);
        setstartPage(data.number);
        setEndPage(Math.ceil(data.totalElements / 5));
        setLoading(false);

      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadKey, startPage, auth]);

  function toggleAuth(num) {
    if (num === 0) { setAuth(0); } else if (num === 2) { setAuth(2); }
  }

  return (
    <div className="UserApprove">
      <main>
        <header className="UP-header">
          <h2>유저 인증 페이지</h2>
          <div className="UP-check">
            <label>
              <input type="checkbox" checked={auth === 0} onChange={(e) => toggleAuth(0)} />
              미인증
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
                {item.authStatus !== 2 && <button type="button" style={{ marginLeft: "0.3rem" }} onClick={() => { rejectUser(item.userIndex) }}>비인증</button>}
              </div>
            </div>
          ))}
        </div>
      </main>
      {data.length > 0 && (
        <div className="UL-bt">
          <button style={{ background: "none" }} onClick={() => { setstartPage(prev => prev - 1) }} disabled={startPage <= 0}><img src={leftArrow} alt="이전" /></button>
          <div>{startPage + 1} / {endPage}</div>
          <button style={{ background: "none" }} onClick={() => { setstartPage(prev => prev - 1) }} disabled={endPage <= startPage + 1}><img src={rightArrow} alt="다음" /></button>
        </div>
      )}
    </div>
  );
}

export default UserApprove;