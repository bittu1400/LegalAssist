// Firebase Config Init (replace with your actual config)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_KEY,
  authDomain: import.meta.env.AUTH_KEY,
  projectId: import.meta.env.FIRE_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.SENDER_ID,
  appId: import.meta.env.APP_ID,
  measurementId: import.meta.env.MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginButton = document.querySelector('.plus1');
const signupButton = document.getElementById('plus2');
const sendButton = document.querySelector('.send');
const inputField = document.querySelector('.input');
const messageBox = document.getElementById('message');

sendButton.style.pointerEvents = "none";
sendButton.style.opacity = 0.5;

function showMessage(text, color = "red") {
    messageBox.innerText = text;
    messageBox.style.color = color;
}

loginButton.onclick = () => loginModal.classList.remove('hidden');
signupButton.onclick = () => signupModal.classList.remove('hidden');

document.getElementById('closeLogin').onclick = () => loginModal.classList.add('hidden');
document.getElementById('closeSignup').onclick = () => signupModal.classList.add('hidden');



// Login
document.getElementById('login-btn').onclick = async () => {
    const email = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        showMessage("Please enter both email and password.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginModal.classList.add('hidden');
        sendButton.style.pointerEvents = "auto";
        sendButton.style.opacity = 1;
        showMessage("Login successful! You can now chat.", "green");
    } catch (error) {
        showMessage("Login failed: " + error.message);
    }
};

// Signup
document.getElementById('signup-btn').onclick = async () => {
    const email = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!email || !password) {
        showMessage("Please enter both email and password.");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        signupModal.classList.add('hidden');
        showMessage("Sign up successful! Please log in.", "green");
    } catch (error) {
        showMessage("Sign up failed: " + error.message);
    }
};

// Send Message
sendButton.onclick = async () => {
    const userMessage = inputField.value.trim();
    if (!userMessage) {
        showMessage("Please enter a message before sending.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        showMessage("Please login first.");
        return;
    }

    try {
        await addDoc(collection(db, "messages"), {
            uid: user.uid,
            message: userMessage,
            timestamp: new Date()
        });

        showMessage("Message sent to bot! (simulate reply...)", "green");
        inputField.value = '';
    } catch (error) {
        showMessage("Error: " + error.message);
    }
};

// Auth state monitor (optional)
onAuthStateChanged(auth, (user) => {
    if (user) {
        sendButton.style.pointerEvents = "auto";
        sendButton.style.opacity = 1;
    } else {
        sendButton.style.pointerEvents = "none";
        sendButton.style.opacity = 0.5;
    }
});
