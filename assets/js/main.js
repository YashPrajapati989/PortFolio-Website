// Main initialization logic
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized');
  // Initialize GSAP plugins if needed
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
});
