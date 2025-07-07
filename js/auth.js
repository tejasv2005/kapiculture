// js/auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCy4DBVOl9-28ZNdKLF42p6D-ECvkzP88g",
  authDomain: "kapikulture.firebaseapp.com",
  projectId: "kapikulture",
  storageBucket: "kapikulture.firebasestorage.app",
  messagingSenderId: "1066051890850",
  appId: "1:1066051890850:web:43db9d0e101eced86c31fb",
  measurementId: "G-YJPB76S6D7"
};

// 🔁 Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 👤 User State Logic
document.addEventListener("DOMContentLoaded", () => {
  const loginElement = document.querySelector(".login a");

  // Optional user display spot
  let userDisplay = document.querySelector(".username-display");
  if (!userDisplay) {
    userDisplay = document.createElement("span");
    userDisplay.className = "username-display";
    userDisplay.style.marginLeft = "15px";
    userDisplay.style.fontWeight = "bold";
    userDisplay.style.color = "#3e2c29";
    loginElement?.parentElement?.appendChild(userDisplay);
  }

  if (!loginElement) return;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const username = user.email.split('@')[0];
      loginElement.textContent = "Logout";
      loginElement.href = "#";
      userDisplay.textContent = `☕ ${username}`;

      if (!sessionStorage.getItem("welcomed")) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Welcome back, ${username} 👋`,
          showCloseButton: true,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          background: '#f0e9de',
          color: '#3e2c29',
          customClass: {
            popup: 'swal2-popup-custom'
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        sessionStorage.setItem("welcomed", "true");
      }

      loginElement.addEventListener("click", (e) => {
        e.preventDefault();
        Swal.fire({
          title: 'Are you sure?',
          text: "You’ll be logged out of Kapiculture.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5C4033',
          cancelButtonColor: '#aaa',
          confirmButtonText: 'Yes, Logout',
          cancelButtonText: 'Cancel',
          showCloseButton: true,
          background: '#f0e9de',
          color: '#3e2c29',
          customClass: {
            popup: 'swal2-popup-custom'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            signOut(auth)
              .then(() => {
                sessionStorage.removeItem("welcomed");
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'You’ve been logged out.',
                  showCloseButton: true,
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  background: '#f0e9de',
                  color: '#3e2c29',
                  customClass: {
                    popup: 'swal2-popup-custom'
                  }
                }).then(() => {
                  window.location.href = "./LoginPage/login.html";
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops!',
                  text: error.message,
                  showCloseButton: true,
                  background: '#f0e9de',
                  color: '#3e2c29'
                });
              });
          }
        });
      });

    } else {
      // Not logged in
      loginElement.textContent = "Login";
      loginElement.href = "./LoginPage/login.html";
      userDisplay.textContent = "";
    }
  });
});