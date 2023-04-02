import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBn5tpQdl4ioxP8jpEb6d0OSpUj3HLz8Pk",
  authDomain: "fir-project-c3995.firebaseapp.com",
  projectId: "fir-project-c3995",
  storageBucket: "fir-project-c3995.appspot.com",
  messagingSenderId: "153287927206",
  appId: "1:153287927206:web:e643a9d3c469ffda829b67",
  measurementId: "G-PQM3PSL954"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
