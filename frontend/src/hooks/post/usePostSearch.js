import { useState } from "react";
import { authFetch } from "../../api/authFetch";
import { getJson } from "../../api/getJson";
export function usePostSearch() {

    const [searchText, setSearchText] = useState("");
    const [searchTags, setSearchTags] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const fnc_postList = async (e) => {
        e?.preventDefault();
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts?page=${startPage}&searchTitle=${searchText}&searchTags=${searchTags}`,
                {
                    method: "GET",
                }
            );

            const data = await getJson(res);

            if (!res.ok) {
                setError(data?.message || "게시글을 가져오지 못했습니다.");
                setLoading(false);
                return;
            }

            setPosts(data.content);
            setStartPage(data.number);
            setEndPage(Math.ceil(data.totalElements / data.size));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fnc_userLikePost = async(e)=>{
        e?.preventDefault();
        try{
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/userLikePosts?page=${startPage}`,{
                method:"GET"
            });

            const data = await getJson(res);

            if(!res.ok){
                setPosts([]);
                setLoading(false);
                return;
            }

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