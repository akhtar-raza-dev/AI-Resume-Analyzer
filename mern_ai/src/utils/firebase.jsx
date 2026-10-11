import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQU_JX8z8v5L7lkfzTP3ab9NMuABu_UEc",
  authDomain: "resume-aii.firebaseapp.com",
  projectId: "resume-aii",
  storageBucket: "resume-aii.firebasestorage.app",
  messagingSenderId: "29165814040",
  appId: "1:29165814040:web:c4d78b8f879ffc1d431e6d",
  measurementId: "G-M93XRNSD3L"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };