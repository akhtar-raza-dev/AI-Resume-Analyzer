import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAIl6r5px6JVO-CXB3U1NQdR-2LMs_p78",
  authDomain: "ai-resume-analyzer-81e34.firebaseapp.com",
  projectId: "ai-resume-analyzer-81e34",
  storageBucket: "ai-resume-analyzer-81e34.firebasestorage.app",
  messagingSenderId: "318211684777",
  appId: "1:318211684777:web:c3df6550aee5cf49e2ecb8",
  measurementId: "G-LK3LYVHZK2"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };