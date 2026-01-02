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
        <div className="home-container ">
            <div className="navbarUnder">
            <Navbar />
            </div>
            <div className="home-box1 container">
                <HomeGallery
                    images={(posts ?? [])
                        .filter((post) => post?.thumbnailUrl)
                        .map((post) => ({
                            id: post.index,
                            src: post.thumbnailUrl,
                            alt: post.title,
                        }))}
                />
            </div>
        </div>

    );
} export default Home;