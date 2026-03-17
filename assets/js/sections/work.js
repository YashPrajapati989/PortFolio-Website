// Module 05: The Work (Filtering & Modals)

function initWork() {
  // 1. Enter Animation using GSAP ScrollTrigger
  const workItems = document.querySelectorAll('.work-item');
  
  if (workItems.length > 0 && typeof ScrollTrigger !== 'undefined') {
    gsap.to(workItems, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".work-grid",
        start: "top 80%",
      }
    });
  }

  // 2. Filtering Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      // Filter logic with simple GSAP animation
      workItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          gsap.to(item, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            display: "block",
            ease: "power2.out"
          });
        } else {
          gsap.to(item, {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            display: "none",
            ease: "power2.out"
          });
        }
      });
      
      // Need to refresh ScrollTriggers if layout changes significantly
      setTimeout(() => ScrollTrigger.refresh(), 500);
    });
  });

  // 3. Modal Logic
  const modal = document.getElementById('project-modal');
  const closeBtn = document.querySelector('.modal-close');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  
  if (!modal) return;

  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');

  // Open modal
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Prevent the link from jumping the page
      e.preventDefault();
      
      // In a real app, you would fetch case study data based on the data-modal ID here
      // For now, extract title and category from the card itself
      const card = btn.closest('.work-item');
      if (card) {
        modalTitle.textContent = card.querySelector('.work-title').textContent;
        modalCategory.textContent = card.querySelector('.work-category').textContent;
      }
      
      // Open modal and prevent body scroll
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal functions
  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

// Export initialization fn
window.animations.initWork = initWork;
