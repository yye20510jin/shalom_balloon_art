export function firebaseDownloadUrlToObjectPath(url){
    try{
        const u = new URL(url);
        const m = u.pathname.match(/\/o\/(.+)$/);
        if (!m) return null;
        return decodeURIComponent(m[1]);
    }catch{
        return null;
    }
}