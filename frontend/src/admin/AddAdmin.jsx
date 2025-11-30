import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authFetch} from "../api/authFetch"

function AddAdmin(){

        const[userId,setUserId] = useState("");
        const[userPassword,setUserPassword] = useState("");
        const[userName,setUserName] = useState("");
        const[userPhoneNumber,setUserPhoneNumber] = useState("");
        const[error,setError] = useState("");
        const navigate = useNavigate();
        
    useEffect(()=>{
        const fetchAdminData = async ()=>{
            try{
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/test`,{method:"GET",});
                
                if(!res || !res.ok){
                    navigate("/");
                }
            }catch(e){
                console.log(e);
            }
        };
        fetchAdminData();
    },[]);

    const memberShipSubmit = async (e)=>{
        e.preventDefault();

        try{
            const response = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/addAdmin`,{
                method:"POST",
                body:JSON.stringify({userId,userPassword,userName,userPhoneNumber}),
            });

            if(!response.ok){
                const err = await response.json();
                setError(err.error);
                return;
            }

            navigate("/admin");
        }catch(err){
            console.log(err);
        }
    };

    return(
            <div>
                <h1>관리자 추가</h1>
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
}export default AddAdmin;