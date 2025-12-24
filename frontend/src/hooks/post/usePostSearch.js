import { useState } from "react";
import { authFetch } from "../../api/authFetch";
export function usePostSearch() {

    const [searchText, setSearchText] = useState("");
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [loading, setLoading] = useState(true);

    //All search
    const fnc_allPost = async () => {
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts?page=${startPage}&searchTitle=${searchText}`,
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
            setEndPage(Math.ceil(data.totalElements / 10));

        } catch (error) {
            console.error(error);
            setError("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    //title search
    const fnc_searchText = async (e) => {
        e?.preventDefault();
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts?page=${startPage}&searchTitle=${searchText}`,
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
            setEndPage(Math.ceil(data.totalElements / 10));

        } catch (error) {
            console.error(error);
            setError("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return {
        searchText, setSearchText, fnc_searchText, posts, error, fnc_allPost, startPage, setStartPage, endPage, loading
    };

}