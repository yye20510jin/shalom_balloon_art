import { useState, useEffect, useRef} from "react";
import { authFetch } from "../../api/authFetch";

function PostTag({tagSelected,setTagSelected}) {

    const [data, setData] = useState([]);
    const [tagOpen, setTagOpen] = useState(false);
    const [tagName, setTagName] = useState("");
    const [addTagChk, setAddTagChk] = useState(false);


    useEffect(() => {
        const tagFetch = async () => {

            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/getPostTag`, {
                    method: "GET",
                });

                if (!res.ok) {
                    //에러 처리 예정
                }

                const d = await res.json();
                //Tap 정보
                setData(d);

            } catch (err) {
                console.log(err);
            }

        };

        tagFetch();
    }, []);

    const toggle = (value) => {
        setTagSelected((prev) =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    }

    const handleAddTag = async () => {
        
        try{
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/addPostTag`, {
                method: "POST",
                body: JSON.stringify({
                    tagName
                }),
            });

            if(!res.ok){
                //에러 처리 예정
            }
            
            const newTag = await res.json();
            toggle(newTag.tagName);
            setTagName("");
            setAddTagChk(false);
            setData((prev)=>{
                if(prev === null) return [newTag];
                let chk = 0;
                prev.forEach((t)=>{
                    t.tagName === newTag.tagName && chk++;
                });
                return chk <= 0 ? [...prev,newTag] : [...prev];
            });

        }catch(err){
            console.log(err);
        }

    }


    return (
        <div className="postTag">
            <button className="PT_bto" type="button" onClick={() => 
                setTagOpen(prev => {
                    if(prev) setAddTagChk(false);
                    return !prev
                })}>
                태그 추가 {tagOpen ? "v" : "^"}
            </button>
            {tagOpen &&
                <ul>
                    {data.map((tag) => (
                        <li key={tag.index}>
                            <label>
                                <input type="checkbox" checked={tagSelected.includes(tag.tagName)} onChange={() => toggle(tag.tagName)} />
                                #{tag.tagName}
                            </label>
                        </li>
                    ))}
                    <li>
                        {addTagChk && <input type="text" placeholder="추가할 태그를 입력하세요" value={tagName} onChange={(e) => setTagName(e.target.value)} />}
                        <button  disabled={addTagChk && !tagName.trim()} type="button" onClick={() => addTagChk ? handleAddTag() : setAddTagChk(true)}> {addTagChk ? "추가" : "태그 추가"}</button>
                    </li>
                </ul>
            }
        </div>
    );
}
export default PostTag;