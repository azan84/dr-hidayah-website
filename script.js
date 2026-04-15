// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Mobile nav toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Active nav link highlighting (multi-page) ──
(function highlightCurrentPage() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': 'Home',
    'academics.html': 'Academics',
    'students.html': 'Students',
    'blog.html': 'Blog',
    'blog-saf-microalgae.html': 'Blog',
    'personal.html': 'Personal',
  };
  const label = map[page];
  if (!label) return;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.textContent.trim() === label) a.classList.add('active');
  });
})();

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
}

// ── Contact form handler ──
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Message Sent!';
  btn.style.background = 'linear-gradient(145deg, #D4A853, #c49a45)';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    e.target.reset();
  }, 2500);
}

// ── Course resource toggle ──
function toggleResources(btn) {
  const list = btn.previousElementSibling;
  if (!list) return;
  const collapsed = list.classList.toggle('collapsed');
  btn.textContent = collapsed ? 'Show all resources' : 'Show fewer';
}
