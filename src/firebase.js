// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCUR2xEk2hKVxd8iV1JNDOWeb0oShCCpL8",
    authDomain: "patchup-b6765.firebaseapp.com",
    projectId: "patchup-b6765",
    storageBucket: "patchup-b6765.firebasestorage.app",
    messagingSenderId: "658479675411",
    appId: "1:658479675411:web:ee819f03fbd010bcde67e6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
