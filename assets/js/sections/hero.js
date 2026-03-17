// Three.js Particle System (Dark Fantasy Theme) & Hero Animations

function initHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Starfield (Static background)
  const starQty = 1500;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starQty * 3);
  for (let i = 0; i < starQty * 3; i++) {
    starPos[i] = (Math.random() - 0.5) * 200;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xFFD700, // Gold
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  const starMesh = new THREE.Points(starGeo, starMat);
  scene.add(starMesh);

  // 2. Rising Embers (Drifting upwards)
  const emberQty = 100;
  const emberGeo = new THREE.BufferGeometry();
  const emberPos = new Float32Array(emberQty * 3);
  const emberVel = new Float32Array(emberQty);

  for (let i = 0; i < emberQty; i++) {
    emberPos[i * 3] = (Math.random() - 0.5) * 80;     // x
    emberPos[i * 3 + 1] = (Math.random() - 0.5) * 80; // y
    emberPos[i * 3 + 2] = (Math.random() - 0.5) * 40; // z
    emberVel[i] = 0.05 + Math.random() * 0.1;         // upward velocity
  }
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
  
  // Custom Shader or Texture for Embers would be better, but use Points with colors for now
  const emberMat = new THREE.PointsMaterial({
    size: 0.3,
    color: 0xCC1A1A, // Crimson/Molten Amber
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const emberMesh = new THREE.Points(emberGeo, emberMat);
  scene.add(emberMesh);

  // Mouse Interactivity
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.05;
    mouseY = (e.clientY - windowHalfY) * 0.05;
    
    // 3D Tilt for the Hero Title
    const titleBox = document.getElementById('hero-reveal-box');
    if (titleBox) {
        const tiltX = (e.clientY / window.innerHeight - 0.5) * 15;
        const tiltY = (e.clientX / window.innerWidth - 0.5) * -15;
        gsap.to(titleBox, {
            rotateX: tiltX,
            rotateY: tiltY,
            duration: 1,
            ease: "power2.out"
        });
    }
  });

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    starMesh.rotation.y += 0.0005;
    starMesh.rotation.x += 0.0002;

    // Animate Embers rising
    const positions = emberGeo.attributes.position.array;
    for (let i = 0; i < emberQty; i++) {
        positions[i * 3 + 1] += emberVel[i];
        if (positions[i * 3 + 1] > 40) {
            positions[i * 3 + 1] = -40;
        }
    }
    emberGeo.attributes.position.needsUpdate = true;
    emberMesh.rotation.y += 0.001;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animateHeroText();
}

function animateHeroText() {
  const tl = gsap.timeline();

  // Reset states
  gsap.set('.title-line', { opacity: 0, y: 50 });
  gsap.set('.hero-cta', { opacity: 0, scale: 0.8 });

  tl.to('.title-line', {
    opacity: 1,
    y: 0,
    duration: 1.5,
    stagger: 0.3,
    ease: "power4.out",
    onComplete: () => {
        document.getElementById('main-title').classList.add('glow-pulse');
    }
  })
  .to('.hero-cta', {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "back.out(1.7)"
  }, "-=0.5");

  setTimeout(() => {
    typeWriter("Data Analyst \u00b7 AI Application Developer \u00b7 ML Engineer", "hero-typewriter", 60);
  }, 1000);
}

function typeWriter(text, elementId, speed = 40) {
  let i = 0;
  const element = document.getElementById(elementId);
  if (!element) return;
  element.innerHTML = "";
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

window.animations.initHero = initHero;
