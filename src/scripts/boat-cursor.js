const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const boat = document.getElementById("boat");

if (isTouchDevice) {
  boat.style.display = "none";
} else {
  const canvas = document.getElementById("trail");
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let ghost = { x: mouse.x, y: mouse.y };
  let pos   = { x: mouse.x, y: mouse.y };
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
      while (delta >  Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      angle += delta * 0.15;
    }

    if (speed > 0.15) {
      const backOffset = 22;
      trail.push({
        x: pos.x - Math.cos(angle) * backOffset,
        y: pos.y - Math.sin(angle) * backOffset,
        angle,
        life: 1.0,
        speed,
      });
      if (trail.length > 150) trail.shift();
    }

    for (let i = 0; i < trail.length; i++) trail[i].life -= 0.015;
    trail = trail.filter(p => p.life > 0);

    for (let i = 1; i < trail.length; i++) {
      const p1 = trail[i - 1];
      const p2 = trail[i];

      const wobble1 = Math.sin(i * 0.5 + Date.now() * 0.003) * 1.5;
      const wobble2 = Math.sin((i + 1) * 0.5 + Date.now() * 0.003) * 1.5;

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

      ctx.lineWidth = 1.5 + p2.speed * 0.1;
      ctx.lineCap  = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 0;

      ctx.strokeStyle = `rgba(125,211,252,${alpha * 0.4})`;
      ctx.beginPath(); ctx.moveTo(lx1, ly1); ctx.lineTo(lx2, ly2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx1, ry1); ctx.lineTo(rx2, ry2); ctx.stroke();

      ctx.shadowBlur  = 8;
      ctx.shadowColor = `rgba(255,255,255,${alpha * 0.6})`;
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.25})`;
      ctx.lineWidth   = spread2 * 1.2;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }

    const bob = Math.sin(Date.now() * 0.008) * Math.min(speed * 0.5, 2);
    boat.style.left      = `${pos.x}px`;
    boat.style.top       = `${pos.y + bob}px`;
    boat.style.transform = `translate(-50%,-50%) rotate(${angle * 180 / Math.PI + 90 + bob * 0.8}deg)`;
  }

  animate();
}
