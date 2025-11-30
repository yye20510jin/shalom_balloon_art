import {useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar"
function Home(){

    const navigate = useNavigate();


    return(
        <div style={{padding:"20px"}}>
        <Navbar />
        <h1>샬롬 풍선 아트</h1>

        </div>
    );
}export default Home;