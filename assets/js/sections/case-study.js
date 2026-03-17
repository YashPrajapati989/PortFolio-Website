// Module 08: Featured Case Study (Sticky Scrollytelling)

function initCaseStudy() {
  const sections = document.querySelectorAll('.cs-section');
  const visuals = document.querySelectorAll('.cs-img');
  
  if (sections.length === 0 || visuals.length === 0 || typeof ScrollTrigger === 'undefined') return;

  // Use ScrollTrigger to detect which narrative section is currently in view
  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 60%", // When the section reaches 60% down the viewport
      end: "bottom 60%", // Until it leaves the 60% mark
      toggleClass: "is-active",
      onEnter: () => updateVisual(index),
      onEnterBack: () => updateVisual(index),
    });
  });

  function updateVisual(activeIndex) {
    // Hide all visuals
    visuals.forEach(v => {
      v.classList.remove('is-active');
      // subtle scale down for inactive
      gsap.to(v, { scale: 1.05, duration: 0.8, ease: "power2.out" });
    });
    
    // Show active visual
    if (visuals[activeIndex]) {
      visuals[activeIndex].classList.add('is-active');
      // subtle scale up for active
      gsap.fromTo(visuals[activeIndex], 
        { scale: 1.1 }, 
        { scale: 1, duration: 1.2, ease: "power2.out" }
      );
    }
  }
}

// Export initialization fn
window.animations.initCaseStudy = initCaseStudy;
