// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAprl0N7a6wG0p7YFNrC_P8uu6QHEaa2Z0",
  authDomain: "fir-course-27a4d.firebaseapp.com",
  projectId: "fir-course-27a4d",
  storageBucket: "fir-course-27a4d.appspot.com",
  messagingSenderId: "892451529360",
  appId: "1:892451529360:web:e860c0453530c74d5b6e15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)

/*
    Firebase React Course For Beginners - Learn Firebase V9+ in 2 Hours
    https://youtu.be/2hR-uWjBAgw

    Firebase > Docs > Reference | Interface: Resource
    https://firebase.google.com/docs/reference/rules/rules.firestore.Resource?hl=en&authuser=0
*/
/*
  Cloud Firestore Rules 

  Original version from PedroTech:
  rules_version = '2';
  service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
    	// Anyone can read from this project. 
    	allow read: if true;
      // Only login user can write movie
      // write = create, update, delete 
      allow write: if request.auth != null && 
                      request.auth.uid == request.resource.data.userID;      
      }
    }
  }

  New version: 
  rules_version = '2';
  service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
    	// Anyone can read from this project. 
    	allow read: if true;
      
      // Only login user can create movie
      allow create: if request.auth != null;
      
      // Only creator can update and delete his own movie 
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userID;
      }
    }
  }

*/