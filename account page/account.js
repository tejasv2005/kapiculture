// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCy4DBVOl9-28ZNdKLF42p6D-ECvkzP88g",
  authDomain: "kapikulture.firebaseapp.com",
  projectId: "kapikulture",
  storageBucket: "kapikulture.appspot.com",
  messagingSenderId: "1066051890850",
  appId: "1:1066051890850:web:43db9d0e101eced86c31fb",
  measurementId: "G-YJPB76S6D7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const profileImg = document.getElementById('profile-img');
const profileUpload = document.getElementById('profile-upload');
const usernameDisplay = document.getElementById('username-display');
const usernameNav = document.getElementById('username-nav');
const logoutBtn = document.getElementById('logout-btn');
const profileForm = document.getElementById('profile-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

// Check Authentication State
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = '/login.html';
    return;
  }
  
  console.log("User authenticated:", user.uid);
  
  try {
    // Load user data from Firestore
    const userDoc = await db.collection("users").doc(user.uid).get();
    
    if (userDoc.exists) {
      console.log("User document data:", userDoc.data());
      const userData = userDoc.data();
      
      // Update UI with user data
      usernameDisplay.textContent = userData.username || user.email.split('@')[0];
      usernameNav.textContent = userData.username || user.email.split('@')[0];
      usernameInput.value = userData.username || '';
      emailInput.value = user.email;
      phoneInput.value = userData.phone || '';
      
      // Load profile image if exists
      if (userData.profileImageUrl) {
        profileImg.src = userData.profileImageUrl;
      }
    } else {
      console.log("No user document found, creating one...");
      // Create user document if it doesn't exist
      await db.collection("users").doc(user.uid).set({
        username: user.email.split('@')[0],
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Reload data after creation
      loadUserData(user.uid);
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load user data',
      footer: error.message
    });
  }
});

// Profile Image Upload
profileUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  if (!user) return;

  try {
    // Show loading state
    Swal.fire({
      title: 'Uploading image...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Upload to Firebase Storage
    const storageRef = storage.ref(`profile_images/${user.uid}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
      null,
      (error) => {
        Swal.fire('Error', 'Failed to upload image', 'error');
        console.error("Upload error:", error);
      },
      async () => {
        // Get download URL
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        
        // Update Firestore
        await db.collection("users").doc(user.uid).update({
          profileImageUrl: downloadURL
        });
        
        // Update UI
        profileImg.src = downloadURL;
        Swal.fire('Success', 'Profile image updated!', 'success');
      }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    Swal.fire('Error', 'Failed to upload image', 'error');
  }
});

// Profile Form Submission
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const user = auth.currentUser;
  if (!user) return;

  try {
    // Show loading state
    const swal = Swal.fire({
      title: 'Saving changes...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Update Firestore
    await db.collection("users").doc(user.uid).update({
      username: usernameInput.value,
      phone: phoneInput.value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Update UI
    usernameDisplay.textContent = usernameInput.value;
    usernameNav.textContent = usernameInput.value;

    await swal.close();
    Swal.fire('Success', 'Profile updated successfully!', 'success');
  } catch (error) {
    console.error("Error updating profile:", error);
    Swal.fire('Error', 'Failed to update profile', 'error');
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = '/login.html';
  }).catch((error) => {
    console.error("Logout error:", error);
    Swal.fire('Error', 'Failed to logout', 'error');
  });
});