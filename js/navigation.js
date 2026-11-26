document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.header__nav-toggle');
  const headerNav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__nav-link');

  navToggle.addEventListener('click', function() {
    headerNav.classList.toggle('header__nav--active');
    navToggle.classList.toggle('header__nav-toggle--active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href.startsWith('#')) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');

          headerNav.classList.remove('header__nav--active');
          navToggle.classList.remove('header__nav-toggle--active');

          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 100 && window.pageYOffset < sectionTop + sectionHeight - 100) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection === '') {
      currentSection = 'home';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  });
});