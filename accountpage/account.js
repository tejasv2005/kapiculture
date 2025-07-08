import { getAuth, onAuthStateChanged, updateProfile, deleteUser } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const auth = getAuth();

  const usernameDisplay = document.getElementById("usernameText");
  const editBtn = document.getElementById("editUsernameBtn");
  const usernameInput = document.getElementById("usernameInput");
  const saveBtn = document.getElementById("saveUsernameBtn");
  const deleteBtn = document.getElementById("deleteAccountBtn");

  const sidebarItems = document.querySelectorAll(".sidebar li");
  const contentArea = document.querySelector(".content");

  function loadSection(section) {
    contentArea.innerHTML = `<h2>${section}</h2><p>Content for "${section}" goes here.</p>`;
  }

  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      sidebarItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      loadSection(item.textContent);
    });
  });

  onAuthStateChanged(auth, user => {
    if (user) {
      usernameDisplay.textContent = user.displayName || user.email.split('@')[0];
      usernameInput.value = user.displayName || "";

      editBtn.addEventListener("click", () => {
        usernameDisplay.style.display = "none";
        usernameInput.style.display = "inline-block";
        saveBtn.style.display = "inline-block";
      });

      saveBtn.addEventListener("click", () => {
        const newUsername = usernameInput.value.trim();
        if (newUsername.length > 2) {
          updateProfile(user, { displayName: newUsername }).then(() => {
            usernameDisplay.textContent = newUsername;
            usernameDisplay.style.display = "inline-block";
            usernameInput.style.display = "none";
            saveBtn.style.display = "none";
            Swal.fire("Updated!", "Your username has been updated.", "success");
          }).catch(err => {
            Swal.fire("Error", err.message, "error");
          });
        }
      });

      // Real delete handler
      deleteBtn.addEventListener("click", () => {
        Swal.fire({
          title: "Are you sure?",
          text: "Deleting your account is irreversible.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Delete",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#d33",
          background: "#f5f0e6",
          color: "#3e2c29"
        }).then(result => {
          if (result.isConfirmed) {
            deleteUser(user).then(() => {
              Swal.fire("Deleted", "Your account has been removed.", "success").then(() => {
                window.location.href = "/";
              });
            }).catch(err => {
              Swal.fire(
                "Could not delete account",
                `Reason: ${err.message}\n\nPlease contact us at: contact.kapiculture@gmail.com`,
                "info"
              );
            });
          }
        });
      });

      // Milestone Progress (dummy: 4 of 7)
      const milestoneBar = document.querySelector(".milestone-progress");
      const milestoneText = document.querySelector(".milestone-text");
      const completed = 4;
      const total = 7;
      const percent = Math.floor((completed / total) * 100);
      milestoneBar.style.width = `${percent}%`;
      milestoneText.textContent = `${completed} of ${total} orders completed`;

    } else {
      Swal.fire({
        title: "Not logged in",
        text: "Please login to access your account.",
        icon: "info",
        confirmButtonText: "Login",
        background: "#f5f0e6",
        color: "#3e2c29"
      }).then(() => {
        window.location.href = "/LoginPage/login.html";
      });
    }
  });
});