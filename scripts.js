document.addEventListener('DOMContentLoaded', () => {
  const fadeIns = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeIns.forEach(element => observer.observe(element));

  const scrollToTopBtn = document.getElementById('scrollToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const sections = document.querySelectorAll('section, header.hero-section');
  const updateActiveLink = () => {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id') || 'hero';
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentSection || (currentSection === 'hero' && link.getAttribute('href') === '#')) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
});

function submitForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  if (name && email && message) {
    alert('Form submitted! (This is a placeholder. Add actual form handling logic.)');
    document.getElementById('contact-form').reset();
  } else {
    alert('Please fill in all fields.');
  }
}