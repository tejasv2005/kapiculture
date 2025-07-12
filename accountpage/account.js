// Initialize Firebase services
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

// Tab Navigation
document.querySelectorAll('.sidebar li').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sidebar li').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
  });
});

// Check authentication state
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "../LoginPage/login.html";
    return;
  }

  try {
    // Load user data from Firestore
    const userDoc = await db.collection("users").doc(user.uid).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      
      // Update profile display
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
    Swal.fire('Error', 'Failed to load account data', 'error');
  }
});

// Profile Image Upload
profileUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  if (!user) return;

  try {
    Swal.fire({
      title: 'Uploading image...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
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
    const swal = Swal.fire({
      title: 'Saving changes...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
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
    window.location.href = "../LoginPage/login.html";
  }).catch((error) => {
    console.error("Logout error:", error);
    Swal.fire('Error', 'Failed to logout', 'error');
  });
});