import { useEffect, useState } from "react";
import { authFetch } from "../../api/authFetch";
import { useNavigate } from "react-router-dom";
import UserList from "./UserList";
import UserApprove from "./UserApprove";
import "../../styles/admin/AdminDashboard.css";
import PostViewLineChart from "../../components/admin/postViewLineChart";

function Admin() {

    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin`, { method: "GET", });
                if (!res.ok) {
                    navigate("/");
                    return;
                }

                const res_data = await res.json();
                setData(res_data ?? []);

            } catch (e) {
                console.error(e);
                setError("서버 에러 발생");
            }
        };
        fetchAdminData();
    }, []);

    return (
        <div className="container" style={{ padding: 20 }}>
            <section className="Ad-top5-section">
                {data && <PostViewLineChart data={data}/>}
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