import{useEffect,useState} from"react";
import{authFetch} from "../api/authFetch";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";  

function Admin(){
    
    const[error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchAdminData = async () =>{
            
            try{
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/test`,{method:"GET",}); 
                if(!res || !res.ok){
                    setError("관리자 권한이 없거나, 로그인 필요");
                    navigate("/");
                    return;
                }

            }catch(e){
                console.error(e);
                setError("서버 에러 발생");
            }
        };
        fetchAdminData();
    },[]);

    return(
        <div style={{padding:20}}>
            <Navbar/>
            <h1>관리자 페이지</h1>
            {error && <p style={{color:"red"}}>{error}</p>}
        </div>
    );
}
export default Admin;