import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authFetch } from "../../api/authFetch";

function UserChangePw() {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [userChk, setUserChk] = useState(false);
    const [chkPassword, setChkPassword] = useState("");

    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const isPasswordMatch = newPassword === newPasswordConfirm;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|;:'",.<>/?]).{8,}$/;
    const isPasswordValid = passwordRegex.test(newPassword);

    const chk = !!newPassword.trim() && !!newPasswordConfirm.trim() && !!isPasswordMatch && !!isPasswordValid;

    const chkUser = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/chkPw`, {
                method: "POST",
                body: JSON.stringify({ checkPassword: chkPassword })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                console.log(data.message);
                navigate("/user/userDashboard");
                setUserChk(false);
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }

            setUserChk(true);

        } catch (err) {
            console.error(err);
        }
    };


    const changePw = async (e) => {
        e.preventDefault();
        if (!chk) return;
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/changePw`, {
                method: "POST",
                body: JSON.stringify({ newPassword }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                console.log(data?.message ?? "");
                setError("비밀번호 변경 오류. 다시 시도해 주세요");
                return;
            }

            alert("비밀번호가 변경되었습니다.");
            navigate("/user/userDashboard", { replace: true });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            {userChk ?
                <div>
                    <form onSubmit={changePw}>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="password" />
                        <input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} placeholder="password confirm" />
                        <button type="submit" disabled={!chk}>확인</button>
                    </form>
                    <ul>
                        {newPassword && !isPasswordValid && <li>비밀번호: 8자 이상 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.</li>}
                        {newPasswordConfirm && !isPasswordMatch && <li>비밀번호가 일치하지 않습니다.</li>}
                        {error && <li>{error}</li>}
                    </ul>
                </div>
                :
                <div>
                    <form onSubmit={chkUser}>
                        <input type="password" value={chkPassword} onChange={(e) => setChkPassword(e.target.value)} placeholder="password" />
                        <button type="submit">확인</button>
                    </form>
                </div>
            }

        </div>
    );

} export default UserChangePw;