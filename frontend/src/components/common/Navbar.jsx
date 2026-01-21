import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import AuthContext from "../../auth/AuthContext";
import logo from "../../assets/ShalomBalloonArt.png";
import "../../styles/public/Navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const { logout, isLoggedIn, roles } = useContext(AuthContext);
    const goAdmin = async () => {
        navigate("/admin/adminLogin");
    };

    const goUser = () => {
        navigate("/userLogin");
    };

    const goMembership = () => {
        navigate("/membership");
    };

    const GoPostList = () => {
        navigate("/user/posts/postList");
    };

    const unregister = async()=>{
        const ok = confirm("회원 탈퇴 하시겠습니까?");
        if(!ok) return;
        const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/membership`,{
            method:"DELETE",
            body: JSON.stringify(localStorage.getItem("userId"))
        });

        if (!res.ok){
            const err = await res.json();
            console.log("err : " , err.message);
            return;
            }
            
        logout();
        navigate("/");
        
    };
    return (
        <nav className="navbar">
            <div className="Nb-box">
                <img className="logo" src={logo} alt="shalomBalloonArt" />
                <div className="Nb-bt">
                    {isLoggedIn ?
                        (
                            <>
                                <button className="nav-button" onClick={logout}>로그아웃</button>
                                <button onClick={unregister}>회원탈퇴</button>
                                <button className="nav-button" onClick={GoPostList}>목록보기</button>
                            </>
                        ) : (
                            <>
                                <button className="nav-button" onClick={goUser}>로그인</button>
                                <button className="nav-button" onClick={goAdmin}>관리자 로그인</button>
                                <button className="nav-button" onClick={goMembership}>회원가입</button>
                            </>
                        )}
                    {roles?.includes("ROLE_ADMIN") && <button className="nav-button" onClick={() => { navigate("/admin"); }}>관리자 페이지</button>}
                </div>
            </div>
        </nav>
    );
} export default Navbar;