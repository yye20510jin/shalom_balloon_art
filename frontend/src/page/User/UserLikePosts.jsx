import {useState, useEffect} from "react";
import { authFetch } from "../../api/authFetch";
function UserLikePosts(){

    const [error,setError] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        (async()=>{
            const res = await authFetch(``,{
                method:"GET"
            });

            if(!res.ok){
                const data = await res.json().catch(()=>null);
                console.log(data.message);
                setError("현재 글을 가져올 수 없습니다. 관리자에게 문의해 주세요");
                return;
            }

            const data = await res.json();
            setPosts(data);

            //글 하나도 없을 때.
            //글 가져오는 중
        })();
    },[]);

    return(
        <div>
        {posts.map((post)=>(
            <div key={post.index}></div>
        ))}
        </div>
    );
}export default UserLikePosts;