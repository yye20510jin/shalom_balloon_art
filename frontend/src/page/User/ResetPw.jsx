import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authFetch } from "../../api/authFetch";
import shalomLogo from "../../assets/shalomBalloonArt.png";
import "../../styles/user/UserMembershipFind.css";

function ResetPw() {
    const location = useLocation();
    const navigate = useNavigate();

    const token = location.state?.token;

    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const isPasswordMatch = newPassword === newPasswordConfirm;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|;:'",.<>/?]).{8,}$/;
    const isPasswordValid = passwordRegex.test(newPassword);

    const chk = !!newPassword.trim() && !!newPasswordConfirm.trim() && !!isPasswordMatch && !!isPasswordValid;

    useEffect(() => {
        if (!token) {
            navigate("/user/ResetPassword", { replace: true });
            return;
        }

        (async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/validateTokenPw`, {
                    method: "POST",
                    body: JSON.stringify({
                        token
                    })
                });

                if (!res.ok) {
                    navigate("/user/ResetPassword", { replace: true });
                    return;
                }

            } catch (err) {
                navigate("/user/ResetPassword", { replace: true });
            }
        })();

    }, [token, navigate]);


    const resetPwFetch = async (e) => {
        e.preventDefault();
        if (!chk) return;
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/confirmPw`, {
                method: "POST",
                body: JSON.stringify({ newPassword, token })
            });

            if (!res.ok) {
                setError("비밀번호 변경에 실패했습니다.");
                return;
            }

            alert("비밀번호가 변경되었습니다.");
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="Login">
            <img className="Login-logo" alt="shalom" onClick={() => navigate("/")} src={shalomLogo} />
            <div className="Login-box">
                <section className="Login-main">
                    <div className="Login-title">비밀번호 변경</div>
                    <form className="Login-form UMF-form" onSubmit={resetPwFetch}>
                        <input className="Login-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="비밀번호" />
                        <input className="Login-input" type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} placeholder="비밀번호 확인" />
                        <button className="i-btn" type="submit" disabled={!chk}>확인</button>
                    </form>
                </section>

            </div>
            <section className="UMF-box">
                <ul>
                    {newPassword && !isPasswordValid && <li className="i-errMessage">비밀번호는 8자 이상 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.</li>}
                    {newPasswordConfirm && !isPasswordMatch && <li className="i-errMessage">비밀번호가 일치하지 않습니다.</li>}
                    {error && <li className="i-errMessage">{error}</li>}
                </ul>
            </section>
        </div>
    );
} export default ResetPw;