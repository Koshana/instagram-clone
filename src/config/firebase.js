import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBJIPG7q3TSsCSCY8RKjxQb3QQnoKIz4N0",
    authDomain: "instagram-a44c1.firebaseapp.com",
    projectId: "instagram-a44c1",
    storageBucket: "instagram-a44c1.appspot.com",
    messagingSenderId: "828171920398",
    appId: "1:828171920398:web:c91ff334cb8519634dc85f",
    measurementId: "G-FN6D697ZXX"
});

const DB = firebaseApp.firestore();
const AUTH = firebaseApp.auth();
const STORAGE = firebaseApp.storage();

export {
  DB, AUTH, STORAGE
}