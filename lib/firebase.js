import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfvUHWrA_q2khliQ3ENxBFX9UFWxJRnF4",
  authDomain: "syntax-error-2.firebaseapp.com",
  projectId: "syntax-error-2",
  storageBucket: "syntax-error-2.firebasestorage.app",
  messagingSenderId: "525798376022",
  appId: "1:525798376022:web:092d0dedcd8f4e324131f7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();