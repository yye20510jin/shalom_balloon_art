import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar"
import { authFetch } from "../../api/authFetch";
import "../../styles/home/Home.css";
import home from "../../assets/home.svg";
import Reveal from "../../components/animations/Reveal";
import "../../styles/animations/index.css";
function Home() {
    const [imgUrl, setImgUrl] = useState([null, null]);
    const [text, setText] = useState(["", ""]);
    const navigate = useNavigate();

    const goAdmin = async () => {
        navigate("/admin/adminLogin");
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/home`, {
                    method: "GET",
                });

                if (!res.ok) {
                    console.error("홈 카드를 가져오지 못했습니다.");
                    return;
                }

                const data = await res.json();

                for (let i = 0; i < 2; i++) {
                    setImgUrl(prev => {
                        const next = [...prev];
                        next[i] = data[i].imgUrl;
                        return next;
                    });

                    setText(prev => {
                        const next = [...prev];
                        next[i] = data[i].text;
                        return next;
                    });
                }

            } catch (err) {
                console.error(err);
            }

        };

        fetchPosts();
    }, []);


    return (
        <div className="home-container container ">
            <Navbar />
            <main className="home">
                <div className="homeImg">
                <img  src={home}/>
                    <button className="adminButton" onClick={goAdmin}>관리자 로그인</button>
                </div>
                <section className="HM-cardSection">
                    <Reveal useThreshold="0.48" extras="anim--slow" className="HM-card one">
                        <div className="cardImg"><img src={imgUrl[0]} alt="HomeCard1" /></div>
                        <div className="cardText">{text[0]}</div>
                    </Reveal>
                    <Reveal useThreshold="0.51" effect="anim-fade-in" extras="anim--slow" className="HM-card two">
                        <div className="cardImg"><img src={imgUrl[1]} alt="HomeCard2" /></div>
                        <div className="cardText">{text[1]}</div>
                    </Reveal>
                </section>
            </main>

            <footer className="HM-ft">
                <div className="HM-ft-text">
                    아트, 풍선이 되다.<br />
                    Eun-kyung Park
                </div>
            </footer>
        </div>
    );
} export default Home;