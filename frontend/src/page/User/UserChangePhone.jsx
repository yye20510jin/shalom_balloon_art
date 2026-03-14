import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import { showSuccess } from "../../util/toastUtil";
import { getJson } from "../../api/getJson";
import { useFormatPhoneNumber } from "../../hooks/user/useFormatPhoneNumber"
import Navbar from "../../components/common/Navbar"
import "../../styles/user/userChangePhone.css";
function UserChangePhone() {

    const navigate = useNavigate();
    const location = useLocation();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const formatPhoneNumber = useFormatPhoneNumber;
    const consumedRef = useRef(false);

      useEffect(()=>{
          if(!location.state?.fromUserPage){
              navigate("/user/userDashboard",{replace:true});
              return;
          }
  
          if(consumedRef.current){
              navigate(location.pathname,{replace:true,state:null});
              return;
          }
  
          if(!consumedRef.current) consumedRef.current = true;
  
      },[navigate]);

    const fncPhoneNumber = async (e) => {
        e.preventDefault();
        const formatPn = phoneNumber.replace(/\D/g, "");
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/changePhone`, {
                method: "POST",
                body: JSON.stringify({newPhone:formatPn}),
            });

            const data = await getJson(res);
            
            if (!res.ok) {
                setError(data?.message || "전화번호 변경에 실패했습니다.");
                return;
            }

            showSuccess("수정되었습니다.");
            navigate("/user/userDashboard", { replace: true });

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="UserChangePhone container">
            <Navbar />
            <div className="UCP-main">
                <div className="UCP-Phonediv">
                    <form className="UCP-form" onSubmit={fncPhoneNumber}>
                        <input type="text" placeholder="전화번호를 입력하세요" value={phoneNumber} onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))} />
                        <button className={phoneNumber? "i-btn":""} disabled={!phoneNumber} tyep="submit">확인</button>
                    </form>
                    {error && <div className="i-errMessage">{error}</div>}
                </div>
            </div>
        </div>
    );
} export default UserChangePhone;