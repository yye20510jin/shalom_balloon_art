import { useEffect, useState } from "react";
import { authFetch } from "../../api/authFetch";
import "../../styles/public/Arrow.css";
export function SearchPostTag({finalMode,fnc_postList,searchTags,setSearchTags}) {

    //태그 검색 여부 변수
    const [useTag, setUseTag] = useState(false);
    const [serverOk, setServerOk] = useState(false);

    const [tags, setTags] = useState([]);

    useEffect(() => {
        const getTagFetch = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/getPostTag`, {
                    method: "GET"
                });

                if (!res.ok) {
                    const data = await res.json();
                    console.log(data.message);
                    setServerOk(false);
                    return;
                }

                const data = await res.json();
                setTags(data);
                setServerOk(true);

            } catch (err) {
                console.error(err);
                setServerOk(false);
            }
        }
        getTagFetch();
    }, []);

    const toggle = (value) => {
        setSearchTags((prev) =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    useEffect(()=>{
        finalMode === "list" && fnc_postList();
    },[searchTags]);

    return (
        <div className="SearchPostTag">
            {serverOk && (
                <>
                    <button type="button" onClick={() => setUseTag(prev => !prev)}>
                        태그 검색{!useTag ? <div className="arrow-big down"></div> : <div className="arrow-big up"></div>}
                    </button>

                    {useTag && (
                        <div className="SPT-tagBox">
                            <ul>
                                {tags.map((tag) => (
                                    <li key={tag.tagIndex}>
                                        <label>
                                            <input type="checkbox" checked={searchTags.includes(tag.tagIndex)} onChange={() => toggle(tag.tagIndex)} />
                                            #{tag.tagName}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </>
            )}

        </div>

    );
}