import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVWEjLyQK-dhXXQoYF4x5iQWWxoKBCMN4",
  authDomain: "btjo-b640b.firebaseapp.com",
  projectId: "btjo-b640b",
  storageBucket: "btjo-b640b.appspot.com",
  messagingSenderId: "229710976107",
  appId: "1:229710976107:web:fc44aa58b65e8c285f0d2e",
  measurementId: "G-4Z37KZXV5C",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });