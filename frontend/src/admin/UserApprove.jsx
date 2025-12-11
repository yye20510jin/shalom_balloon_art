import{useEffect,useState} from"react";
import{authFetch} from "../api/authFetch";
import { useNavigate } from "react-router-dom"; 

function UserApprove() {

  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

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

  const approveUser = async(userIndex) => {
    try{
        const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/approveUser/${userIndex}`,{
          method:"POST"
        });

        if(!res.ok){
            setError("서버 오류. 요청을 완료하지 못했습니다.");
        }else{alert("사용자 인증 요청을 수락했습니다.");}
        setReloadKey(prev => prev+1);
    }catch(e){
        setError(e.messge || "알 수 없는 오류 발생. 관리자에게 문의해 주세요");
    }
  };

  const rejectUser = async(userIndex) => {
    try{
        const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/rejectUser/${userIndex}`,{
          method:"PATCH"
        });

        if(!res.ok){
            setError("서버 오류. 요청을 완료하지 못했습니다.");
        }else{alert("사용자 인증 요청을 거부했습니다.");}
      
        setReloadKey(prev => prev+1);
    }catch(e){
        setError(e.message || "알 수 없는 오류 발생. 관리자에게 문의해 주세요");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/userApprove`,
          { method: "GET" }
        );

        if (!res.ok) {
          setError("서버 오류. 인증 리스트를 가져오지 못했습니다.");
          setLoading(false);
          return;
        }

        const res_data = await res.json();

        if (Array.isArray(res_data) && res_data.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        setData(res_data);
        setLoading(false);

      } catch (e) {
        setError(e.message || "알 수 없는 오류 발생. 관리자에게 문의해 주세요");
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadKey]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>유저 인증 페이지</h2>

      {/* 로딩 */}
      {loading && <p>불러오는 중...</p>}

      {/* 오류 */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 데이터 없음 */}
      {!loading && data.length === 0 && !error && (
        <p>인증 대기 중인 사용자가 없습니다.</p>
      )}

      {/* 목록 카드 */}
      <div>
        {data.map((item) => (
          <div
            key={item.userIndex}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              backgroundColor: "#fafafa"
            }}
          >
            <p><strong>이름:</strong> {item.userName}</p>
            <p><strong>전화번호:</strong> {item.userPhoneNumber}</p>
            <p><strong>생성일:</strong> {formatDate(item.createdAt)}</p>
            <button type="button" onClick={() => {approveUser(item.userIndex)}}>인증</button>
            <button type="button" onClick={() => {rejectUser(item.userIndex)}}>비인증</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserApprove;