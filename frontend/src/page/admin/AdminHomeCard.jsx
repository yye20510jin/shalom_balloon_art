import { useState, useEffect, useRef } from "react";
import { useLocalImageCandidates } from "../../hooks/post/useLocalImageCandidates";
import { authFetch } from "../../api/authFetch";
import { useFirebaseSingleImageUpload } from "../../hooks/firebase/useFirebaseSingleImageUpload";
import { getJson } from "../../api/getJson";
import "../../styles/admin/AdminHomeCard.css";
function AdminHomeCard() {
    const [imgUrl, setImgUrl] = useState(["", ""]);
    const [text, setText] = useState(["", ""]);
    const [error, setError] = useState("");
    const { addFile } = useLocalImageCandidates();
    const imgUrlInput = useRef([null, null]);
    const firstImgUrl = useRef(["", ""]);
    const imgFile = useRef([null, null]);
    const { uploadOne } = useFirebaseSingleImageUpload();
    const isSubmit = imgUrl[0].trim() && text[0].trim() && imgUrl[1].trim() && text[1].trim();
    const [mount, setMount] = useState(0);

    useEffect(() => {

        const fetch = async () => {
            try {
                const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/homeCard`, {
                    method: "GET"
                });

                const data = await getJson(res);

                if (!res.ok) {
                    setError(data.message);
                    return;
                }

                for (let i = 0; i < 2; i++) {
                    if (data[i].imgUrl) {
                        setImgUrl(prev => {
                            const next = [...prev];
                            next[i] = data[i].imgUrl;
                            return next;
                        });
                        setText(prev => {
                            const next = [...prev];
                            next[i] = data[i].text;
                            return next;
                        });
                        firstImgUrl.current[i] = data[i].imgUrl;
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetch();
    }, [mount]);

    const handleHomeImage = async (e, i) => {
        const file = e.target.files?.[0]; 
        if (!file) return;
        const url = addFile(file);
        if (i === 0) {
            setImgUrl(prev => {
                const next = [...prev];
                next[0] = url;
                return next;
            });
            imgFile.current[0] = file;
        } else if (i === 1) {
            setImgUrl(prev => {
                const next = [...prev];
                next[1] = url;
                return next;
            });
            imgFile.current[1] = file;
        }
        e.target.value = "";
    }

    const AdminHomeSubmit = async () => {
        const finalImgUrl = [...imgUrl];
        for (let i = 0; i < 2; i++) {
            if (firstImgUrl.current[i] !== imgUrl[i]) {
                try {
                    const url = await uploadOne(imgFile.current[i]);
                    finalImgUrl[i] = url;
                } catch (err) {
                    console.error("firebase error : " + err);
                    setError("firebase 이미지 업로드 실패");
                    return;
                }
            }
        }
        try {
            const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/homeCard`, {
                method: "POST",
                body: JSON.stringify({ imgUrl: finalImgUrl, text }),
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.message);
                return;
            }
            firstImgUrl.current = [...finalImgUrl];
            setMount(prev => prev + 1);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container AHC_main">
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div className="AHC_sub">
                {Array.from({ length: 2 }).map((_, i) => (
                    <section key={i} className={`AHC_section${i}`}>
                        {imgUrl[i] ? (
                            <div className="AHC_imgBox">
                                <img src={imgUrl[i]} alt="HomeCardImg1" />
                                <button onClick={() => {
                                    setImgUrl(prev => {
                                        const next = [...prev];
                                        next[i] = "";
                                        return next;
                                    });
                                    imgFile.current[i] = null;
                                }}>x</button>
                            </div>
                        ) : (
                            <div className={`AHC_noIMG${i}`}>
                                <button onClick={() => imgUrlInput.current[i]?.click()}>+</button>
                            </div>
                        )}
                        <input type="text" value={text[i] ?? ""} onChange={(e) => {
                            setText(prev => {
                                const next = [...prev];
                                next[i] = e.target.value;
                                return next;
                            });
                        }} placeholder="설명을 입력하세요" />
                    </section>
                ))}
            </div>

            {Array.from({ length: 2 }).map((_, i) => (
                <input key={i} ref={(el) => imgUrlInput.current[i] = el}
                    type="file" accept="image/*" hidden onChange={(e) => handleHomeImage(e, i)} />
            ))}

            <footer>
                <button type="button" onClick={AdminHomeSubmit} disabled={!isSubmit}>수정</button>
            </footer>
        </div>
    );

} export default AdminHomeCard;