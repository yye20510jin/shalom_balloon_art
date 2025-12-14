let onUnauthorized = null;

export function setOnUnauthorized(handler) {
  onUnauthorized = handler;
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

    return response;
}