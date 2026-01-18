import { useEffect, useRef, useState } from "react";

//YAGNI 원칙 (You Aren't Gonna Need It)
export function useLocalImageCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [pickedId, setPickedId] = useState(null);
    const candidatesRef = useRef([]);

    const addFiles = (files) => {
        const arr = Array.from(files ?? []); //FileList를 File 객체로
        if (arr.length === 0) return;

        setCandidates((prev) => {
            const next = [...prev];
            for (const file of arr) {
                const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
                const previewUrl = URL.createObjectURL(file);
                next.push({ id, file, previewUrl});
            }
            return next;
        });
    };

    const addFile = (file) =>{
        const id = crypto.randomUUID?.() ?? `${Data.now()}-${Math.random()}`;
        const previewUrl = URL.createObjectURL(file);

        setCandidates(prev =>[
            ...prev,
            {id, file, previewUrl}
        ]);

        return previewUrl;
    };

    const removeCandidate = (id) => {
        setCandidates((prev) => {
            const target = prev.find((x) => x.id === id);
            if (target && target.previewUrl.startsWith("blob:"))
                URL.revokeObjectURL(target.previewUrl); //메모리 해제
            return prev.filter((x) => x.id !== id);
        });
        setPickedId((prev) => (prev === id ? null : prev));
    };

    const removeCandidateUrl = (src) =>{
        setCandidates((prev)=>{
            if(src.startsWith("blob:")) return [...prev];
            const target = prev.find((x) => x.previewUrl === src);
            if(target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((x)=>x.previewUrl !== src);
        });
    };

    //forEach, filter,find
    const clearAll = () => {
        setCandidates((prev) => {
            prev.forEach((x) => {
                if (x.previewUrl.startsWith("blob:"))
                    URL.revokeObjectURL(x.previewUrl);
            }); //전부 해제
            return [];
        });

        setPickedId(null);
    };

    useEffect(() => {
        candidatesRef.current = candidates;
    }, [candidates]);

    useEffect(() => {
        return () => {
            // cleanup이 실행될 때는 언마운트 시점이지만, 참조값은 마운트 시점.
            // stale 문제는 effect / callback / async 경계에서만 생긴다.
            //candidates.forEach((x) => URL.revokeObjectURL(x.previewUrl));

            candidatesRef.current.forEach((x) => {
                if (x.previewUrl.startsWith("blob:"))
                    URL.revokeObjectURL(x.previewUrl);
                }
            )
        };
    }, []);

// 렌더 중 계산, 항상 최신값 유지
const picked = candidates.find((x) => x.id === pickedId) ?? null;

return {
    candidates,
    pickedId,
    setPickedId,
    picked,
    addFiles,
    addFile,
    removeCandidate,
    removeCandidateUrl,
    clearAll,
};
} 