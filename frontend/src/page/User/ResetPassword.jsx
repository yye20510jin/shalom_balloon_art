import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showError } from "../../util/toastUtil";
import { useFormatPhoneNumber } from "../../hooks/user/useFormatPhoneNumber";
import { getJson } from "../../api/getJson";
import shalomLogo from "../../assets/ShalomBalloonArt.png";
import "../../styles/user/UserMembershipFind.css";

function ResetPassword() {
    const [userId, setUserId] = useState("");
    const [userPhoneNumber, setUserPhoneNumber] = useState("")
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const formatPhoneNumber = useFormatPhoneNumber;
    const chk = userId && userPhoneNumber;
    const findPwFetch = async (e) => {
        e.preventDefault();
        try {
            const formatPn = userPhoneNumber.replace(/\D/g, "");
            const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/resetPw`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, userPhoneNumber: formatPn }),
                credentials: "include",
            });

            const data = await getJson(res);

            if (!res.ok) {
                if (res.status >= 500) {
                    navigate("/error/500");
                    return;
                }
                setError(data.message || "입력하신 정보와 일치하는 계정이 없습니다.");
                return;
            }

            const token = data.resetToken;
            navigate("/user/ResetPw", { state: { token } });
        } catch (err) {
            showError("네트워크 오류가 발생했습니다.");
            console.error(err);
        }
    }

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError("");
            }, 2000);
        }
    }, [error]);

    return (
        <div className="Login">
            <img className="Login-logo" alt="shalom" onClick={() => navigate("/")} src={shalomLogo} />
            <div className="Login-box">
                <section className="Login-main">
                    <div className="Login-title">비밀번호 찾기</div>
                    <form className="Login-form UMF-form" onSubmit={findPwFetch}>
                        <input className="Login-input" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디를 입력하세요" />
                        <input className="Login-input" type="text" value={userPhoneNumber} onChange={(e) =>
                            setUserPhoneNumber(prev =>
                                prev = formatPhoneNumber(e.target.value))} placeholder="전화번호를 입력하세요" />
                        <button className="i-btn" type="submit" disabled={!chk}>찾기</button>
                    </form>
                </section>
                <section className="UMF-box">
                    {error && <div className="i-errMessage">{error}</div>}
                </section>
            </div>
        </div>
    );
} export default ResetPassword;