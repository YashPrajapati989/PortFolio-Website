// Main initialization logic
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized');
  // Initialize GSAP plugins if needed
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initNavigation();
  
  if (typeof window.animations.initHero === 'function') {
    window.animations.initHero();
  }

  if (typeof window.animations.initAbout === 'function') {
    window.animations.initAbout();
  }

  if (typeof window.animations.initWork === 'function') {
    window.animations.initWork();
  }

  if (typeof window.animations.initProcess === 'function') {
    window.animations.initProcess();
  }
});

function initNavigation() {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  let lastScroll = 0;
  let isMobileMenuOpen = false;

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    isMobileMenuOpen = !isMobileMenuOpen;
    hamburger.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-active');
    
    // Prevent scrolling when menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  });

  // Close mobile menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      isMobileMenuOpen = false;
      hamburger.classList.remove('is-active');
      mobileMenu.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });

  // Scroll behavior
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add background when scrolled down
    if (currentScroll > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    
    // Hide header on scroll down, show on scroll up (only if menu is closed)
    if (!isMobileMenuOpen) {
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.classList.add('is-hidden');
      } else {
        // Scrolling up
        header.classList.remove('is-hidden');
      }
    }
    
    lastScroll = currentScroll;
  });
}
