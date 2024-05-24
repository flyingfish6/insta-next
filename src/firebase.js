// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "insta-clone-424214.firebaseapp.com",
  projectId: "insta-clone-424214",
  storageBucket: "insta-clone-424214.appspot.com",
  messagingSenderId: "181624906938",
  appId: "1:181624906938:web:cf99eca178ca0fba848e83",
  measurementId: "G-74BGW7S6PZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write: if
//       request.resource.size < 2 * 1024 * 1024 &&
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }
