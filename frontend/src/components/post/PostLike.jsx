import { useEffect, useState } from "react";
import { authFetch } from "../../api/authFetch";
import grayHeart from "../../assets/grayHeart.png";
import redHeart from "../../assets/redHeart.png";

function PostLike({id, like, setLikeCount}) {

    const[postLike, setPostLike] = useState(false);

    useEffect(()=>{
        setPostLike(like);
    },[like]);

    const handlePostLike = async (e,chk) => {
        e.stopPropagation();
        //chk => 0 : 좋아요 취소, 1 : 좋아요
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/${id}/${chk}`, {
                method: "POST",
            });

            if (!res.ok) {
                const data = await res.json();
                console.log(data.message);
                return;
            }

            //let !postLike로 변경하는 경우는 useEffect에 안 잡히는 지 gpt한테 물어보기
            setPostLike(prev => !prev);
            setLikeCount(prev => prev+1);

        } catch (err) {
            console.error(err);
        }
    }



    return (
        <div className="Post-like">
            {!postLike ? <button className="Post-like-button" type="button" onClick={(e) => handlePostLike(e,1)}><img className="Post-like-img" src={grayHeart} alt="좋아요 취소" /></button>
                : <button className="Post-like-button" type="button" onClick={(e) => handlePostLike(e,0)}><img className="Post-like-img" src={redHeart} alt="좋야요" /></button>}
        </div>
    );
} export default PostLike;
