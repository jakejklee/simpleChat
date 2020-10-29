import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCDtdfapAYs3CdXd-r_qTeZtmp_22ldYVk",
    authDomain: "mytest-49f9f.firebaseapp.com",
    databaseURL: "https://mytest-49f9f.firebaseio.com",
    projectId: "mytest-49f9f",
    storageBucket: "mytest-49f9f.appspot.com",
    messagingSenderId: "201366629989"
};
firebase.initializeApp(config);

export default firebase;