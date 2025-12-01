// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";  

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhcFhVmm5qaNWQ5DOwVhhabjKTjPpVnhM",
  authDomain: "shalom-balloon-art.firebaseapp.com",
  projectId: "shalom-balloon-art",
  storageBucket: "shalom-balloon-art.firebasestorage.app", 
  messagingSenderId: "839860531080",
  appId: "1:839860531080:web:0046b3467a2ba88169943d",
  measurementId: "G-RR5065FYKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ⭐ 전제 조건: storage export
export const storage = getStorage(app);