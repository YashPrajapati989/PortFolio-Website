// Module 07: Skills Constellation (HTML Canvas) - Sci-Fi HUD

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

  // Skill Data - HUD Categories
  const categories = {
    core: { color: '#00F0FF', size: 6, pulse: true },        // Neon Cyan
    supporting: { color: '#FF003C', size: 4, pulse: false }, // Neon Magenta
    familiar: { color: '#00FF41', size: 2.5, pulse: false }  // Terminal Green
  };

  const skillsData = [
    { name: "SYS::AI_Video_Pipeline", category: "core", x: 0.5, y: 0.5 },
    { name: "SYS::Node_Backend", category: "core", x: 0.3, y: 0.4 },
    { name: "LANG::Python", category: "core", x: 0.7, y: 0.4 },
    { name: "MOD::TTS_SSML", category: "core", x: 0.5, y: 0.7 },
    
    { name: "MOD::Audio_Demucs", category: "supporting", x: 0.2, y: 0.6 },
    { name: "UI::React_Frontend", category: "supporting", x: 0.4, y: 0.2 },
    { name: "DB::Migrations", category: "supporting", x: 0.8, y: 0.6 },
    { name: "SYS::Architecture", category: "supporting", x: 0.6, y: 0.2 },
    
    { name: "UI::Custom_Video_Player", category: "familiar", x: 0.1, y: 0.4 },
    { name: "ENV::Docker", category: "familiar", x: 0.9, y: 0.4 },
    { name: "API::Gemini_Integration", category: "familiar", x: 0.7, y: 0.8 },
    { name: "LANG::C++", category: "familiar", x: 0.3, y: 0.8 }
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
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        targetRadius: categories[skill.category].size,
        currentRadius: 0, // For intro animation
        pulsePhase: Math.random() * Math.PI * 2
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
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.05;
    
    ctx.clearRect(0, 0, width, height);

    // Update node positions slightly
    nodes.forEach(node => {
      // Gentle floating
      node.currentX += node.vx;
      node.currentY += node.vy;

      // Keep near base position
      const dxDist = node.baseX - node.currentX;
      const dyDist = node.baseY - node.currentY;
      node.currentX += dxDist * 0.02;
      node.currentY += dyDist * 0.02;

      // Mouse repulsion - stronger for HUD
      const dxM = mouse.x - node.currentX;
      const dyM = mouse.y - node.currentY;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      
      if (distM < mouse.radius) {
        const force = (mouse.radius - distM) / mouse.radius;
        const pushX = (dxM / distM) * force * 8;
        const pushY = (dyM / distM) * force * 8;
        node.currentX -= pushX;
        node.currentY -= pushY;
      }
    });

    // Draw connections (circuit board style)
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].currentX - nodes[j].currentX;
        const dy = nodes[i].currentY - nodes[j].currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) { // Connection threshold
          const opacity = 1 - (dist / 180);
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.3})`;
          
          ctx.beginPath();
          // Draw stepped lines for circuit look
          ctx.moveTo(nodes[i].currentX, nodes[i].currentY);
          
          if (Math.abs(dx) > Math.abs(dy)) {
            ctx.lineTo(nodes[i].currentX - dx/2, nodes[i].currentY);
            ctx.lineTo(nodes[i].currentX - dx/2, nodes[j].currentY);
          } else {
            ctx.lineTo(nodes[i].currentX, nodes[i].currentY - dy/2);
            ctx.lineTo(nodes[j].currentX, nodes[i].currentY - dy/2);
          }
          
          ctx.lineTo(nodes[j].currentX, nodes[j].currentY);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    let hoveredNode = null;
    
    nodes.forEach(node => {
      if (node.currentRadius > 0.1) {
        const cat = categories[node.category];
        ctx.fillStyle = cat.color;
        
        let drawRadius = node.currentRadius;
        if (cat.pulse) {
          drawRadius += Math.sin(time + node.pulsePhase) * 1.5;
        }

        ctx.beginPath();
        // Square nodes for HUD style
        ctx.rect(node.currentX - drawRadius, node.currentY - drawRadius, drawRadius * 2, drawRadius * 2);
        ctx.fill();

        // Check hover for tooltip
        const dxM = mouse.x - node.currentX;
        const dyM = mouse.y - node.currentY;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        
        // Slightly larger hover area than visually apparent
        if (distM < node.targetRadius + 15) {
          hoveredNode = node;
          // Highlight stroke
          ctx.strokeStyle = cat.color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(node.currentX - drawRadius - 3, node.currentY - drawRadius - 3, drawRadius * 2 + 6, drawRadius * 2 + 6);
        }
      }
    });

    // Draw Tooltip last so it's on top
    if (hoveredNode) {
      canvas.style.cursor = 'crosshair';
      
      const padding = 12;
      ctx.font = '12px "Share Tech Mono", monospace';
      const textWidth = ctx.measureText(hoveredNode.name).width;
      
      const tipX = hoveredNode.currentX + 20;
      const tipY = hoveredNode.currentY - 20;
      
      // Tooltip BG - HUD Panel
      ctx.fillStyle = 'rgba(5, 5, 16, 0.9)'; // Dark void
      ctx.strokeStyle = categories[hoveredNode.category].color;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      // Clip-path shaped tooltip
      ctx.moveTo(tipX, tipY - 20);
      ctx.lineTo(tipX + textWidth + padding * 2, tipY - 20);
      ctx.lineTo(tipX + textWidth + padding * 2, tipY + 4);
      ctx.lineTo(tipX + textWidth + padding * 2 - 8, tipY + 12);
      ctx.lineTo(tipX, tipY + 12);
      ctx.closePath();
      
      ctx.fill();
      ctx.stroke();
      
      // Tooltip Text
      ctx.fillStyle = '#E0FFFF'; // --color-text
      ctx.fillText(hoveredNode.name, tipX + padding, tipY - 1);
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
