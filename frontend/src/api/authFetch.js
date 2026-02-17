let onUnauthorized = null;
let onForbidden = null;
let accessToken = "";
let refreshPromise = null;

async function tryRefresh(){
    if(!refreshPromise){
        refreshPromise = fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh`,{
            method:"POST",
            credentials:"include"
        }).then(res => {
            if(!res.ok) throw new Error();
            return res.json();
        }).then(data => {
            accessToken = data.accessToken;
            return true;
        }).catch(()=>false)
        .finally(()=>{
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

export function fncSetAccessToken(t){
    accessToken = t;
}

export function setOnUnauthorized(handler,navHome) {
    //logout
  onUnauthorized = handler;
  onForbidden = navHome;
}

export async function authFetch(url, options = {}){
    const token = accessToken;

    const headers = {
        ...(options.headers||{}),
        "Content-Type" : "application/json",
    };

    if(token && token.trim()){
        headers["Authorization"]=`Bearer ${token}`;
    }

    let response = await fetch(url,{
        ...options,
        headers,
        credentials: "include"});

    if(response.status === 401){
        const refreshed = await tryRefresh();

        if(refreshed){
            const newToken = accessToken;
            headers["Authorization"] = `Bearer ${newToken}`;

            response = await fetch(url,{
                ...options,
                headers,
                credentials:"include"
            });
        }else{
            if (typeof onUnauthorized === "function") onUnauthorized();
        }    
    }
    
    if(response.status === 403) {
        if(typeof onForbidden === "function") onForbidden();
    }

    return response;
}