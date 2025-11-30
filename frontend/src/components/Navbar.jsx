import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";

function Navbar(){
    
    const navigate = useNavigate();
    const[isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
    },[]);

    const goAdmin = async () =>{
        navigate("/adminLogin");
    };

    const goUser = () =>{
        navigate("/userLogin");
    };

    const goMembership =() =>{
        navigate("/membership");
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
            {isLoggedIn ? (<button onClick={handelLogout}>로그아웃</button>):(
            <div>
                <button onClick={goUser}>로그인</button>
                <button onClick={goAdmin}>관리자 로그인</button>
                <button onClick={goMembership}>회원가입</button>
            </div>
            )}
        </nav>
    );
}export default Navbar;