// Module 10: Let's Connect (Footer)

function initFooter() {
  // Set current year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Handle contact form submission (Conceptual)
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      // Basic validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      // Simulate API call
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Fake delay
      setTimeout(() => {
        // In a real app, this is where you'd send data via fetch/axios
        // to a backend service like Formspree, Netlify Forms, or your own API.
        console.log('Form data:', { name, email, message });
        
        showStatus('Message sent successfully! I will get back to you soon.', 'success');
        form.reset();
        
        btn.textContent = originalText;
        btn.disabled = false;
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          statusEl.textContent = '';
          statusEl.className = 'form-status text-xs';
        }, 5000);
      }, 1500);
    });
  }

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `form-status text-xs ${type}`;
  }

  // Animation
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.from(".footer-info > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".footer",
        start: "top 80%"
      }
    });

    gsap.from(".footer-form-wrapper", {
      x: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".footer",
        start: "top 80%"
      }
    });
  }
}

// Export initialization fn
window.animations.initFooter = initFooter;
