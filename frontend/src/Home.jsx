import {useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar"
function Home(){

    const navigate = useNavigate();
    const click=()=>{
        navigate("/posts/new");
    };

    return(
        <div style={{padding:"20px"}}>
        <Navbar />
        <h1>샬롬 풍선 아트</h1>
        <button type="button" onClick={click}>이미지 업로드</button>
        </div>
    );
}export default Home;