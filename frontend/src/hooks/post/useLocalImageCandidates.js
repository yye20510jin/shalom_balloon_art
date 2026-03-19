import { useEffect, useRef, useState } from "react";

export function useLocalImageCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [pickedId, setPickedId] = useState(null);
    const candidatesRef = useRef([]);

    const addFiles = (files) => {
        const arr = Array.from(files ?? []);
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
                URL.revokeObjectURL(target.previewUrl); 
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

    const clearAll = () => {
        setCandidates((prev) => {
            prev.forEach((x) => {
                if (x.previewUrl.startsWith("blob:"))
                    URL.revokeObjectURL(x.previewUrl);
            }); 
            return [];
        });

        setPickedId(null);
    };

    useEffect(() => {
        candidatesRef.current = candidates;
    }, [candidates]);

    useEffect(() => {
        return () => {
            candidatesRef.current.forEach((x) => {
                if (x.previewUrl.startsWith("blob:"))
                    URL.revokeObjectURL(x.previewUrl);
                }
            )
        };
    }, []);

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