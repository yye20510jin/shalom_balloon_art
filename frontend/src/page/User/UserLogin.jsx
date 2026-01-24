import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth/AuthContext"
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
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/userLogin`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
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

            login(data.accessToken, data.userId, JSON.stringify(data.roles));
            navigate("/", { replace: true });

        } catch (err) {
            console.error(err);
            setError("알 수 없는 에러 발생...");
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
        <div className="container userLogin">
            <div className="userLogin-box">
                <img className="userLogin-logo" src={shalomLogo} alt="shalom" />
                {error ? <div className="userLogin-err" style={{ color: "red" }}>{error}</div> : <div className="userLogin-err" ></div>}
                <form onSubmit={handleSubmit}>
                    <div className="userLogin-form">
                        <input className="userLogin-input" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디" />
                        <input className="userLogin-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
                        <button type="submit">로그인</button>
                    </div>
                </form>
            </div>
            <button type="button" onClick={()=>navigate("/user/FindId")}>아이디 찾기</button>
            <button type="button" onClick={()=>navigate("/user/FindPw")}>비밀번호 찾기</button>
        </div>
    );
} export default UserLogin;