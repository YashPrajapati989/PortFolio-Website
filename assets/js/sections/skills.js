// Module 07: Skills Constellation (HTML Canvas)

function initSkills() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = document.getElementById('skills-canvas-container');
  
  // High DPI Canvas setup
  function resizeCanvas() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    return { width, height };
  }

  let { width, height } = resizeCanvas();

  // Skill Data
  const categories = {
    core: { color: '#E8C97A', size: 6 },     // --color-accent
    supporting: { color: '#7C9EE8', size: 4 }, // --color-accent-2
    familiar: { color: '#888580', size: 2.5 }  // --color-text-muted
  };

  const skillsData = [
    { name: "JavaScript", category: "core", x: 0.5, y: 0.5 },
    { name: "React / Next.js", category: "core", x: 0.3, y: 0.4 },
    { name: "Node.js", category: "core", x: 0.7, y: 0.4 },
    { name: "Python", category: "core", x: 0.5, y: 0.7 },
    
    { name: "HTML/CSS", category: "supporting", x: 0.2, y: 0.6 },
    { name: "Three.js/GSAP", category: "supporting", x: 0.4, y: 0.2 },
    { name: "MongoDB", category: "supporting", x: 0.8, y: 0.6 },
    { name: "Git", category: "supporting", x: 0.6, y: 0.2 },
    
    { name: "UI/UX", category: "familiar", x: 0.1, y: 0.4 },
    { name: "Docker", category: "familiar", x: 0.9, y: 0.4 },
    { name: "AWS", category: "familiar", x: 0.7, y: 0.8 },
    { name: "C++", category: "familiar", x: 0.3, y: 0.8 }
  ];

  // Map relative coordinates to absolute canvas pixels
  let nodes = [];
  function initNodes() {
    nodes = skillsData.map(skill => {
      return {
        ...skill,
        baseX: skill.x * width,
        baseY: skill.y * height,
        currentX: skill.x * width,
        currentY: skill.y * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        targetRadius: categories[skill.category].size,
        currentRadius: 0 // For intro animation
      };
    });
  }

  initNodes();

  // Mouse tracking for interaction
  let mouse = { x: -1000, y: -1000, radius: 150 };
  
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Intro animation triggers on scroll
  let isAnimated = false;
  
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: "#skills",
      start: "top 60%",
      onEnter: () => {
        isAnimated = true;
        gsap.to(nodes, {
          currentRadius: (i, target) => target.targetRadius,
          duration: 1.5,
          stagger: 0.05,
          ease: "elastic.out(1, 0.5)"
        });
      }
    });
  } else {
    isAnimated = true;
    nodes.forEach(n => n.currentRadius = n.targetRadius);
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    
    ctx.clearRect(0, 0, width, height);

    // Update node positions slightly
    nodes.forEach(node => {
      // Gentle floating
      node.currentX += node.vx;
      node.currentY += node.vy;

      // Keep near base position
      const dxDist = node.baseX - node.currentX;
      const dyDist = node.baseY - node.currentY;
      node.currentX += dxDist * 0.01;
      node.currentY += dyDist * 0.01;

      // Mouse repulsion
      const dxM = mouse.x - node.currentX;
      const dyM = mouse.y - node.currentY;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      
      if (distM < mouse.radius) {
        const force = (mouse.radius - distM) / mouse.radius;
        const pushX = (dxM / distM) * force * 5;
        const pushY = (dyM / distM) * force * 5;
        node.currentX -= pushX;
        node.currentY -= pushY;
      }
    });

    // Draw connections (constellation lines)
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].currentX - nodes[j].currentX;
        const dy = nodes[i].currentY - nodes[j].currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) { // Connection threshold
          const opacity = 1 - (dist / 200);
          ctx.strokeStyle = `rgba(42, 42, 42, ${opacity * 0.5})`; // --color-border basically
          ctx.beginPath();
          ctx.moveTo(nodes[i].currentX, nodes[i].currentY);
          ctx.lineTo(nodes[j].currentX, nodes[j].currentY);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    let hoveredNode = null;
    
    nodes.forEach(node => {
      if (node.currentRadius > 0.1) {
        ctx.fillStyle = categories[node.category].color;
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, node.currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Check hover for tooltip
        const dxM = mouse.x - node.currentX;
        const dyM = mouse.y - node.currentY;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        
        // Slightly larger hover area than visually apparent
        if (distM < node.targetRadius + 15) {
          hoveredNode = node;
          // Highlight stroke
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    // Draw Tooltip last so it's on top
    if (hoveredNode) {
      canvas.style.cursor = 'pointer';
      
      const padding = 10;
      ctx.font = '12px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(hoveredNode.name).width;
      
      const tipX = hoveredNode.currentX + 15;
      const tipY = hoveredNode.currentY - 15;
      
      // Tooltip BG
      ctx.fillStyle = 'rgba(10,10,10,0.9)'; // --color-bg
      ctx.strokeStyle = 'rgba(42,42,42,1)'; // --color-border
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.roundRect(tipX, tipY - 16, textWidth + padding * 2, 24, 4);
      ctx.fill();
      ctx.stroke();
      
      // Tooltip Text
      ctx.fillStyle = '#F0EDE8'; // --color-text
      ctx.fillText(hoveredNode.name, tipX + padding, tipY);
    } else {
      canvas.style.cursor = 'crosshair';
    }
  }

  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    let dim = resizeCanvas();
    width = dim.width;
    height = dim.height;
    initNodes(); // Recalculate relative positions
    // instantly grow if already triggered
    if (isAnimated) {
      nodes.forEach(n => n.currentRadius = n.targetRadius);
    }
  });
}

// Export initialization fn
window.animations.initSkills = initSkills;
