import { useEffect, useRef, useState } from "react";
import { authFetch } from "../../api/authFetch";
import { useNavigate } from "react-router-dom";
import UserList from "./UserList";
import UserApprove from "./UserApprove";
import "../../styles/admin/AdminDashboard.css";
import imgCard from "../../assets/imgCard.png";

function Admin() {

    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const max = 3;

    useEffect(() => {
        const fetchAdminData = async () => {

            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/test`, { method: "GET", });
                if (!res.ok) {
                    setError("관리자 권한이 없거나, 로그인 필요");
                    navigate("/");
                    return;
                }

                const res_data = await res.json();
                setData(res_data.content);

            } catch (e) {
                console.error(e);
                setError("서버 에러 발생");
            }
        };
        fetchAdminData();
    }, []);

    return (
        <div className="container" style={{ padding: 20 }}>
            <section className="Ad-top3-section">
                <div className="AdminDashboard-top3">
                {[...data, ...Array(Math.max(0, max - data.length)).fill(null)].map((post, index) =>
                    post ? (
                        <div className="Ad-top3-box" key={post.index}>
                            <img className="Ad-top3-img" src={post.thumbnailUrl} alt={`사진${post.index}`} />
                            <div className="Ad-top3-sub">{post.title}</div>
                        </div>
                    ) : (
                        <div className="Ad-top3-box-sub" key={`sub${index}`}>
                            <img src={imgCard} alt="게시물이 없습니다."/>
                        </div>
                    )
                )}
                </div>
            </section>

            <div className="AdminDashboard-box1">
                <section className="AdminDashboard-userList">
                    <UserList />
                </section>

                <section className="AdminDashboard-userApprove">
                    <UserApprove />
                </section>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
export default Admin;