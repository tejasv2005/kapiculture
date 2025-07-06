// Updated Homepage JavaScript with Gen Z Micro-Interactions & Mobile Optimization

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.navbar nav ul');
  const logo = document.getElementById('kapicultureLogo');
  const searchBar = document.querySelector('.search-bar');
  const suggestionsList = document.querySelector('.suggestions-list');

  const categories = [
    { label: 'Ground Coffee', url: '../GroundCoffeePage/ground.html' },
    { label: 'Coffee Beans', url: '../BeansPage/beans.html' },
    { label: 'Accessories', url: '#' },
    { label: 'Tools & Machines', url: '#' },
    { label: 'Kapico Brew', url: '../GroundCoffeePage/ground.html' },
    { label: 'BeanScape', url: '../BeansPage/beans.html' },
    { label: 'French Press', url: '#' },
    { label: 'Cold Brew', url: '#' }
  ];

  // Toggle Mobile Nav
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });

  // Logo Click: Scroll to Top
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Show Suggestions List
  searchBar.addEventListener('input', () => {
    const query = searchBar.value.trim().toLowerCase();
    suggestionsList.innerHTML = '';

    if (query.length === 0) return;

    const filtered = categories.filter(cat =>
      cat.label.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Nada. Try something else? 🧐';
      li.classList.add('no-result');
      suggestionsList.appendChild(li);
      return;
    }

    filtered.forEach(cat => {
      const li = document.createElement('li');
      li.textContent = cat.label;
      li.tabIndex = 0;
      li.addEventListener('click', () => {
        window.location.href = cat.url;
      });
      li.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          window.location.href = cat.url;
        }
      });
      suggestionsList.appendChild(li);
    });
  });

  // Click Outside Search to Close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      suggestionsList.innerHTML = '';
    }
  });

  // Micro-interaction: Ripple Effect
  document.querySelectorAll('.btn, .category-card').forEach((el) => {
    el.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${e.offsetX}px`;
      ripple.style.top = `${e.offsetY}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Dark Mode Toggle
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });

    // Set initial theme from storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }
  }

  // Brew Quiz Button Handler (Placeholder)
  const quizBtn = document.getElementById('brewQuizBtn');
  if (quizBtn) {
    quizBtn.addEventListener('click', () => {
      Swal.fire({
        title: 'Coming Soon! 🎉',
        text: 'Discover your brew personality ☕️ Stay tuned!',
        icon: 'info',
        customClass: 'swal2-popup-custom'
      });
    });
  }
});