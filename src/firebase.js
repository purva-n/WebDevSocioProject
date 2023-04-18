// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDMckXtE_Rxxv1eQ48Wdv5ALvNr7zGqKIY",
    authDomain: "socio-final-57bf4.firebaseapp.com",
    projectId: "socio-final-57bf4",
    storageBucket: "socio-final-57bf4.appspot.com",
    messagingSenderId: "988383251207",
    appId: "1:988383251207:web:d5ac05b4e759030d2093a2",
    measurementId: "G-NX6H1KFWW5"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};

//export default db;