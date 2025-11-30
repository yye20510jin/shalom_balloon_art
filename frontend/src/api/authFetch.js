export async function authFetch(url, options = {}){
    const token = localStorage.getItem("accessToken");

    const headers = {
        ...(options.headers||{}),
        "Content-Type" : "application/json",
    };

    if(token){
        headers["Authorization"]=`Bearer ${token}`;
    }

    const response = await fetch(url,{...options,headers,});

    if(response.status === 401){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("roles");
    }

    return response;
}