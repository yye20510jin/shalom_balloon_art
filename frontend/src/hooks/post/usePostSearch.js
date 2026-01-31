import { useState } from "react";
import { authFetch } from "../../api/authFetch";
export function usePostSearch() {

    const [searchText, setSearchText] = useState("");
    const [searchTags, setSearchTags] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [loading, setLoading] = useState(true);

    //post list
    const fnc_postList = async (e) => {
        e?.preventDefault();
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts?page=${startPage}&searchTitle=${searchText}&searchTags=${searchTags}`,
                {
                    method: "GET",
                }
            );

            if (!res.ok) {
                const msg = res ? await res.text() : "서버 응답 없음";
                setError(msg);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setPosts(data.content);
            setStartPage(data.number);
            setEndPage(Math.ceil(data.totalElements / data.size));
        } catch (error) {
            console.error(error);
            setError("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    //user Like
    const fnc_userLikePost = async(e)=>{
        e?.preventDefault();
        try{
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/userLikePosts?page=${startPage}`,{
                method:"GET"
            });

            if(!res.ok){
                const data = await res.json();
                console.log(data.message);
                setPosts([]);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setPosts(data.content);
            setStartPage(data.number);
            setEndPage(Math.ceil(data.totalElements / data.size));

        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    }

    return {
        fnc_userLikePost, searchText, setSearchText, posts, error, fnc_postList, startPage, setStartPage, endPage, loading, searchTags, setSearchTags
    };

}