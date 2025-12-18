import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar"
import { authFetch } from "../../api/authFetch";
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
    },[]);


    return (
        <div style={{ padding: "20px" }}>
            <Navbar />
            <h1>샬롬 풍선 아트</h1>

            {posts.map((post) => (
                post.thumbnailUrl && (
                    <div key={post.index} style={{ flex: "0 0 120px" }}>
                        <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            style={{
                            width: "120px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: 4,
                            }}
                        />
                    </div>
                )
            ))}
        </div>

    );
} export default Home;