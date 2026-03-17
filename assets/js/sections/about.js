// Module 04: Character Sheet (About) Animations

function initAbout() {
  const aboutSection = document.querySelector('.about');
  if (!aboutSection) return;

  const statBars = document.querySelectorAll('.stat-bar');
  
  // Animate stat bars when the section comes into view
  gsap.fromTo(statBars, 
    { width: "0%" }, 
    {
      width: (i, target) => {
        // Look up the desired width from the inline style or data attribute
        return target.style.width; 
      },
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 70%", // Start animation when top of section is 70% down the viewport
        toggleActions: "play none none none"
      }
    }
  );

  // Subtle hover effect for the hex frame
  const hexFrame = document.querySelector('.hex-frame');
  if (hexFrame) {
    hexFrame.addEventListener('mouseenter', () => {
      gsap.to(hexFrame, { scale: 1.05, duration: 0.5, ease: "power2.out" });
    });
    hexFrame.addEventListener('mouseleave', () => {
      gsap.to(hexFrame, { scale: 1, duration: 0.5, ease: "power2.out" });
    });
  }

  // Fade in the lore content panels
  gsap.from('.hud-panel', {
    opacity: 0,
    x: 50,
    duration: 1,
    scrollTrigger: {
        trigger: '.char-bio-col',
        start: "top 80%"
    }
  });

  gsap.from('.char-stats-panel', {
    opacity: 0,
    x: -50,
    duration: 1,
    scrollTrigger: {
        trigger: '.char-portrait-col',
        start: "top 80%"
    }
  });
}

// Export initialization fn
window.animations.initAbout = initAbout;
