import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import { useFormatPhoneNumber } from "../../hooks/user/UseformatPhoneNumber";

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
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/resetPw`, {
                method: "POST",
                body: JSON.stringify({ userId, userPhoneNumber: formatPn })
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.message || "");
            }

            const data = await res.json();
            const token = data.resetToken;
            navigate("/user/ResetPw",{state:{token}});
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <form onSubmit={findPwFetch}>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디를 입력하세요" />
                <input type="text" value={userPhoneNumber} onChange={(e) =>
                    setUserPhoneNumber(prev =>
                        prev = formatPhoneNumber(e.target.value))} placeholder="전화번호를 입력하세요" />
                <button type="submit" disabled={!chk}>찾기</button>
            </form>
            {error && <div>{error}</div>}
        </div>
    );
} export default ResetPassword;