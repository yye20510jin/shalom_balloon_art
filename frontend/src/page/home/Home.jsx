import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar"
import { authFetch } from "../../api/authFetch";
import "../../styles/Home.css";
import home from "../../assets/home.svg";
import Reveal from"../../components/animations/Reveal";
import "../../styles/animations/index.css";
function Home() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/home`, {
                    method: "GET",
                });

                if (!res) return;

                const data = await res.json();
                setPosts(data);

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
                <img src={home} />

                <section className="HM-s1">
                    <Reveal useThreshold="0.48" extras="anim--slow" className="HM-s1sub1">
                        <div className="HM-sub1-img"></div>
                        <div className="HM-sub1-text"></div>
                    </Reveal>
                    <Reveal useThreshold="0.51" effect="anim-fade-in" extras="anim--slow" className="HM-s1sub2">
                        <div className="HM-sun2-img"></div>
                        <div className="HM-sub2-text"></div>
                    </Reveal> 
                </section>
            </main>

            <footer className="HM-ft">
                <div className="HM-ft-text">
                    아트, 풍선이 되다.<br/>
                    Eun-kyung Park
                </div>
            </footer>

        </div>

    );
} export default Home;