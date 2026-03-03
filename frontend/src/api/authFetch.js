import { waitAuthReady } from "../auth/authGate";

let onUnauthorized = null;
let onForbidden = null;
let onAccessTokenChanged = null;
let accessToken = "";
let refreshPromise = null;

export async function tryRefreshToken() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include"
        }).then(async (res) => {
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
        }).finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

export function fncSetAccessToken(t) {
    accessToken = t || "";
}

export function setOnUnauthorized(handler, navHome, tokenChanged) {
    //logout
    onUnauthorized = handler;
    onForbidden = navHome;
    onAccessTokenChanged = tokenChanged;
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
        //네트워크 에러
        // *정책 1) 서버 에러가 발생하면 로그아웃 처리한다.
        if (typeof onUnauthorized === "function") onUnauthorized();
        throw e;
    }

    // ---- 에러 처리 ----
    if (response.status === 403) {
        if (typeof onForbidden === "function") onForbidden();
        return response;
    }

    if (response.status !== 401) return response;

    if (isRefreshCall) {
        if (typeof onUnauthorized === "function") onUnauthorized();
        return response;
    }
    //refresh 성공 -> 새 토큰으로 1회 재요청
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
        if (typeof onUnauthorized === "function") onUnauthorized();
        throw e;
    }

    // *정책 2) 재요청도 401이면 더 시도하지 말고 로그아웃
    if (retryResponse.status === 401) {
        if (typeof onUnauthorized === "function") onUnauthorized();
    }
    return retryResponse;
}
