Boat cursor:

### 1. CSS (Beautiful Water Gradient)

```css
* {
  cursor: none !important; 
}

body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /* The new gradient gives a gorgeous deep-water feel */
  background: radial-gradient(circle at 30% 20%, #1d7ddc 0%, #0b4c9a 35%, #083b77 100%);
}

canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

#boat {
  position: fixed;
  width: 48px;
  height: 48px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 10;
  filter: drop-shadow(0px 8px 6px rgba(0, 0, 0, 0.35)); 
}

#boat svg {
  width: 100%;
  height: 100%;
  display: block;
}
```

### 2. The Final JavaScript (with Wobble, Cap, and Touch-Hiding)

```javascript
// Hide effect completely on touch devices (phones/tablets)
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

const boat = document.getElementById("boat");
const canvas = document.getElementById("trail");
const ctx = canvas.getContext("2d");

if (isTouchDevice) {
  boat.style.display = "none";
} else {
  // Only run the whole script if it's a mouse device
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  let ghost = { x: mouse.x, y: mouse.y };
  let pos = { x: mouse.x, y: mouse.y };

  let angle = 0;
  let trail = [];

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ghost.x += (mouse.x - ghost.x) * 0.11;
    ghost.y += (mouse.y - ghost.y) * 0.11;

    const dx = ghost.x - pos.x;
    const dy = ghost.y - pos.y;
    
    const stepX = dx * 0.05;
    const stepY = dy * 0.05;

    pos.x += stepX;
    pos.y += stepY;

    const speed = Math.hypot(stepX, stepY);

    if (speed > 0.1) {
      const targetAngle = Math.atan2(dy, dx);
      let delta = targetAngle - angle;

      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;

      angle += delta * 0.15;
    }

    if (speed > 0.15) {
      const backOffset = 22; 
      
      trail.push({
        x: pos.x - Math.cos(angle) * backOffset,
        y: pos.y - Math.sin(angle) * backOffset,
        angle: angle,
        life: 1.0, 
        speed: speed
      });
      
      // Polish 1: Cap trail length so memory doesn't leak
      if (trail.length > 150) trail.shift();
    }

    for (let i = 0; i < trail.length; i++) {
      trail[i].life -= 0.015;
    }
    trail = trail.filter(p => p.life > 0);

    for (let i = 1; i < trail.length; i++) {
      const p1 = trail[i - 1];
      const p2 = trail[i];

      // Polish 2: Organic wake wobble! 
      // Applied to the spread so it ripples accurately based on angle.
      const wobble1 = Math.sin(i * 0.5 + Date.now() * 0.003) * 1.5;
      const wobble2 = Math.sin((i+1) * 0.5 + Date.now() * 0.003) * 1.5;

      const spread1 = 8 + (1 - p1.life) * 25 + wobble1; 
      const spread2 = 8 + (1 - p2.life) * 25 + wobble2;

      const lx1 = p1.x + Math.cos(p1.angle - Math.PI / 2) * spread1;
      const ly1 = p1.y + Math.sin(p1.angle - Math.PI / 2) * spread1;
      const lx2 = p2.x + Math.cos(p2.angle - Math.PI / 2) * spread2;
      const ly2 = p2.y + Math.sin(p2.angle - Math.PI / 2) * spread2;

      const rx1 = p1.x + Math.cos(p1.angle + Math.PI / 2) * spread1;
      const ry1 = p1.y + Math.sin(p1.angle + Math.PI / 2) * spread1;
      const rx2 = p2.x + Math.cos(p2.angle + Math.PI / 2) * spread2;
      const ry2 = p2.y + Math.sin(p2.angle + Math.PI / 2) * spread2;

      const alpha = Math.max(0, p2.life);

      ctx.lineWidth = 1.5 + (p2.speed * 0.1);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 0;

      // Outer Waves
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
      
      ctx.beginPath();
      ctx.moveTo(lx1, ly1);
      ctx.lineTo(lx2, ly2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();

      // Inner Foam Glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.6})`;

      // Inner Foam Line
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.25})`;
      ctx.lineWidth = spread2 * 1.2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    const bob = Math.sin(Date.now() * 0.008) * Math.min(speed * 0.5, 2);

    boat.style.left = `${pos.x}px`;
    boat.style.top = `${pos.y + bob}px`;
    boat.style.transform = `
      translate(-50%, -50%)
      rotate(${angle * 180 / Math.PI + 90 + bob * 0.8}deg)
    `;
  }

  animate();
}
```

### HTML (realistic and fun boat)

```html
<div id="boat">
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer Hull: Crisp White -->
    <path d="M 32 4 C 48 20, 52 48, 48 60 L 16 60 C 12 48, 16 20, 32 4 Z" fill="#ffffff" />
    
    <!-- Sporty Deck: Vibrant Cyan -->
    <path d="M 32 12 C 42 24, 44 44, 42 56 L 22 56 C 20 44, 22 24, 32 12 Z" fill="#0ea5e9" />
    
    <!-- Cabin Roof: Crisp White -->
    <path d="M 26 26 L 38 26 L 38 42 L 26 42 Z" fill="#ffffff" />
    <path d="M 26 26 Q 32 20 38 26 Z" fill="#ffffff" />
    
    <!-- Windshield: Dark Tinted Glass -->
    <path d="M 26 26 Q 32 24 38 26 L 36 28 Q 32 26 28 28 Z" fill="#0f172a" />
    
    <!-- Fun Hot-Red Accent (Seats/Sunpad) -->
    <rect x="26" y="46" width="12" height="6" rx="2" fill="#ef4444" />
    
    <!-- Outboard Motor -->
    <rect x="29" y="60" width="6" height="4" rx="1.5" fill="#1e293b" />
  </svg>
</div>

<!-- The wake canvas! -->
<canvas id="trail"></canvas>
```