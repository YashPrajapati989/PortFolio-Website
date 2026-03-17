// Module 04: Origin Story (Horizontal Scroll & Parallax)

function initAbout() {
  const timelineContainer = document.getElementById('timeline-container');
  const timelineWrapper = document.getElementById('timeline-wrapper');
  const progressBar = document.getElementById('timeline-progress');
  
  if (!timelineContainer || !timelineWrapper) return;

  // Calculate the total scroll distance (width of wrapper minus viewport width)
  const getScrollAmount = () => {
    let wrapperWidth = timelineWrapper.scrollWidth;
    return -(wrapperWidth - window.innerWidth);
  };

  // 1. Horizontal Scroll Tween
  const tween = gsap.to(timelineWrapper, {
    x: getScrollAmount,
    ease: "none"
  });

  // Create ScrollTrigger to pin the container and scrub the animation
  ScrollTrigger.create({
    trigger: timelineContainer,
    start: "top top",
    end: () => `+=${getScrollAmount() * -1}`, // Scroll for the length of the wrapper
    pin: true,
    animation: tween,
    scrub: 1, // Smooth scrubbing
    invalidateOnRefresh: true, // Recalculate values on resize
    onUpdate: (self) => {
      // Update progress bar
      if (progressBar) {
        gsap.set(progressBar, { width: `${self.progress * 100}%` });
      }
    }
  });

  // 2. Parallax effects on images inside the horizontal scroll
  const items = document.querySelectorAll('.timeline-item');
  
  items.forEach(item => {
    const img = item.querySelector('.parallax-img');
    if (!img) return;
    
    // As the container scrolls horizontally, move the image slightly in the opposite direction
    // We attach this to the same scroll trigger progress by using a container query
    gsap.to(img, {
      xPercent: 15, // Move image 15% right as it scrolls left
      ease: "none",
      scrollTrigger: {
        trigger: item,
        containerAnimation: tween, // Critical: this ties it to the horizontal scroll timeline
        start: "left right", // When left edge of item hits right edge of viewport
        end: "right left",   // When right edge of item hits left edge of viewport
        scrub: true
      }
    });
  });
}

// Export initialization fn
window.animations.initAbout = initAbout;
