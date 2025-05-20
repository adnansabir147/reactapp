// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnNqTsPfXyscSHLDfHSSTUvQlgIQahvO0",
  authDomain: "test-project-8cf15.firebaseapp.com",
  projectId: "test-project-8cf15",
  storageBucket: "test-project-8cf15.appspot.com",
  messagingSenderId: "188105826709",
  appId: "1:188105826709:web:72def73620088a1e14169c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
