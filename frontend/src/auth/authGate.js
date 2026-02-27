let bootstrapping = true;
let resolveReady = null;
let rejectReady = null;

let authReady = new Promise((resolve, reject)=>{
    resolveReady = resolve;
    rejectReady = reject;
});

export function startBootstrapping(){
    bootstrapping = true;

    authReady = new Promise((resolve, reject)=>{
        resolveReady = resolve;
        rejectReady = reject;
    });

}

export function setBootstrappingDone(){
    bootstrapping = false;
    resolveReady?.();
}

export function setBootstrappingFailed(err){
    bootstrapping = false;
    rejectReady?.(err ?? new Error("BOOTSTRAP_FAILED"));
}

export async function waitAuthReady(){
    if (bootstrapping) await authReady;
}
