import {useState} from "react"
import {useNavigate} from "react-router-dom"

function Membership(){

        const[userId,setUserId] = useState("");
        const[userPassword,setUserPassword] = useState("");
        const[userName,setUserName] = useState("");
        const[userPhoneNumber,setUserPhoneNumber] = useState("");

        const navigate = useNavigate();
        const[error,setError] = useState("");


    const memberShipSubmit = async (e)=>{
        e.preventDefault();


        try{
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/membership`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({userId,userPassword,userName,userPhoneNumber}),
                }
            );

            if(!response.ok){
                const err = await response.json();
                setError(err.error);
                return;
            }

            navigate("/");

        }catch(err){
            console.log(err);
            setError("알 수 없는 에러 발생..");
        }
    };

    return(
            <div>
                <h1>회원가입</h1>
                <form onSubmit={memberShipSubmit}>
                    <input style={{marginTop:"20px"}} type="text" value={userId} onChange={(e)=>setUserId(e.target.value)} placeholder={"id"}/><br/>
                    <input style={{marginTop:"20px"}} type="password" value={userPassword} onChange={(e)=>setUserPassword(e.target.value)} placeholder={"password"}/><br/>
                    <input style={{marginTop:"20px"}} type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder={"name"}/><br/>
                    <input style={{marginTop:"20px"}} type="text" value={userPhoneNumber} onChange={(e)=>setUserPhoneNumber(e.target.value)} placeholder={"phoneNumber"}/><br/>
                    <button style={{marginTop:"20px"}} type="submit">확인</button>
                </form>
                {error && <p style={{color:"red"}}>{error}</p>}
            </div>
    );
}export default Membership;