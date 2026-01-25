import { authFetch } from "../../api/authFetch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormatPhoneNumber } from "../../hooks/user/UseformatPhoneNumber";

function FindId() {

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

            if (!res.ok) {
                //에러처리
            }

            const id = await res.text();
            setUserId(id);
        } catch (err) {
            console.error(err);
        }


    }

    return (
        <div>
            <form onSubmit={findIdFetch}>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="닉네임을 입력하세요" />
                <input type="text" value={userPhoneNumber} onChange={(e) =>
                    setUserPhoneNumber(prev =>
                        prev = formatPhoneNumber(e.target.value))
                } placeholder="전화번호를 입력하세요" />
                <button type="submit" disabled={!chk}>찾기</button>
            </form>
            {userId && <div>{userId}</div>}
        </div>
    );
} export default FindId;