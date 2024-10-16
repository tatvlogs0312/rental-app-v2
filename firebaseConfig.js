import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDn5tGlrhbkDVe0ddE5Z81eAGSmByNgrQM",
  authDomain: "rent-app-v2.firebaseapp.com",
  projectId: "rent-app-v2",
  databaseURL: "https://rent-app-v2.firebaseio.com",
  storageBucket: "rent-app-v2.appspot.com",
  messagingSenderId: "929526950979",
  appId: "1:929526950979:android:6010eb5a4436eeb56e38f6",
  measurementId: "G-W2K92PDSCP",
};

const app = initializeApp(firebaseConfig);
