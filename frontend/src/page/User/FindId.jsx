import { authFetch } from "../../api/authFetch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormatPhoneNumber } from "../../hooks/user/UseformatPhoneNumber";
import { getJson } from "../../api/getJson";
import shalomLogo from "../../assets/shalomBalloonArt.png";
import "../../styles/user/UserMembershipFind.css";

function FindId() {

    const [error, setError] = useState("");
    const [userName, setUserName] = useState("");
    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [userId, setUserId] = useState("");
    const chk = !!userName.trim() && !!userPhoneNumber.trim();
    const formatPhoneNumber = useFormatPhoneNumber;
    const navigate = useNavigate();

    const findIdFetch = async (e) => {
        e.preventDefault();
        try {
            const formatPn = userPhoneNumber.replace(/\D/g, "");
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/findId`, {
                method: "POST",
                body: JSON.stringify({ userName, userPhoneNumber: formatPn }),
            });

            const data = await getJson(res);

            if (!res.ok) {
                console.log("data : ", data.message);
                setError(data.message || "입력하신 정보와 일치하는 계정이 없습니다.");
                return;
            }

            const id = data.text();
            setUserId(id);

        } catch (err) {
            console.error(err);
        }


    }

    useEffect(()=>{
        if(error){
            setTimeout(()=>{
                setError("");
            },2000)
        }
    },[error]);

    return (
        <div className="Login">
            <img className="Login-logo" alt="shalom" onClick={() => navigate("/")} src={shalomLogo} />
            <div className="Login-box">
                <section className="Login-main">
                    <div className="Login-title">아이디 찾기</div>
                    <form className="Login-form UMF-form" onSubmit={findIdFetch}>
                        <input className="Login-input" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="닉네임을 입력하세요" />
                        <input className="Login-input" type="text" value={userPhoneNumber} onChange={(e) =>
                            setUserPhoneNumber(prev =>
                                prev = formatPhoneNumber(e.target.value))
                        } placeholder="전화번호를 입력하세요" />
                        <button className="i-btn" type="submit" disabled={!chk}>찾기</button>
                    </form>
                </section>
                <section className="UMF-box">
                    {error && <div className="i-errMessage">{error}</div>}
                    {userId && <div>{userId}</div>}
                </section>
            </div>
        </div>
    );
} export default FindId;