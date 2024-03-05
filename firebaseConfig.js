// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY3tF0QMZyR6Lf41PS7X8G4QwBkfmChvQ",
  authDomain: "smart-irrigation-system-92a81.firebaseapp.com",
  databaseURL: "https://smart-irrigation-system-92a81-default-rtdb.firebaseio.com",
  projectId: "smart-irrigation-system-92a81",
  storageBucket: "smart-irrigation-system-92a81.appspot.com",
  messagingSenderId: "399609628900",
  appId: "1:399609628900:web:b3ceda56cd32bf7ece04f1"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//export default firebaseConfig;
export const FIREBASE_APP = initializeApp(firebaseConfig);