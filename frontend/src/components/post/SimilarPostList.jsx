import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import "../../styles/post/SimilarPostList.css";

export default function SimilarPostList({ id }) {

    const navigate = useNavigate();

    const [noData, setNoData] = useState("");
    const [posts, setPosts] = useState([]);

    /* 페이지네이션 */
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const mapEndPage = endPage > 10 ? 10 : endPage ;

    useEffect(() => {
        const listFetch = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/similarPosts?page=${startPage}&postIndex=${id}`, {
                    method: "GET"
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => null);
                    console.error(data.message);
                    setNoData("게시글이 없습니다.");
                    return;
                }

                const data = await res.json();
                setPosts(data.content);
                setStartPage(data.number);
                setEndPage(data.totalPages);
                
            } catch (err) {
                console.error(err)
            }
        };

        listFetch();
    }, [id, startPage]);

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);
        return date.toLocaleString();
    };

    return (
        <div className="SimilarPostList container">
            {noData && <div className="i-errMessage">{noData}</div>}
            <div className="SPL-list">
            <div className="SPL-listTitle">비슷한 태그 글 더보기</div>
            {posts.map((post, i) => (
                <div className={`${i % 2 == 0 ? "even" : ""}`} key={post.index} onClick={()=>navigate(`/user/posts/postDetails/${post.index}`)}>
                    <div>{post.title}</div>
                    <div>{formatDateTime(post.createdAt)}</div>
                </div>
            ))}
            </div>

            <div className="SPL-bt">
                {Array.from({ length: mapEndPage }).map((_, i) => {
                    return (
                        <div key={i}>
                            <button type="button" onClick={() => setStartPage(i)} className={`SPL-page ${i === startPage ? "chk" : ""}`} >{i + 1}</button>
                        </div>
                    )
                })}
            </div>

        </div>
    );
}