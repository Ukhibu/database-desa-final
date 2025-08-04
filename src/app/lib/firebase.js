// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PASTIKAN KODE INI YANG ANDA GUNAKAN
const firebaseConfig = {
  apiKey: "AIzaSyBi94SzhWQqllr0CCLbV5OCMoTNox3xo8M",
  authDomain: "web-database-prangkat-desa.firebaseapp.com",
  projectId: "web-database-prangkat-desa",
  storageBucket: "web-database-prangkat-desa.appspot.com",
  messagingSenderId: "384016514498",
  appId: "1:384016514498:web:1952d6f67402aa4f6daa5b"
};

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };