import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

// Public web config for the same project the Android app uses. These values are
// not secret; access is controlled by Firestore security rules.
const firebaseConfig = {
  apiKey: "AIzaSyD0Rh0sK5NnR5BaGk1eDQlAlC8L55fKTd8",
  authDomain: "arjun-guruji-app.firebaseapp.com",
  projectId: "arjun-guruji-app",
  storageBucket: "arjun-guruji-app.appspot.com",
  messagingSenderId: "699085946848",
  appId: "1:699085946848:web:a31ae560f5975bac557585",
  measurementId: "G-HJ42C2H32F",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
