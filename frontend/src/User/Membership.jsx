import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Membership() {
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [idCheck, setIdCheck] = useState(""); // "사용 가능.." / "이미 존재.." / ""
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isUserIdFilled = !!userId.trim();
  const isNameFilled = !!userName.trim();
  const isPhoneFilled = !!userPhoneNumber.trim();
  const isIdAvailable = idCheck === "사용 가능한 아이디입니다.";
  const isPasswordMatch = userPassword === passwordConfirm;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|;:'",.<>/?]).{8,}$/;
  const isPasswordValid = passwordRegex.test(userPassword);
  const isFormValid =
    isUserIdFilled &&
    isNameFilled &&
    isPhoneFilled &&
    isIdAvailable &&
    isPasswordMatch&&
    isPasswordValid;

  const memberShipSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("입력 내용을 다시 확인해 주세요.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/membership`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            userPassword,
            userName,
            userPhoneNumber,
          }),
        }
      );

      if (!res || !res.ok) {
        const errMsg = res ? await res.text() : "서버 응답 없음";
        setError(
          errMsg || "회원가입에 실패했습니다. 새로고침 후 다시 이용해 주세요."
        );
        return;
      }

      alert("회원가입 완료")
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("알 수 없는 오류 발생. 관리자에게 문의해 주세요");
    }
  };

  const id_duplicateCheck = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/idDuplicateCheck`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const message = await res.text();
      setIdCheck(message);
    } catch (err) {
      console.log(err);
      setError("알 수 없는 오류 발생. 관리자에게 문의해 주세요");
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={memberShipSubmit}>
        <input
          style={{ marginTop: "20px" }}
          type="text"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setIdCheck(""); // 아이디 바꾸면 중복 결과 리셋
          }}
          placeholder="id"
        />
        <br />
        <button
          style={{ marginTop: "20px" }}
          type="button"
          onClick={id_duplicateCheck}
          disabled={!userId.trim()}
        >
          중복확인
        </button>
        {idCheck && (
          <p style={{ color: idCheck.includes("사용 가능") ? "green" : "red" }}>
            {idCheck}
          </p>
        )}

        <br />

        <input 
            style={{ marginTop: "20px" }} 
            type="password" 
            value={userPassword} 
            onChange={(e) => setUserPassword(e.target.value)} 
            placeholder="password" 
            /> 
        <br />
        <ul style={{ fontSize: "14px", marginTop: "10px" }}>
            <li style={{ color: userPassword.length >= 8 ? "green" : "red" }}>8자 이상</li>
            <li style={{ color: /[A-Z]/.test(userPassword) ? "green" : "red" }}>대문자 포함</li>
            <li style={{ color: /[a-z]/.test(userPassword) ? "green" : "red" }}>소문자 포함</li>
            <li style={{ color: /\d/.test(userPassword) ? "green" : "red" }}>숫자 포함</li>
            <li style={{ color: /[!@#$%^&*]/.test(userPassword) ? "green" : "red" }}>특수문자 포함</li>
        </ul>

        <input
            style={{ marginTop: "20px" }}
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="password confirm"
            />
        {passwordConfirm && !isPasswordMatch && (
            <p style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</p>
        )}
        {passwordConfirm && isPasswordMatch && (
            <p style={{ color: "green" }}>비밀번호가 일치합니다.</p>
        )}
        <br />

        <input
          style={{ marginTop: "20px" }}
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="name"
        />
        <br />

        <input
          style={{ marginTop: "20px" }}
          type="text"
          value={userPhoneNumber}
          onChange={(e) => setUserPhoneNumber(e.target.value)}
          placeholder="phoneNumber"
        />
        <br />

        <button
          style={{ marginTop: "20px" }}
          type="submit"
          disabled={!isFormValid}
        >
          확인
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Membership;
