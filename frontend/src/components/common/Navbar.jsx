import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../auth/AuthContext";

function Navbar(){
    
    const navigate = useNavigate();
    const{logout, isLoggedIn, roles} = useContext(AuthContext);
    const goAdmin = async () =>{
        navigate("/admin/adminLogin");
    };

    const goUser = () =>{
        navigate("/userLogin");
    };

    const goMembership =() =>{
        navigate("/membership");
    };

    const GoPostList = ()=>{
        navigate("/user/posts/postList");
    };
    return(
        <nav className="navbar">
            {isLoggedIn ? 
            (
            <>
            <button className="nav-button" onClick={logout}>로그아웃</button>
            <button className="nav-button" onClick={GoPostList}>목록보기</button>
            </>
            ):(
            <>
                <button className="nav-button" onClick={goUser}>로그인</button>
                <button className="nav-button" onClick={goAdmin}>관리자 로그인</button>
                <button className="nav-button" onClick={goMembership}>회원가입</button>
            </>
            )}
            { roles?.includes("ROLE_ADMIN") && <button className="nav-button" onClick = {()=>{navigate("/admin");}}>관리자 페이지</button>}
        </nav>
    );
}export default Navbar;