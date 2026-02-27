import { authFetch } from "../../api/authFetch";
import {waitAuthReady} from "../../auth/authGate";
import { useEffect, useState, useContext } from "react";
import "../../styles/admin/userList.css";
import UserIcon from "../../assets/UserIcon.png";
import AdminContext from "../../components/admin/adminContext";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";
import AuthContext from "../../auth/AuthContext";

function UserList() {
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const { authChange } = useContext(AdminContext);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/userList`, {
                    method: "POST",
                    body: JSON.stringify(startPage),
                }
                );

                if (!res.ok) {
                    const message = res ? await res.text() : "서버 응답 없음";
                    setError(message);
                    return;
                }

                const usersData = await res.json();
                setData(usersData.content);
                setStartPage(usersData.number);
                setEndPage(Math.ceil(usersData.totalElements / 5));

            } catch (err) {
                console.error(err);
                setError("서버 응답 없음");
            } finally {
                setLoading(false);
            }
        }

        fetchUserList();
    }, [startPage, authChange]);

    return (
        <div className="userList">
            <main>
            <h2>유저 리스트 페이지</h2>
            <div className="userList-content">
                {loading && <p>불러오는 중...</p>}

                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && data.length === 0 && !(error && error.trim()) && <p>회원이 없습니다.</p>}

                <div className="UL-user">
                    {data.map((user) => (
                        <div key={user.userIndex} className="UL-user-content">
                            <img src={UserIcon} alt="아이콘" className="UL-user-img" />
                            <div className="UL-user-text">
                                <p><strong>이름:</strong> {user.userName}</p>
                                <p><strong>전화번호:</strong> {user.userPhoneNumber}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </main>
            <div className="UL-bt">
                <button style={{ background: "none" }} onClick={() => { setStartPage(prev => prev - 1) }} disabled={startPage <= 0}><img src={leftArrow} alt="이전" /></button>
                <div>{startPage + 1} / {endPage}</div>
                <button style={{ background: "none" }} onClick={() => { setStartPage(prev => prev + 1) }} disabled={endPage <= startPage + 1}><img src={rightArrow} alt="다음" /></button>
            </div>
        </div>
    );
} export default UserList;