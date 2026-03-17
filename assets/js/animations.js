// GSAP and other global animation setups
window.animations = {
    init: function() {
        this.initCursor();
    },

    initCursor: function() {
        const cursor = document.getElementById('custom-cursor');
        const dot = document.getElementById('custom-cursor-dot');
        const glow = document.getElementById('custom-cursor-glow');
        
        if (!cursor || !dot || !glow) return;

        window.addEventListener('mousemove', (e) => {
            // Main rotating frame with slight lag
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power2.out"
            });
            // Central dot moves instantly
            gsap.to(dot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.05,
                ease: "power1.out"
            });
            // Glow follows with more lag
            gsap.to(glow, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        // Hover effect for interactive elements
        const interactives = document.querySelectorAll('a, button, .work-item, .filter-btn, .ability-item');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { 
                    scale: 1.5, 
                    borderColor: 'var(--color-accent)',
                    borderWidth: '2px', 
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                gsap.to(dot, { scale: 2, backgroundColor: 'var(--color-accent-2)', duration: 0.2 });
                gsap.to(glow, { scale: 1.5, opacity: 0.3, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { 
                    scale: 1, 
                    borderColor: 'var(--color-accent-2)',
                    borderWidth: '1px', 
                    duration: 0.3 
                });
                gsap.to(dot, { scale: 1, backgroundColor: 'var(--color-accent)', duration: 0.2 });
                gsap.to(glow, { scale: 1, opacity: 1, duration: 0.3 });
            });
        });
    },

    initPreloader: function(callback) {
        const preloader = document.getElementById('preloader');
        const bar = preloader.querySelector('.preloader-bar');
        const text = document.getElementById('loader-text');
        const percent = preloader.querySelector('.preloader-percentage');
        
        const loadingText = "INITIALIZING DATA ENGINE...";
        let currentText = "";
        let charIndex = 0;

        // Typewriter effect for loader text
        const typeInterval = setInterval(() => {
            currentText += loadingText[charIndex];
            text.textContent = currentText;
            charIndex++;
            if (charIndex >= loadingText.length) clearInterval(typeInterval);
        }, 100);

        // Progress bar animation
        let progress = 0;
        const loadInterval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadInterval);
                
                // Finalize and reveal
                setTimeout(() => {
                    preloader.classList.add('is-hidden');
                    document.body.classList.add('flicker-reveal');
                    document.body.style.overflowY = 'auto';
                    if (callback) callback();
                }, 800);
            }
            bar.style.width = `${progress}%`;
            percent.textContent = `${Math.floor(progress)}%`;
        }, 150);
    }
};
