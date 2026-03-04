import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth/AuthContext";
import logo from "../../assets/ShalomBalloonArt.png";
import inventoryImg from "../../assets/inventory.svg";
import "../../styles/public/Navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const { logout, isLoggedIn, roles } = useContext(AuthContext);
    const [inventory, setInventory] = useState(false);

    const goUser = () => {
        navigate("/userLogin");
    };

    const goMembership = () => {
        navigate("/membership");
    };

    const GoPostList = () => {
        navigate("/user/posts/postList/list");
    };

    const goUserDashboard = () => {
        navigate("/user/userDashboard");
    };

    return (
        <nav className="navbar">
            <div className="Nb-box">
                <img className="logo" src={logo} alt="shalomBalloonArt" onClick={() => navigate("/")} />
                <div className="Nb-bt">
                    {isLoggedIn ?
                        (
                            <>
                                <button className="nav-button" onClick={logout}>로그아웃</button>
                                <button className="nav-button" onClick={goUserDashboard}>유저 페이지</button>
                                <button className="nav-button" onClick={GoPostList}>목록보기</button>
                            </>
                        ) : (
                            <>
                                <button className="nav-button" onClick={goUser}>로그인</button>
                                <button className="nav-button" onClick={goMembership}>회원가입</button>
                            </>
                        )}
                    {roles?.includes("ROLE_ADMIN") && <button className="nav-button" onClick={() => { navigate("/admin"); }}>관리자 페이지</button>}
                </div>
                <div className="Nb-mobile">
                    <img className="Nb-inventory" src={inventoryImg} alt="inventory" onClick={() => setInventory(prev => !prev)} />
                    <span className="Nb-mobile-bt">
                        {inventory && isLoggedIn && (
                            <>
                                <button className="nav-button" onClick={logout}>로그아웃</button>
                                <button className="nav-button" onClick={goUserDashboard}>유저 페이지</button>
                                <button className="nav-button" onClick={GoPostList}>목록보기</button>
                            </>
                        )
                        }
                        {inventory && !isLoggedIn && (
                            <>
                                <button className="nav-button" onClick={goUser}>로그인</button>
                                <button className="nav-button" onClick={goMembership}>회원가입</button>
                            </>
                        )}
                    </span>
                </div>
            </div>
        </nav>
    );
} export default Navbar;