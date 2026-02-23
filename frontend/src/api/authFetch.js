let onUnauthorized = null;
let onForbidden = null;
let accessToken = "";
let refreshPromise = null;

async function tryRefresh() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include"
        }).then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        }).then(data => {
            accessToken = data.accessToken;
            return true;
        }).catch(() => false)
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

async function safeJson(res) {
    return res.json().catch(() => null);
}

export function fncSetAccessToken(t) {
    accessToken = t;
}

export function setOnUnauthorized(handler, navHome) {
    //logout
    onUnauthorized = handler;
    onForbidden = navHome;
}

export async function authFetch(url, options = {}) {
    const token = accessToken;

    const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
    };

    if (token && token.trim()) {
        headers["Authorization"] = `Bearer ${token}`;
    }

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
    if (response.status === 403 && response?.code === "AUTH_FORBIDDEN") {
        if (typeof onForbidden === "function") onForbidden();
        return response;
    }

    if (response.status !== 401) return response;

    const error = await safeJson(response);

    //만료일 때만 refresh 시도
    if (error?.detail === "TOKEN_EXPIRED") {
        const refreshed = await tryRefresh();
        if (!refreshed) {
            if (typeof onUnauthorized === "function") onUnauthorized();
            return response;
        }


        //refresh 성공 -> 새 토큰으로 1회 재요청
        const newToken = accessToken;
        if (newToken) headers["Authorization"] = `Bearer ${newToken}`;

        let retryResponse;

        try {
            retryResponse = await fetch(url, { ...options, headers, credentials: "include" });
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

    return response;
}