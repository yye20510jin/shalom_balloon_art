import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { authFetch } from "../../api/authFetch";
import Navbar from "../../components/common/Navbar"
import { showSuccess } from "../../util/toastUtil";
import { getJson } from "../../api/getJson";
import "../../styles/user/UserChangePw.css";


function UserChangePw() {
    const navigate = useNavigate();
    const location = useLocation();
    const consumedRef = useRef(false);

    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const isPasswordMatch = newPassword === newPasswordConfirm;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|;:'",.<>/?]).{8,}$/;
    const isPasswordValid = passwordRegex.test(newPassword);

    const chk = !!newPassword.trim() && !!newPasswordConfirm.trim() && !!isPasswordMatch && !!isPasswordValid;

    useEffect(() => {
    if (!location.state?.fromUserPage) {
        navigate("/user/userDashboard", { replace: true });
        return;
    }

    if(consumedRef.current){
        navigate(location.pathname, {replace:true, state:null})
    }

    if(!consumedRef.current) consumedRef.current=true;

    }, [navigate]);

    const changePw = async (e) => {
        e.preventDefault();
        if (!chk) return;
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/changePw`, {
                method: "POST",
                body: JSON.stringify({ newPassword }),
            });

            const data = await getJson(res);

            if (!res.ok) {
                setError(data?.message || "비밀번호 변경 오류. 다시 시도해 주세요");
                return;
            }

            showSuccess("수정되었습니다.");
            navigate("/user/userDashboard", { replace: true });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="container UserChangePw">
            <Navbar />
            <div className="UC-main">
                <div className="UC-Pwdiv">
                    <form className="UC-form" onSubmit={changePw}>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="password" />
                        <input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} placeholder="password confirm" />
                        <button type="submit" className={chk?"i-btn":""} disabled={!chk}>확인</button>
                    </form>
                    <ul>
                        {newPassword && !isPasswordValid && <li className="i-errMessage">비밀번호: 8자 이상 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.</li>}
                        {newPasswordConfirm && !isPasswordMatch && <li className="i-errMessage">비밀번호가 일치하지 않습니다.</li>}
                        {error && <li className="i-errMessage">{error}</li>}
                    </ul>
                </div>
            </div>
        </div>
    );

} export default UserChangePw;

