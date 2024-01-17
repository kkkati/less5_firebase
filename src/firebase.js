import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDK1si7BRrumtdK9QpZyg5BX90083yazoA",
  authDomain: "todosproject-ae6f7.firebaseapp.com",
  projectId: "todosproject-ae6f7",
  storageBucket: "todosproject-ae6f7.appspot.com",
  messagingSenderId: "252914347803",
  appId: "1:252914347803:web:2e836f8acbdd3f898e6dbe",
  databaseURL:
    "https://todosproject-ae6f7-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
