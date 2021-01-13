import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDZqt-1Kp1I1gqrIxMfDHnwl1SUMbF7K8s",
    authDomain: "amz-challenge-5f737.firebaseapp.com",
    databaseURL: "https://amz-challenge-5f737.firebaseio.com",
    projectId: "amz-challenge-5f737",
    storageBucket: "amz-challenge-5f737.appspot.com",
    messagingSenderId: "424214142970",
    appId: "1:424214142970:web:3ad64f8f66056308f0ce43",
    measurementId: "G-XBYEJ2J630"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { db, auth };