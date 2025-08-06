// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCeG1enB4_aQNBH62IHkEFc8RAqrzzLoHA",
  authDomain: "chat-sphere-ece60.firebaseapp.com",
  projectId: "chat-sphere-ece60",
  storageBucket: "chat-sphere-ece60.appspot.com",
  messagingSenderId: "359070765346",
  appId: "1:359070765346:web:b1974cc127579608bd557b",
  measurementId: "G-3KPWT8NE46"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
