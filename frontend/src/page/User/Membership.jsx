import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import shalomLogo from "../../assets/shalomBalloonArt.png";
import AuthContext from "../../auth/AuthContext";
import { useFormatPhoneNumber } from "../../hooks/user/UseformatPhoneNumber";
import { getJson } from "../../api/getJson";
import { showSuccess } from "../../util/toastUtil";
import "../../styles/user/Membership.css";

function Membership() {
  const { roles } = useContext(AuthContext);
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
  const admin = roles.some(role => role === "ROLE_ADMIN");

  const memberShipSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("입력 내용을 다시 확인해 주세요.");
      return;
    }
    const url = admin ? `${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/addAdmin` : `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/membership`;
    try {
      const formatPn = userPhoneNumber.replace(/\D/g, "");
      const res = await authFetch(
        url,
        {
          method: "POST",
          body: JSON.stringify({
            userId,
            userPassword,
            userName,
            userPhoneNumber: formatPn,
          }),
        }
      );

      const data = await getJson(res);

      if (!res.ok) {
        setError(
          data?.message || "회원가입에 실패했습니다. 새로고침 후 다시 이용해 주세요."
        );
        return;
      }

      if (admin) {
        showSuccess("관리자 추가 완료.");
        navigate("/admin");
      } else {
        showSuccess("회원가입에 성공했습니다. 관리자 인증 후 로그인 가능합니다.");
        navigate("/");
      }

    } catch (err) {
      console.error(err);
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
          credentials:"include",
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.text();

      data.includes("사용 가능") ? setIdCheck(true) : setIdCheck(false);
      setCheck(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="Login membership">
      <img className="Login-logo membership-logo" src={shalomLogo} art="shalomLogo" onClick={() => {
        if (admin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }} />
      <div className="membership-box">
        <section className="membership-main">
          <div className="Login-title">{admin ? "관리자 추가" : "회원가입"}</div>
          <form onSubmit={memberShipSubmit}>
            <div className="membership-form">
              <div className="membership-inputChk">
                <input
                  className={`membership-input ${check ? idCheck ? "success" : "error" : ""}`}
                  style={{ marginTop: "20px" }}
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setCheck(false);
                  }}
                  onBlur={userId.trim() ? id_duplicateCheck : null}
                  placeholder="아이디"
                />

                <input
                  className={`membership-input ${userPassword && !isPasswordValid && "error"}`}
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="비밀번호"
                />

                <input
                  className={`membership-input ${passwordConfirm && !isPasswordMatch && "error"}`}
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호 확인"
                />
                <ul>
                  {check && !idCheck && <li style={{ color: "red" }}>사용할 수 없는 아이디입니다.다른 아이디를 입력해 주세요.</li>}
                  {userPassword && !isPasswordValid && <li style={{ color: "red" }}>비밀번호는 8자 이상 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.</li>}
                  {passwordConfirm && !isPasswordMatch && <li style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</li>}
                </ul>
              </div>

              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="이름"
              />
              <input
                type="text"
                value={userPhoneNumber}
                onChange={(e) =>
                  setUserPhoneNumber(prev =>
                    prev = useFormatPhoneNumber(e.target.value))
                }
                placeholder="전화번호"
              />
              <button
                className={`membership-button ${isFormValid && "success subBtn"}`}
                style={{ marginTop: "20px" }}
                type="submit"
                disabled={!isFormValid}
              >
                확인
              </button>
            </div>
          </form>
        </section>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Membership;
