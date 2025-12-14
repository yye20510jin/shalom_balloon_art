let onUnauthorized = null;
let onForbidden = null;

export function setOnUnauthorized(handler,navHome) {
  onUnauthorized = handler;
  onForbidden = navHome;
}

export async function authFetch(url, options = {}){
    const token = localStorage.getItem("accessToken");

    const headers = {
        ...(options.headers||{}),
        "Content-Type" : "application/json",
    };

    if(token){
        headers["Authorization"]=`Bearer ${token}`;
    }

    const response = await fetch(url,{...options,headers});

    if(response.status === 401){
       if (typeof onUnauthorized === "function") onUnauthorized(); 
    }
    
    if(response.status === 403) {
        if(typeof onForbidden === "function") onForbidden();
    }

    return response;
}