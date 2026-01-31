import Navbar from "../../components/common/Navbar"
import AuthContext from "../../auth/AuthContext";
import { authFetch } from "../../api/authFetch";
import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserIcon from "../../assets/UserIcon.png";
import "../../styles/user/UserDashboard.css";
import "../../styles/public/Arrow.css"

function UserDashboard() {

    const { logout } = useContext(AuthContext);
    const [password, setPassword] = useState("");
    const [chkPw, setChkPw] = useState(false);
    const [okPw, setOkPw] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const count = useRef(0);
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
                setTimeout(()=>{
                    setError("");
                },1000);
                return;
            }
            count.current++;
            setOkPw(true);

        } catch (err) {
            console.error(err);
        }finally{
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
                console.log("err : ", err.message);
                return;
            }

            logout();
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    //좋아요 한 글 보기
    const likePost = () => {
        navigate("/user/posts/postList/like");
    };

    //비밀번호 변경
    const changePw = () => {
        navigate("/user/changePw",{state:{fromUserPage:true}});
    };

    return (
        <div className=" container UserDashboard">
            <Navbar/>
            <main>
                <img src={UserIcon} alt="아이콘" className="UD-user-img" />
                <div className="UD-subBox1">
                    <button type="button" className="UD-btn" onClick={likePost}>좋아요한 글 보기</button>
                    <button type="button" className="UD-btn arrowButton" onClick={() => {
                        if(count.current <= 0){
                        setChkPw(prev => !prev)
                    }}}>개인정보 변경
                        {okPw && <div className="UD-arrowDiv" onClick={()=>setOpen((prev) => !prev)}>
                            {open ? <div className="arrow-big up"></div> : <div className="arrow-big down"></div>}</div>}
                    </button>
                    {chkPw && (
                        <div className="UD-chkPw">
                        <form onSubmit={fncChkPw}>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요"/>
                            <button type="submit" className={password && "i-btn" } disabled={!password}>확인</button>
                        </form>
                        </div>
                    )}
                    {open && (
                        <div className="UD-subChangediv">
                            <div className="UD-subChangeflex">
                            <button type="button" onClick={()=>navigate("/user/userChangePhone",{state:{fromUserPage:true}})}>전화번호 변경</button>
                            <button type="button" onClick={changePw}>비밀번호 변경</button>
                            <button type="button" onClick={unregister}>회원탈퇴</button>
                            </div>
                        </div>
                    )}
                    {error && <div className="i-errMessage">{error}</div>}
                </div>
            </main>
        </div>
    );

} export default UserDashboard