// Module 06: The Process (Scroll Animations)

function initProcess() {
  const steps = document.querySelectorAll('.process-step');
  
  if (steps.length === 0 || typeof ScrollTrigger === 'undefined') return;

  // Animate steps coming in
  gsap.to(steps, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".process-timeline",
      start: "top 70%"
    }
  });

  // Highlight steps as they reach the center of the screen
  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 50%", // When top of step hits middle of viewport
      end: "bottom 50%", // When bottom of step hits middle of viewport
      toggleClass: "is-active", // Adds/removes this class automatically
      // markers: true // helpful for debugging
    });
  });
  
  // Optional: Animate the vertical line drawing down
  const line = document.querySelector('.process-line');
  if (line) {
    gsap.fromTo(line, 
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".process-timeline",
          start: "top 50%",
          end: "bottom 50%",
          scrub: true
        }
      }
    );
  }
}

// Export initialization fn
window.animations.initProcess = initProcess;
