import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDwr_MOmO7Pk2MyjkPtQM01IGSqll7UFk0",
  authDomain: "management-system-4979f.firebaseapp.com",
  projectId: "management-system-4979f",
  storageBucket: "management-system-4979f.firebasestorage.app",
  messagingSenderId: "588054953399",
  appId: "1:588054953399:web:75183106b96b4610b0fc32",
  measurementId: "G-1JG8DJ8BN5"
};


const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export default firebaseApp;