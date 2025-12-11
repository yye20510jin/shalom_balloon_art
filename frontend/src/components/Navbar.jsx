import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";

function Navbar(){
    
    const navigate = useNavigate();
    const[isLoggedIn, setIsLoggedIn] = useState(false);
    const[roles, setRoles] = useState([]);

    useEffect(()=>{
        const token = localStorage.getItem("accessToken");
        const roles = JSON.parse(localStorage.getItem("roles")||"[]");
        setIsLoggedIn(!!token);
        setRoles(roles);
    },[]);

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
        navigate("/posts/postList");
    };

    const GoPostForm = ()=> {
        navigate("/posts");
    };

    const GoApprove = () =>{
        navigate("/admin/userApprove");
    };

    const handelLogout=()=>{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("roles");
        setIsLoggedIn(false);
        navigate("/");
    };

    return(
        <nav>
            {isLoggedIn ? 
            (
            <div>
            <button onClick={handelLogout}>로그아웃</button>
            <button onClick={GoPostList}>목록보기</button>
            </div>
            ):(
            <div>
                <button onClick={goUser}>로그인</button>
                <button onClick={goAdmin}>관리자 로그인</button>
                <button onClick={goMembership}>회원가입</button>
            </div>
            )}
            {roles.includes("ROLE_ADMIN") && (
                <>
                <button onClick={GoPostForm}>글 추가</button>
                <button onClick={GoApprove}>사용자 인증</button>
                </>  
            )
            }    
        </nav>
    );
}export default Navbar;