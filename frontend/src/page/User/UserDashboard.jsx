import AuthContext from "../../auth/AuthContext";
import { authFetch } from "../../api/authFetch";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const unregister = async () => {
        const ok = confirm("회원 탈퇴 하시겠습니까?");
        if (!ok) return;
        const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/membership`, {
            method: "DELETE",
            body: JSON.stringify(localStorage.getItem("userId"))
        });

        if (!res.ok) {
            const err = await res.json();
            console.log("err : ", err.message);
            return;
        }

        logout();
        navigate("/");

    };


    return (
        <div>
            <button onClick={()=>navigate()}>좋아요</button>
            <button onClick={}>비밀번호 변경</button>
            <button onClick={unregister}>회원탈퇴</button>
        </div>
    );

} export default UserDashboard