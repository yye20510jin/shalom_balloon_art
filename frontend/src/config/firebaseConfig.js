import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";  

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
let storage;

if(firebaseConfig.projectId){
  try{
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    storage = getStorage(app);
  }catch(error){
    console.error("Firebase 초기화 중 오류 발생 : " , error);
  }
}else{
  console.warn("Firebase 설정이 없습니다. 일부 동작이 제한될 수 있습니다.");
}

export {storage};