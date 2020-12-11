import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDaWaI9ry5vMYdA962hpMISIFw2oiWq2jA",
    authDomain: "urclassposts.firebaseapp.com",
    databaseURL: "https://urclassposts-default-rtdb.firebaseio.com/",
    projectId: "urclassposts",
    storageBucket: "urclassposts.appspot.com",
    messagingSenderId: "631514982159",
    appId: "1:631514982159:web:112eb6174639010ddd807a",
    measurementId: "G-SY3MVFLS8Q"
  };
  
firebase.initializeApp(firebaseConfig);

export default firebase;
