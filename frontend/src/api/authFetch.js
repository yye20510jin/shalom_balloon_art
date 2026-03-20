import { waitAuthReady } from "../auth/authGate";
import { showError } from "../util/toastUtil";

let onUnauthorized = null;
let onForbidden = null;
let onAccessTokenChanged = null;
let accessToken = "";
let refreshPromise = null;
let onServerError = null;


export async function tryRefreshToken() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include"
        }).then(async (res) => {
            alert(`refresh status : ${res.status}`);
            if (!res.ok) return null;
            const data = await res.json().catch(() => null);
            const token = data?.accessToken;
            if (token && token.trim()) {
                accessToken = token;
                if (typeof onAccessTokenChanged === "function") {
                    onAccessTokenChanged(token);
                }
                return data;
            }
            return null;
        }).catch((e)=>{
            alert(`refresh fetch error : ${e.message}`);
        }).finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

export function fncSetAccessToken(t) {
    accessToken = t || "";
}

export function setOnUnauthorized(handler, navHome, tokenChanged, serverError, ) {
    onUnauthorized = handler;
    onForbidden = navHome;
    onAccessTokenChanged = tokenChanged;
    onServerError = serverError;
}

export async function authFetch(url, options = {}) {
    await waitAuthReady();
    const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
    };

    if (accessToken && accessToken.trim()) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const isRefreshCall = url.includes("/api/auth/refresh");

    let response;
    try {
        response = await fetch(url, { ...options, headers, credentials: "include" });
    } catch (e) {
        showError("네트워크 오류가 발생했습니다.");
        throw e;
    }

    if (response.status === 403) {
        if (typeof onForbidden === "function") onForbidden();
        return response;
    }

    if (response.status >= 500 && response.status < 600) {
        onServerError();
        return response;
    }

    if (response.status === 401){
        const data = await response.json();
        if(data.code === "USER_CREDENTIALS_INVALID"){
            return response;
        }
    }

    if (response.status !== 401) return response;

    if (isRefreshCall) {
        if (typeof onUnauthorized === "function") onUnauthorized();
        return response;
    }

    const newToken = (await tryRefreshToken())?.accessToken || null;
    if (!newToken) {
        if (typeof onUnauthorized === "function") onUnauthorized();
        return response;
    };

    const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
    let retryResponse;

    try {
        retryResponse = await fetch(url, { ...options, headers: retryHeaders, credentials: "include" });
    } catch (e) {
        showError("네트워크 오류가 발생했습니다.");
        throw e;
    }

    if (retryResponse.status === 401) {
        if (typeof onUnauthorized === "function") onUnauthorized();
        return retryResponse;
    }

    if (retryResponse.status === 403) {
        if (typeof onForbidden === "function") onForbidden();
        return retryResponse;
    }

    if (retryResponse.status >= 500 && retryResponse.status < 600) {
        onServerError();
        return retryResponse;
    }

    return retryResponse;
}
