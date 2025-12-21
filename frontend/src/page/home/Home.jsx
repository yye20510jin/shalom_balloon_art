import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar"
import { authFetch } from "../../api/authFetch";
import "../../styles/Home.css";
import shalomLogo from "../../assets/shalomBalloonArt.png";
import HomeGallery from "../../components/home/HomeGallery";

function Home() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts`, {
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
        <div className="home-container">
            <div className="home-box1">
                <HomeGallery
                images={(posts ?? [])
                    .filter((post) => post?.thumbnailUrl)
                    .map((post) => ({
                    id: post.index,
                    src: post.thumbnailUrl,
                    alt: post.title,
                    }))}
                />
                <header className="home-header">
                    <img  className="logo" src={shalomLogo} alt="Shalom Balloom Art"/>
                    <Navbar />
                </header>
            </div>
        </div>

    );
} export default Home;