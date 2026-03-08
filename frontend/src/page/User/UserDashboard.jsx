import Navbar from "../../components/common/Navbar"
import AuthContext from "../../auth/AuthContext";
import PostList from "../post/PostList";
import { authFetch } from "../../api/authFetch";
import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserIcon from "../../assets/UserIcon.png";
import lock from "../../assets/lock.png";
import unlock from "../../assets/unlock.png";
import "../../styles/user/UserDashboard.css";
import "../../styles/public/Arrow.css"

function UserDashboard() {

    const { logout, userId } = useContext(AuthContext);
    const [password, setPassword] = useState("");
    const [chkPw, setChkPw] = useState(false);
    const [okPw, setOkPw] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    //비밀번호 확인
    const fncChkPw = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/chkPw`, {
                method: "POST",
                body: JSON.stringify({ checkPassword: password })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                console.log(data.message);
                setError("비밀번호가 일치하지 않습니다.");
                setTimeout(() => {
                    setError("");
                }, 1000);
                return;
            }
            setOkPw(true);

        } catch (err) {
            console.error(err);
        } finally {
            setChkPw(false);
            setPassword("")
        }

    };



    //회원 탈퇴
    const unregister = async () => {
        const ok = confirm("회원 탈퇴 하시겠습니까?");
        if (!ok) return;

        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/membership`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.message || "회원 탈퇴에 실패했습니다.");
                return;
            }

            logout();
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    //비밀번호 변경
    const changePw = () => {
        navigate("/user/changePw", { state: { fromUserPage: true } });
    };

    return (
        <div className=" container UserDashboard">
            <Navbar />
            <main>
                <section className="UD-dashboard">
                    <div className="UD-icon">
                        <img src={UserIcon} alt="아이콘" className="UD-user-img" />
                        {userId}
                    </div>
                    <div className="UD-subBox1">
                        <img className={`${okPw ? "UD-unlock" : "UD-lock"}`} src={chkPw ? unlock : lock} alt="개인정보 변경" onClick={() => {setChkPw(prev => !prev)}} />
                        {chkPw && (
                            <div className="UD-chkPw">
                                <form onSubmit={fncChkPw}>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" />
                                    <button type="submit" className={password && "i-btn"} disabled={!password}>확인</button>
                                </form>
                            </div>
                        )}
                        {okPw && (
                            <div className="UD-subChangediv">
                                    <button type="button" onClick={() => navigate("/user/userChangePhone", { state: { fromUserPage: true } })}>전화번호 변경</button>
                                    <button type="button" onClick={changePw}>비밀번호 변경</button>
                                    <button type="button" onClick={unregister}>회원탈퇴</button>
                            </div>
                        )}
                        {error && <div className="i-errMessage">{error}</div>}
                    </div>
                </section>
                <section className="UD-postLike">
                    <PostList mode="like" />
                </section>
            </main>
        </div>
    );

} export default UserDashboard