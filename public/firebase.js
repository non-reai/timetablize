// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import * as analytics from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import * as auth from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import * as firestore from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAJURmgeApHsolkcr8Rqf_KJDk3DmtbILQ",
	authDomain: "timetablize.firebaseapp.com",
	projectId: "timetablize",
	storageBucket: "timetablize.appspot.com",
	messagingSenderId: "331569043165",
	appId: "1:331569043165:web:047db1dec8e415c775ed34",
	measurementId: "G-89CB4KSSJ4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analyticsApp = analytics.getAnalytics(app);
const authApp = auth.getAuth(app)
const firestoreApp = firestore.getFirestore(app)

export { analytics, auth, firestore }
export { analyticsApp, authApp, firestoreApp }

export default app
