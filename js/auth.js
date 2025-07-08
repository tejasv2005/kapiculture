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
  if (!loginElement) return;

  // Account Button (dynamically created)
  let userDropdownBtn = document.querySelector(".user-dropdown-btn");
  if (!userDropdownBtn) {
    userDropdownBtn = document.createElement("button");
    userDropdownBtn.className = "user-dropdown-btn";
    userDropdownBtn.style.marginLeft = "15px";
    userDropdownBtn.style.background = "#f0e9de"; // Always visible
    userDropdownBtn.style.border = "none";
    userDropdownBtn.style.cursor = "pointer";
    userDropdownBtn.style.fontWeight = "bold";
    userDropdownBtn.style.fontSize = "1rem";
    userDropdownBtn.style.color = "#3e2c29"; // Match navbar
    userDropdownBtn.style.padding = "6px 10px";
    userDropdownBtn.style.borderRadius = "8px";
    userDropdownBtn.style.transition = "all 0.2s ease";
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const username = user.email.split("@")[0];
      loginElement.textContent = "Logout";
      loginElement.href = "#";
      userDropdownBtn.textContent = `☕ ${username}`;

      // Append if not already present
      if (!userDropdownBtn.isConnected) {
        loginElement.parentElement?.appendChild(userDropdownBtn);
      }

      // Welcome Message (once per session)
      if (!sessionStorage.getItem("welcomed")) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Welcome back, ${username} 👋`,
          showCloseButton: true,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          background: "#f0e9de",
          color: "#3e2c29",
          customClass: {
            popup: "swal2-popup-custom"
          },
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          }
        });
        sessionStorage.setItem("welcomed", "true");
      }

      // 👆 Clicking the name
      userDropdownBtn.onclick = () => {
        window.location.href = "./accountpage/account.html"; // ✅ case-sensitive
      };

      // 🚪 Logout
      loginElement.addEventListener("click", (e) => {
        e.preventDefault();
        Swal.fire({
          title: "Are you sure?",
          text: "You’ll be logged out of Kapiculture.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#5C4033",
          cancelButtonColor: "#aaa",
          confirmButtonText: "Yes, Logout",
          cancelButtonText: "Cancel",
          showCloseButton: true,
          background: "#f0e9de",
          color: "#3e2c29",
          customClass: {
            popup: "swal2-popup-custom"
          }
        }).then((result) => {
          if (result.isConfirmed) {
            signOut(auth)
              .then(() => {
                sessionStorage.removeItem("welcomed");
                Swal.fire({
                  toast: true,
                  position: "top-end",
                  icon: "success",
                  title: "You’ve been logged out.",
                  showCloseButton: true,
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  background: "#f0e9de",
                  color: "#3e2c29",
                  customClass: {
                    popup: "swal2-popup-custom"
                  }
                }).then(() => {
                  window.location.href = "./LoginPage/login.html";
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Oops!",
                  text: error.message,
                  showCloseButton: true,
                  background: "#f0e9de",
                  color: "#3e2c29"
                });
              });
          }
        });
      });

    } else {
      // 🔓 Logged Out
      loginElement.textContent = "Login";
      loginElement.href = "./LoginPage/login.html";
      if (userDropdownBtn.isConnected) {
        userDropdownBtn.remove();
      }
    }
  });
});