/** File to configure connection to firebase services */

// Import firebase services needed
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Apply firebase config settings, using env data
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get auth instance from firebase
const auth = getAuth(app)

// Get firestore database instance from firebase
const db = getFirestore(app)

// Get storage instance from firebase
const storage = getStorage(app)

//Export properties to be used by other components
export {
    app as default,
    auth,
    db,
    storage
}