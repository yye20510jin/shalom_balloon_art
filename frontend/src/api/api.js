const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export async function fetchMessage(){
    const res = await fetch(`${BACKEND_BASE_URL}/api`);
    if(!res.ok){
        throw new Error("백엔드 요청 실패");
    }
    return res.text();
}