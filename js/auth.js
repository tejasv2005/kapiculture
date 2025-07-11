import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// 🔐 Firebase Config
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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginElement = document.querySelector(".login a");

  // ⛔ Don't proceed if navbar missing
  if (!loginElement) return;

  // User button element
  let userDropdownBtn = document.querySelector(".user-dropdown-btn");
  if (!userDropdownBtn) {
    userDropdownBtn = document.createElement("button");
    userDropdownBtn.className = "user-dropdown-btn";
    userDropdownBtn.style.marginLeft = "15px";
    userDropdownBtn.style.background = "#f0e9de";
    userDropdownBtn.style.border = "none";
    userDropdownBtn.style.cursor = "pointer";
    userDropdownBtn.style.fontWeight = "bold";
    userDropdownBtn.style.fontSize = "1rem";
    userDropdownBtn.style.color = "#3e2c29";
    userDropdownBtn.style.padding = "6px 10px";
    userDropdownBtn.style.borderRadius = "8px";
    userDropdownBtn.style.transition = "all 0.2s ease";
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      let username = user.email.split("@")[0];
      let profileImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // default

      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.username) username = data.username;
          if (data.profileImage) profileImage = data.profileImage;
        }
      } catch (err) {
        console.warn("⚠️ Failed to fetch user data:", err);
      }

      loginElement.textContent = "Logout";
      loginElement.href = "#";

      // Show username button
      userDropdownBtn.innerHTML = `<img src="${profileImage}" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 6px; vertical-align: middle;"> ${username}`;
      if (!userDropdownBtn.isConnected) {
        loginElement.parentElement?.appendChild(userDropdownBtn);
      }

      // Welcome Toast once
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
        });
        sessionStorage.setItem("welcomed", "true");
      }

      // Redirect to account page
      userDropdownBtn.onclick = () => {
        window.location.href = "/accountpage/account.html";
      };

      // Logout
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
          background: "#f0e9de",
          color: "#3e2c29"
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
                  color: "#3e2c29"
                }).then(() => {
                  window.location.href = "./LoginPage/login.html";
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Oops!",
                  text: error.message,
                  background: "#f0e9de",
                  color: "#3e2c29"
                });
              });
          }
        });
      });

    } else {
      loginElement.textContent = "Login";
      loginElement.href = "./LoginPage/login.html";
      if (userDropdownBtn.isConnected) {
        userDropdownBtn.remove();
      }
    }
  });
});