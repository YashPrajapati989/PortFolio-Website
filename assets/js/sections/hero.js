// Three.js Particle System & Hero Animations

function initHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // 1. Three.js Background
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 700;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    // Spread in a large area
    posArray[i] = (Math.random() - 0.5) * 100;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Particle Material (warm accent color)
  const material = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xE8C97A, 
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, material);
  scene.add(particlesMesh);

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Slowly rotate the entire particle system
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Slight parallax effect based on mouse hover
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // 2. GSAP Animations for Hero Content
  animateHeroText();
}

function animateHeroText() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Prepare text for animation (wrap lines inside spans)
  const lines = document.querySelectorAll('.title-line');
  lines.forEach(line => {
    const text = line.innerText;
    line.innerHTML = `<span>${text}</span>`;
  });

  // Animation sequence
  tl.to('.hero-label', {
    y: 0,
    opacity: 1,
    duration: 1,
    delay: 0.2
  })
  .fromTo('.title-line span', {
    y: 100,
    skewY: 7
  }, {
    y: 0,
    skewY: 0,
    duration: 1.2,
    stagger: 0.15
  }, '-=0.5')
  .to('.scroll-indicator', {
    opacity: 1,
    duration: 1
  }, '-=0.5');

  // 3. Typewriter effect for tagline
  setTimeout(() => {
    typeWriter("Full Stack Developer driven by storytelling.", "hero-typewriter");
  }, 1500);
}

// Simple typewriter utility
function typeWriter(text, elementId, speed = 40) {
  let i = 0;
  const element = document.getElementById(elementId);
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Export initialization fn
window.animations.initHero = initHero;
