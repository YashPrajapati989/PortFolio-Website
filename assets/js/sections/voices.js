// Module 09: Voices (Testimonials Marquee)

function initVoices() {
  const track = document.getElementById('marquee-track');
  if (!track) return;

  // Clone the contents of the track to create a seamless loop
  // The original has 3 items. Cloning it once is usually enough for a screen, 
  // but if the screen is super wide, we might need more. We'll do a simple duplication.
  
  const content = track.innerHTML;
  track.innerHTML = content + content; // Duplicate once
  
  // To make it truly infinite without jumping, we can use JS to scroll 
  // or rely entirely on CSS animation (which we did in voices.css).
  // The CSS animation translates from 0 to -50%.
  // By duplicating the content, the first 50% is identical to the second 50%.
  // So when it hits -50%, it seamlessly jumps back to 0.

  // Optional: add GSAP scroll interaction to fade it in or parallax the section
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.from(".voices", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".voices",
        start: "top 80%"
      }
    });
  }
}

// Export initialization fn
window.animations.initVoices = initVoices;
