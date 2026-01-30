import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import AuthContext from "../../auth/AuthContext";
import shalomLogo from "../../assets/shalomBalloonArt.png";
import "../../styles/admin/adminLogin.css";


function AdminLogin() {

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    //form 기본 submit 막기
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/adminLogin`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, password }),
                }
            );

            if (!response.ok) {
                const err = await response.json();
                setError(err.error);
                return;
            }

            const data = await response.json();

            //서버가 보낸 토큰 저장
            login(data.accessToken, data.userId, data.roles);
            navigate("/admin", { replace: true });

        } catch (err) {
            console.error(err);
            setError("알 수 없는 에러 발생..");
        }
    }

    return (
        <div className="container adminLogin">
            <div className="adminLogin-box">
                <img className="adminLogin-logo" src={shalomLogo} alt="shalom" onClick={()=>navigate("/")} />
                {error ? <div className="adminLogin-err" style={{ color: "red" }}>{error}</div> : <div className="userLogin-err" ></div>}
                <form onSubmit={handleSubmit}>
                    <div className="adminLogin-form">
                        <input className="adminLogin-input" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디" />
                        <input className="adminLogin-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
                        <button type="submit">로그인</button>
                    </div>
                </form>
            </div>
        </div>
    );

} export default AdminLogin;