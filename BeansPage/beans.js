// NAVBAR MENU TOGGLE FOR MOBILE
const menuToggle = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".navbar ul");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// QUANTITY BUTTONS
const increaseButtons = document.querySelectorAll(".increase");
const decreaseButtons = document.querySelectorAll(".decrease");
const cartCount = document.getElementById("cart-count");

increaseButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const quantityElement = btn.previousElementSibling;
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
    updateCartCount();
  });
});

decreaseButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const quantityElement = btn.nextElementSibling;
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 0) {
      quantity--;
      quantityElement.textContent = quantity;
      updateCartCount();
    }
  });
});

// UPDATE STASH COUNT
function updateCartCount() {
  let total = 0;
  document.querySelectorAll(".quantity").forEach((qty) => {
    total += parseInt(qty.textContent);
  });
  cartCount.textContent = total;
}

// CLEAR FILTERS FUNCTIONALITY
const clearBtn = document.querySelector(".clear-filters");
clearBtn.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(".filters input[type='checkbox']");
  checkboxes.forEach((box) => (box.checked = false));
});

// CART PREVIEW AUTO-HIDE ON MOBILE TAP
document.addEventListener("click", function (event) {
  const stashIcon = document.querySelector(".stash-icon");
  const preview = document.getElementById("cart-preview");
  if (!stashIcon.contains(event.target)) {
    preview.style.display = "none";
  }
});