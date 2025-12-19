import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar"
import { authFetch } from "../../api/authFetch";
import "../../styles/Home.css";
import shalomLogo from "../../assets/shalomBalloonArt.png";
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
                <div className="thumbnail-grid">
                    {posts.map((post) => (
                        post.thumbnailUrl && (
                            <div key={post.index} className="thumb-item">
                                <img
                                    src={post.thumbnailUrl}
                                    alt={post.title}
                                />
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>

    );
} export default Home;