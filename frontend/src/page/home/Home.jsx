import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar"
import { authFetch } from "../../api/authFetch";
import "../../styles/Home.css";
import shalomLogo from "../../assets/shalomBalloonArt.png";
import GalleryHero from "./GalleryHero";

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
                <div className="nav">
                    <img  className="logo" src={shalomLogo} alt="Shalom Balloom Art"/>
                    <Navbar />
                </div>
                <GalleryHero
                images={(posts ?? [])
                    .filter((post) => post?.thumbnailUrl)
                    .map((post) => ({
                    id: post.index,
                    src: post.thumbnailUrl,
                    alt: post.title,
                    }))}
                intervalMs={3500}
                visibleThumbs={3}
                />
            </div>
        </div>

    );
} export default Home;