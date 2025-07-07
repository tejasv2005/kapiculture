import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCy4DBVOl9-28ZNdKLF42p6D-ECvkzP88g",
  authDomain: "kapikulture.firebaseapp.com",
  projectId: "kapikulture",
  storageBucket: "kapikulture.firebasestorage.app",
  messagingSenderId: "1066051890850",
  appId: "1:1066051890850:web:43db9d0e101eced86c31fb",
  measurementId: "G-YJPB76S6D7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // Toggle between Login and Signup
  loginBtn.addEventListener("click", () => {
    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  });

  signupBtn.addEventListener("click", () => {
    signupBtn.classList.add("active");
    loginBtn.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  });

  // Password visibility toggles
  addPasswordToggle("loginPassword");
  addPasswordToggle("signupPassword");
  addPasswordToggle("signupConfirm");

  function addPasswordToggle(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";

    const eyeIcon = document.createElement("span");
    eyeIcon.textContent = "🙈";
    eyeIcon.style.cursor = "pointer";
    eyeIcon.style.marginLeft = "10px";
    eyeIcon.style.fontSize = "1.2rem";
    eyeIcon.title = "Show/Hide Password";

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(eyeIcon);

    eyeIcon.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";
        eyeIcon.textContent = "👁️";
      } else {
        input.type = "password";
        eyeIcon.textContent = "🙈";
      }
    });
  }

  // Login Submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;

    if (!email || !pass) {
      Swal.fire("Missing Info", "Please fill in all login fields.", "warning");
      return;
    }

    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        Swal.fire("Welcome back! ☕", "You're now logged in.", "success").then(() => {
          if (role === "seller") {
            window.location.href = "../SellerPage/seller.html";
          } else {
            window.location.href = "../index.html";
          }
        });
      })
      .catch((error) => {
        Swal.fire("Login Failed", error.message, "error");
      });
  });

  // Signup Submission
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass = document.getElementById("signupPassword").value.trim();
    const confirm = document.getElementById("signupConfirm").value.trim();

    if (!name || !email || !pass || !confirm) {
      Swal.fire("Incomplete", "Please fill in all signup fields.", "error");
      return;
    }

    if (pass !== confirm) {
      Swal.fire("Mismatch", "Passwords do not match.", "error");
      return;
    }

    createUserWithEmailAndPassword(auth, email, pass)
      .then(() => {
        Swal.fire("Account Created!", "You're all set to brew with us ☕", "success").then(() => {
          loginBtn.click(); // Switch to login form
        });
      })
      .catch((error) => {
        Swal.fire("Signup Failed", error.message, "error");
      });
  });
});