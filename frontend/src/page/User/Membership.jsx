import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shalomLogo from "../../assets/shalomBalloonArt.png";
import "../../styles/user/Membership.css";

function Membership() {
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();

  const isUserIdFilled = !!userId.trim();
  const isNameFilled = !!userName.trim();
  const isPhoneFilled = !!userPhoneNumber.trim();
  const isPasswordMatch = userPassword === passwordConfirm;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|;:'",.<>/?]).{8,}$/;
  const isPasswordValid = passwordRegex.test(userPassword);
  const isFormValid =
    isUserIdFilled &&
    isNameFilled &&
    isPhoneFilled &&
    idCheck &&
    isPasswordMatch &&
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
        const errMsg = res ? await res.json() : "서버 응답 없음";
        setError(
          errMsg.error || "회원가입에 실패했습니다. 새로고침 후 다시 이용해 주세요."
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

     message.includes("사용 가능") ? setIdCheck(true) : setIdCheck(false);
     setCheck(true);
    } catch (err) {
      console.log(err);
      setError("알 수 없는 오류 발생. 관리자에게 문의해 주세요");
    }
  };

  return (
    <div className="membership">
      <div className="membership-box">
        <img className="membership-logo" src={shalomLogo} art="shalomLogo" />
        <form onSubmit={memberShipSubmit}>
          <div className="membership-form">
            <div className="membership-inputChk">
            <input
              className={`membership-input ${check? idCheck?"success":"error" : ""}`}
              style={{ marginTop: "20px"}}
              type="text"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setCheck(false);
              }}
              onBlur={userId.trim() ? id_duplicateCheck : null }
              placeholder="id"
            />

            <input
              className={`membership-input ${userPassword && !isPasswordValid && "error"}`}
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="password"
            />

            <input
              className={`membership-input ${passwordConfirm && !isPasswordMatch && "error"}`}
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="password confirm"
            />
            <ul style={{marginTop: "10px", marginBottom:"30px" }}>
              {check && !idCheck && <li style={{color:"red"}}>아이디: 사용할 수 없는 아이디입니다. 다른 아이디를 입력해 주세요.</li>}
              {userPassword && !isPasswordValid && <li style={{color:"red"}}>비밀번호: 8자 이상 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.</li>}
              {passwordConfirm && !isPasswordMatch && <li style={{color:"red"}}>비밀번호가 일치하지 않습니다.</li>}
            </ul>
            </div>

            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="name"
            />
            <input
              type="text"
              value={userPhoneNumber}
              onChange={(e) => setUserPhoneNumber(e.target.value)}
              placeholder="phoneNumber"
            />
            <button
              className={`membership-button ${isFormValid && "success"}`}
              style={{ marginTop: "20px" }}
              type="submit"
              disabled={!isFormValid}
            >
              확인
            </button>
          </div>
        </form>

      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Membership;
