import {useState} from "react";
import {useNavigate} from "react-router-dom";

function UserLogin(){

    const [userId,setUserId] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/userLogin`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    body:JSON.stringify({userId,password}),
                }
            );

            if(!response.ok){
                console.log("일치하지 않음.");
                const err = await response.json();
                setError(err.error);
                return;
            }

            const data = await response.json();

            localStorage.setItem("accessToken",data.accessToken);
            localStorage.setItem("userId",data.userId);
            localStorage.setItem("roles",JSON.stringify(data.roles));

            navigate("/");

        }catch(err){
            console.error(err);
            setError("알 수 없는 에러 발생...");
        }
    };

    return(
        <div style={{padding:"20px"}}>
            <h1>회원 로그인</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" value={userId} onChange={(e)=>setUserId(e.target.value)} placeholder="아이디"/>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="비밀번호"/>
                </div>
                {error && <p style={{color:"red"}}>{error}</p>}
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}export default UserLogin;