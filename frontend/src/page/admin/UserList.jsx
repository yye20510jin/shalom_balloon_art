import { authFetch } from "../../api/authFetch";
import { useEffect, useState } from "react";

function UserList() {
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/userList`, {
                    method: "POST",
                }
                );

                if (!res.ok) {
                    const message = res ? await res.text() : "서버 응답 없음";
                    setError(message);
                    console.log("서버에러");
                    return;
                }

                const usersData = await res.json();
                setData(usersData);

            } catch (err) {
                console.error(err);
                setError("서버 응답 없음");
            }finally{
                setLoading(false);
            }
        }

        fetchUserList();
    }, []);

    return (
        <div className="userList">
            <h2>유저 리스트 페이지</h2>

            {loading && <p>불러오는 중...</p>}

            {error && <p style={{color:"red"}}>{error}</p>}

            {!loading && data.length === 0 && !(error && error.trim()) && <p>회원이 없습니다.</p> }

            {data.map((user) => (
                <div key={user.userIndex}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "10px",
                        backgroundColor: "#fafafa"
                    }}>
                    <p><strong>이름:</strong> {user.userName}</p>
                    <p><strong>전화번호:</strong> {user.userPhoneNumber}</p>
                </div>
            ))}
        </div>
    );
} export default UserList;