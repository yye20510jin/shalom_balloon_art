import { useState, useEffect, useRef } from "react";
import { authFetch } from "../../api/authFetch";
import Modal from "../../components/common/Modal";

function PostTag({ tagSelected, setTagSelected }) {

    const [data, setData] = useState([]);
    const [tagOpen, setTagOpen] = useState(false);
    const [tagName, setTagName] = useState("");
    const [addTagChk, setAddTagChk] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (!tagOpen) return;
        if (!addTagChk) return; 
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [tagOpen,addTagChk]);

    useEffect(() => {
        const tagFetch = async () => {

            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/getPostTag`, {
                    method: "GET",
                });

                if (!res.ok) {
                    const err = await res.json();
                    setError(err.message || "태그를 가져올 수 없습니다.");
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

        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/addPostTag`, {
                method: "POST",
                body: JSON.stringify({
                    tagName
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.message || "태그 저장에 실패했습니다.");
            }

            const newTag = await res.json();
            toggle(newTag.tagName);
            setTagName("");
            setAddTagChk(false);
            setData((prev) => {
                if (prev === null) return [newTag];
                let chk = 0;
                prev.forEach((t) => {
                    t.tagName === newTag.tagName && chk++;
                });
                return chk <= 0 ? [...prev, newTag] : [...prev];
            });

        } catch (err) {
            console.log(err);
        }

    }

    const openModal = () =>{
        setTagOpen(true);
    };

    const closeModal = () => {
        setTagName("");
        setAddTagChk(false);
        setTagOpen(false);
    }


    return (

        <div className="PostTag">
            <button className="PT-bto i-btn" type="button" onClick={openModal}> 태그 선택
            </button>
            <Modal open={tagOpen} onClose={closeModal} title="" error={error}>
                    <>
                        <div className="PT-taglist">
                            {data.map((tag) => (
                                <span key={tag.tagIndex}>
                                    <label>
                                        <input type="checkbox" checked={tagSelected.includes(tag.tagName)} onChange={() => toggle(tag.tagName)} />
                                        #{tag.tagName}
                                    </label>
                                </span>
                            ))}
                        </div>
                        <div className="PT-addTag"> 
                            <input ref={inputRef} style={{display: addTagChk ? "block" : "none"}} id="tagName" name="tagName" type="text" placeholder="추가할 태그를 입력하세요" value={tagName} onChange={(e) => setTagName(e.target.value)} />
                            <button className="PT-addTagBtn i-btn" disabled={addTagChk && !tagName.trim()} type="button" onClick={() => addTagChk ? handleAddTag() : setAddTagChk(true)}> {addTagChk ? "추가" : "태그 추가"}</button>
                        </div>
                    </>
            </Modal>
        </div>

    );
}
export default PostTag;