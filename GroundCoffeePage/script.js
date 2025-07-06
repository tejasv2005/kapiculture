// script.js

document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"][data-filter]');
  const clearButton = document.querySelector(".clear-filters");
  const productCards = document.querySelectorAll(".product-card");
  const searchInput = document.getElementById("search-input");
  const plusButtons = document.querySelectorAll(".qty-btn.plus");
  const minusButtons = document.querySelectorAll(".qty-btn.minus");

  // Update quantity
  plusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const number = btn.previousElementSibling;
      number.textContent = parseInt(number.textContent) + 1;
    });
  });

  minusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const number = btn.nextElementSibling;
      const newVal = parseInt(number.textContent) - 1;
      number.textContent = newVal >= 0 ? newVal : 0;
    });
  });

  // Filtering logic
  checkboxes.forEach(box => box.addEventListener("change", filterProducts));
  clearButton.addEventListener("click", () => {
    checkboxes.forEach(box => (box.checked = false));
    searchInput.value = "";
    filterProducts();
  });

  searchInput.addEventListener("input", filterProducts);

  function filterProducts() {
    const activeFilters = {
      roast: getFilterValues("roast"),
      preference: getFilterValues("preference"),
      flavour: getFilterValues("flavour"),
      equipment: getFilterValues("equipment"),
      price: getFilterValues("price"),
    };

    const searchTerm = searchInput.value.trim().toLowerCase();

    productCards.forEach(card => {
      const matchesSearch = card.textContent.toLowerCase().includes(searchTerm);
      const matchesFilters = Object.keys(activeFilters).every(filterKey => {
        const filterValues = activeFilters[filterKey];
        return (
          filterValues.length === 0 ||
          filterValues.includes(card.dataset[filterKey])
        );
      });

      if (matchesSearch && matchesFilters) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  function getFilterValues(type) {
    return Array.from(
      document.querySelectorAll(`input[data-filter="${type}"]:checked`)
    ).map(input => input.value);
  }

  // Add click message for under-progress links
  document.querySelectorAll('.under-progress').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert("This section is under progress. Stay tuned!");
    });
  });
});