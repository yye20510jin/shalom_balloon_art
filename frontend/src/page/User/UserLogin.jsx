import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import AuthContext from "../../auth/AuthContext";
import shalomLogo from "../../assets/shalomBalloonArt.png";
import "../../styles/user/UserLogin.css";

function UserLogin() {

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authFetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/userLogin`,
                {
                    method: "POST",
                    body: JSON.stringify({ userId, password }),
                }
            );

            if (!response.ok) {
                const err = await response.json();
                setError(err.message);
                return;
            }

            const data = await response.json();

            login(data.accessToken, data.userId, JSON.stringify(data.roles));
            navigate("/", { replace: true });

        } catch (err) {
            navigate("/error/ServerErrorPage");
        }
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError("");
            }, 2000);
        }
    }, [error]);

    return (
        <div className="Login">
            <img className="Login-logo" alt="shalom" onClick={()=>navigate("/")} src={shalomLogo}/>
            <div className="Login-box">
                <section className="Login-main">
                <div className="Login-title">LOGIN</div>
                {error ? <div className="Login-err" style={{ color: "red" }}>{error}</div> : <div className="Login-err" ></div>}
                <form className="Login-form" onSubmit={handleSubmit}>
                        <input className="Login-input" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디" />
                        <input className="Login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
                        <button className="i-btn" type="submit">로그인</button>
                </form>
                </section>
                <div className="Login-find ">
                    <a href="/user/FindId">아이디 찾기</a>
                    /
                    <a href="/user/ResetPassword">비밀번호 찾기</a>
                </div>
            </div>

        </div>
    );
} export default UserLogin;