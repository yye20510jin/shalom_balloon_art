import { useNavigate } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { authFetch } from "../../api/authFetch";
import AuthContext from "../../auth/AuthContext";
import shalomLogo from "../../assets/shalomBalloonArt.png";

function AdminLogin() {

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, accessToken } = useContext(AuthContext);

    const navigate = useNavigate();

    //form 기본 submit 막기
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authFetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/adminLogin`,
                {
                    method: "POST",
                    body: JSON.stringify({ userId, password }),
                }
            );

            if (!response.ok) {
                const err = await response.json();
                setError(err.message || "");
                return;
            }

            const data = await response.json();

            //서버가 보낸 토큰 저장
            login(data.accessToken, data.userId, data.roles);


        } catch (err) {
            console.error(err);
            setError("알 수 없는 에러 발생..");
        }
    }

    useEffect(() => {
        console.log("AdminLogin : ", accessToken);
        if (accessToken) navigate("/admin", { replace: true });
    }, [accessToken]);

    return (
        <div className="Login">
            <img className="Login-logo" src={shalomLogo} alt="shalom" onClick={() => navigate("/")} />
            <div className="Login-box">
                <section className="Login-main">
                    <div className="Login-title">LOGIN</div>
                    {error ? <div className="Login-err" style={{ color: "red" }}>{error}</div> : <div className="userLogin-err" ></div>}
                    <form onSubmit={handleSubmit}>
                        <div className="Login-form">
                            <input className="Login-input" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디" />
                            <input className="Login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
                            <button className="i-btn" type="submit">로그인</button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );

} export default AdminLogin;