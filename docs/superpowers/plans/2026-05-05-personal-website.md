# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page personal portfolio website for Rubenisme using Astro + Bun, featuring an ocean-inspired color palette and an interactive boat cursor.

**Architecture:** A single `index.astro` page assembles six Astro components (Nav, Hero, About, Projects, Contact, Footer) plus a Footer in a top-to-bottom scroll layout. The boat cursor runs as a vanilla JS script imported globally via Astro's bundled `<script>` tag. CSS custom properties define the ocean color palette across all components.

**Tech Stack:** Astro (static site), Bun (package manager — already installed), vanilla JS (boat cursor), CSS custom properties, optional Svelte for future interactive components.

---

## File Map

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Root page — assembles all components, loads boat cursor |
| `src/components/Nav.astro` | Fixed frosted-glass nav with smooth-scroll links |
| `src/components/Hero.astro` | Full-viewport hero with ocean gradient |
| `src/components/About.astro` | Two-column about section (professional + personal) |
| `src/components/Projects.astro` | Project grid container with data array |
| `src/components/ProjectCard.astro` | Single reusable project card |
| `src/components/Contact.astro` | Centered contact links (email, GitHub, LinkedIn) |
| `src/components/Footer.astro` | Three-column footer |
| `src/styles/global.css` | CSS reset, ocean custom properties, shared cursor styles |
| `src/scripts/boat-cursor.js` | Boat cursor animation extracted from `boat_cursor.md` |
| `public/images/about-ocean.jpg` | Aerial ocean photo for About section (user-provided) |

---

### Task 1: Initialize Astro project with Bun

**Files:**
- Create: `package.json`, `astro.config.mjs`, `src/pages/index.astro`, `tsconfig.json`

- [ ] **Step 1: Scaffold the project**

Run in `D:\Programming\Repos\NewPersonalWebsite`:
```bash
bun create astro@latest .
```
Answer the interactive prompts:
- **Where to install** → `.` (current directory, confirm overwrite)
- **How to start** → `Empty` (minimal template)
- **TypeScript** → `Yes` / `Strict`
- **Install dependencies** → `No` (we install with bun next)
- **Initialize git repository** → `No`

- [ ] **Step 2: Install dependencies**
```bash
bun install
```

- [ ] **Step 3: Start dev server and verify**
```bash
bun run dev
```
Expected: Astro dev server starts at `http://localhost:4321`. Opening it shows a minimal page with no errors in terminal. Stop the server with Ctrl+C.

- [ ] **Step 4: Initialize git and commit**
```bash
git init
git add .
git commit -m "chore: init Astro project with Bun"
```

---

### Task 2: Global CSS with ocean palette and boat cursor styles

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-deep-water:   #083b77;
  --color-mid-water:    #0b4c9a;
  --color-sky-water:    #1d7ddc;
  --color-lagoon:       #48cae4;
  --color-lagoon-muted: #90e0ef;
  --color-sand:         #f4f8fb;
  --color-sand-dark:    #eef4fa;
  --color-navy-text:    #0d1b2a;
  --color-muted-text:   #4a5568;
  --color-white:        #ffffff;

  --font-sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

html {
  scroll-behavior: smooth;
  font-family: var(--font-sans);
  color: var(--color-navy-text);
  background-color: var(--color-sand);
}

body {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Boat cursor */
* {
  cursor: none !important;
}

canvas#trail {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9;
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

- [ ] **Step 2: Create `src/scripts/boat-cursor.js`**

```javascript
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const boat = document.getElementById("boat");
const canvas = document.getElementById("trail");
const ctx = canvas.getContext("2d");

if (isTouchDevice) {
  boat.style.display = "none";
} else {
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

      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.4})`;
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
```

- [ ] **Step 3: Replace `src/pages/index.astro` with**

```astro
---
import '../styles/global.css';
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rubenisme</title>
  </head>
  <body>
    <div id="boat">
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M 32 4 C 48 20, 52 48, 48 60 L 16 60 C 12 48, 16 20, 32 4 Z" fill="#ffffff" />
        <path d="M 32 12 C 42 24, 44 44, 42 56 L 22 56 C 20 44, 22 24, 32 12 Z" fill="#0ea5e9" />
        <path d="M 26 26 L 38 26 L 38 42 L 26 42 Z" fill="#ffffff" />
        <path d="M 26 26 Q 32 20 38 26 Z" fill="#ffffff" />
        <path d="M 26 26 Q 32 24 38 26 L 36 28 Q 32 26 28 28 Z" fill="#0f172a" />
        <rect x="26" y="46" width="12" height="6" rx="2" fill="#ef4444" />
        <rect x="29" y="60" width="6" height="4" rx="1.5" fill="#1e293b" />
      </svg>
    </div>
    <canvas id="trail"></canvas>

    <p style="padding: 4rem 2rem;">Boat cursor test</p>

    <script>
      import '../scripts/boat-cursor.js';
    </script>
  </body>
</html>
```

- [ ] **Step 4: Verify boat cursor in browser**

`bun run dev` — open `http://localhost:4321`. Move your mouse. Expected:
- Default cursor hidden
- Boat SVG follows mouse with smooth lag
- White wake trail appears and fades behind the boat

- [ ] **Step 5: Commit**
```bash
git add src/styles/global.css src/scripts/boat-cursor.js src/pages/index.astro
git commit -m "feat: add ocean palette + interactive boat cursor with wake trail"
```

---

### Task 3: Nav component

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
<nav>
  <a class="logo" href="#home">Rubenisme</a>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: rgba(8, 59, 119, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(72, 202, 228, 0.2);
  }

  .logo {
    font-weight: 700;
    font-size: 1.1rem;
    color: #ffffff;
    letter-spacing: 0.02em;
  }

  ul {
    list-style: none;
    display: flex;
    gap: 2rem;
  }

  ul a {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.2s;
  }

  ul a:hover {
    color: #48cae4;
  }

  @media (max-width: 600px) {
    nav { padding: 0.75rem 1rem; }
    ul  { gap: 1rem; }
    ul a { font-size: 0.85rem; }
  }
</style>
```

- [ ] **Step 2: Add Nav to `src/pages/index.astro`**

Update the frontmatter and body:
```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rubenisme</title>
  </head>
  <body>
    <div id="boat">
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M 32 4 C 48 20, 52 48, 48 60 L 16 60 C 12 48, 16 20, 32 4 Z" fill="#ffffff" />
        <path d="M 32 12 C 42 24, 44 44, 42 56 L 22 56 C 20 44, 22 24, 32 12 Z" fill="#0ea5e9" />
        <path d="M 26 26 L 38 26 L 38 42 L 26 42 Z" fill="#ffffff" />
        <path d="M 26 26 Q 32 20 38 26 Z" fill="#ffffff" />
        <path d="M 26 26 Q 32 24 38 26 L 36 28 Q 32 26 28 28 Z" fill="#0f172a" />
        <rect x="26" y="46" width="12" height="6" rx="2" fill="#ef4444" />
        <rect x="29" y="60" width="6" height="4" rx="1.5" fill="#1e293b" />
      </svg>
    </div>
    <canvas id="trail"></canvas>

    <Nav />
    <main>
      <p style="padding: 6rem 2rem;">Content coming soon</p>
    </main>

    <script>
      import '../scripts/boat-cursor.js';
    </script>
  </body>
</html>
```

- [ ] **Step 3: Verify nav in browser**

`bun run dev`. Expected:
- Frosted dark-blue nav bar fixed at top
- "Rubenisme" logo on the left, four links on the right
- Links highlight teal (`#48cae4`) on hover
- Boat cursor still works

- [ ] **Step 4: Commit**
```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "feat: add fixed frosted-glass nav"
```

---

### Task 4: Hero section

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
<section id="home">
  <div class="content">
    <h1>Rubenisme</h1>
    <p class="tagline">Developer &amp; maker of things</p>
  </div>
  <div class="scroll-hint" aria-hidden="true">↓</div>
</section>

<style>
  section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 30% 20%, #1d7ddc 0%, #0b4c9a 35%, #083b77 100%);
    position: relative;
  }

  .content {
    text-align: center;
    color: #ffffff;
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 1rem;
  }

  .tagline {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    color: rgba(255, 255, 255, 0.75);
    font-weight: 400;
    letter-spacing: 0.05em;
  }

  .scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.5rem;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0);   }
    50%       { transform: translateX(-50%) translateY(8px); }
  }
</style>
```

- [ ] **Step 2: Add Hero to `src/pages/index.astro`**

Update frontmatter and `<main>`:
```astro
---
import '../styles/global.css';
import Nav  from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
---
```
Replace the `<main>` placeholder content with:
```astro
    <main>
      <Hero />
    </main>
```

- [ ] **Step 3: Verify hero in browser**

`bun run dev`. Expected:
- Deep ocean gradient fills the full viewport
- "Rubenisme" in large white text, centered
- Tagline in muted white below
- Bouncing `↓` arrow at the bottom
- Nav sits over the gradient (frosted glass effect visible)

- [ ] **Step 4: Commit**
```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add full-viewport hero with ocean gradient"
```

---

### Task 5: About section

**Files:**
- Create: `src/components/About.astro`
- Add: `public/images/about-ocean.jpg`
- Modify: `src/pages/index.astro`

**Before this task:** Download a royalty-free aerial ocean/beach photo (e.g. search "aerial maldives turquoise" on Unsplash) and save it as `public/images/about-ocean.jpg`.

- [ ] **Step 1: Create `src/components/About.astro`**

```astro
<section id="about">
  <div class="container">
    <h2>About</h2>
    <div class="columns">

      <div class="col">
        <h3>Professional</h3>
        <p>
          I build software — from web apps and automation tools to personal projects
          that scratch an itch. I enjoy the full stack: designing clean interfaces,
          writing reliable back-end logic, and connecting the two.
        </p>
        <ul class="skills">
          <li>JavaScript / TypeScript</li>
          <li>Astro / Svelte</li>
          <li>Python</li>
          <li>Node.js / Bun</li>
          <li>HTML &amp; CSS</li>
          <li>Git</li>
        </ul>
      </div>

      <div class="col">
        <h3>Personal</h3>
        <p>
          Code is both my work and my hobby — I often build things just because
          they seem fun or useful. When I'm not at a keyboard, I'm drawn to the
          ocean: my wallpapers are almost exclusively aerial shots of Bora Bora,
          the Maldives, and the Caribbean. That palette found its way here too.
        </p>
        <div class="photo">
          <img src="/images/about-ocean.jpg" alt="Aerial ocean view" />
        </div>
      </div>

    </div>
  </div>
</section>

<style>
  section {
    padding: 6rem 2rem;
    background: #f4f8fb;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #083b77;
    margin-bottom: 3rem;
  }

  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  h3 {
    font-size: 0.85rem;
    font-weight: 700;
    color: #48cae4;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.7;
    color: #0d1b2a;
    margin-bottom: 1.5rem;
  }

  .skills {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skills li {
    background: #083b77;
    color: #ffffff;
    font-size: 0.8rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
  }

  .photo {
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
  }

  .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    .columns { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Replace placeholder text with your actual bio and skills**

In `About.astro`, update:
- The Professional paragraph with your real background
- The Personal paragraph with your actual story
- The `.skills` list with your actual tech stack

- [ ] **Step 3: Add About to `src/pages/index.astro`**

Add `import About from '../components/About.astro';` to the frontmatter, and `<About />` after `<Hero />` inside `<main>`.

- [ ] **Step 4: Verify in browser**

`bun run dev`. Scroll past the hero. Expected:
- Sandy-white background section
- "About" in deep blue, two teal-labeled columns
- Professional: text + navy pill badges for skills
- Personal: text + aerial ocean photo in rounded card
- On mobile (< 768px): Professional stacks above Personal

- [ ] **Step 5: Commit**
```bash
git add src/components/About.astro src/pages/index.astro public/images/about-ocean.jpg
git commit -m "feat: add About section with professional/personal columns"
```

---

### Task 6: Projects section

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/Projects.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
interface Props {
  name:        string;
  description: string;
  status:      'built' | 'in-progress';
  url?:        string;
  isPrivate?:  boolean;
}

const { name, description, status, url, isPrivate = false } = Astro.props;
---

<article class:list={['card', { muted: status === 'in-progress' }]}>
  <div class="header">
    <span class:list={['badge', status]}>
      {status === 'built' ? 'Built' : 'In Progress'}
    </span>
    {isPrivate
      ? <span class="lock" title="Private">🔒</span>
      : url
        ? <a class="gh-link" href={url} target="_blank" rel="noopener noreferrer" title="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.02c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        : null
    }
  </div>
  <h3>{name}</h3>
  <p>{description}</p>
</article>

<style>
  .card {
    background: #ffffff;
    border: 1px solid rgba(8, 59, 119, 0.12);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(8, 59, 119, 0.12);
  }

  .card.muted {
    opacity: 0.72;
    filter: saturate(0.65);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge.built {
    background: #48cae4;
    color: #083b77;
  }

  .badge.in-progress {
    border: 1.5px solid #48cae4;
    color: #48cae4;
  }

  .lock {
    font-size: 1rem;
  }

  .gh-link {
    color: #0b4c9a;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }

  .gh-link:hover {
    color: #48cae4;
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: #0d1b2a;
  }

  p {
    font-size: 0.9rem;
    color: #4a5568;
    line-height: 1.6;
  }
</style>
```

- [ ] **Step 2: Create `src/components/Projects.astro`**

```astro
---
import ProjectCard from './ProjectCard.astro';

const projects = [
  {
    name: 'Boat Cursor',
    description: 'Interactive SVG boat cursor with a canvas-based wake trail effect.',
    status: 'built' as const,
    url: 'https://github.com/yourusername/boat-cursor',
  },
  {
    name: 'Project Two',
    description: 'Short description of this project.',
    status: 'built' as const,
    isPrivate: true,
  },
  {
    name: 'Project Three',
    description: 'Short description of this project.',
    status: 'built' as const,
    url: 'https://github.com/yourusername/project-three',
  },
  {
    name: 'Project Four',
    description: 'Short description of this project.',
    status: 'built' as const,
    isPrivate: true,
  },
  {
    name: 'Project Five',
    description: 'Short description of this project.',
    status: 'in-progress' as const,
    url: 'https://github.com/yourusername/project-five',
  },
  {
    name: 'Project Six',
    description: 'Short description of this project.',
    status: 'in-progress' as const,
    isPrivate: true,
  },
  {
    name: 'Project Seven',
    description: 'Short description of this project.',
    status: 'in-progress' as const,
    url: 'https://github.com/yourusername/project-seven',
  },
  {
    name: 'Project Eight',
    description: 'Short description of this project.',
    status: 'in-progress' as const,
    isPrivate: true,
  },
];
---

<section id="projects">
  <div class="container">
    <h2>Projects</h2>
    <div class="grid">
      {projects.map(p => <ProjectCard {...p} />)}
    </div>
  </div>
</section>

<style>
  section {
    padding: 6rem 2rem;
    background: #eef4fa;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #083b77;
    margin-bottom: 3rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 640px) {
    .grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 3: Replace placeholder project data with your actual 8 projects**

In `Projects.astro`, update each object in the `projects` array with your real project names, descriptions, and GitHub URLs (or `isPrivate: true` for private ones).

- [ ] **Step 4: Add Projects to `src/pages/index.astro`**

Add `import Projects from '../components/Projects.astro';` to frontmatter and `<Projects />` after `<About />` inside `<main>`.

- [ ] **Step 5: Verify in browser**

`bun run dev`. Scroll to Projects. Expected:
- Slightly darker sand background (`#eef4fa`)
- 2-column grid of 8 cards
- Built cards: solid teal badge, full color, GitHub SVG icon or lock
- In Progress cards: outlined teal badge, desaturated appearance
- Cards lift on hover

- [ ] **Step 6: Commit**
```bash
git add src/components/ProjectCard.astro src/components/Projects.astro src/pages/index.astro
git commit -m "feat: add Projects section with 8 cards and status badges"
```

---

### Task 7: Contact section

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Contact.astro`**

```astro
---
const EMAIL    = 'your@email.com';
const GITHUB   = 'https://github.com/yourusername';
const LINKEDIN = 'https://linkedin.com/in/yourusername';
---

<section id="contact">
  <div class="container">
    <h2>Contact</h2>
    <p class="subtitle">Want to get in touch? Reach out through any of these.</p>
    <div class="links">
      <a href={`mailto:${EMAIL}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
        </svg>
        <span>{EMAIL}</span>
      </a>
      <a href={GITHUB} target="_blank" rel="noopener noreferrer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.02c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <span>GitHub</span>
      </a>
      <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.22 0z"/>
        </svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </div>
</section>

<style>
  section {
    padding: 6rem 2rem;
    background: #f4f8fb;
    text-align: center;
  }

  .container {
    max-width: 480px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #083b77;
    margin-bottom: 1rem;
  }

  .subtitle {
    color: #4a5568;
    line-height: 1.6;
    margin-bottom: 3rem;
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    font-weight: 500;
    color: #0b4c9a;
    padding: 0.85rem 1.5rem;
    border: 1.5px solid #48cae4;
    border-radius: 8px;
    transition: background 0.2s, color 0.2s;
  }

  a:hover {
    background: #48cae4;
    color: #083b77;
  }
</style>
```

- [ ] **Step 2: Replace placeholder contact details**

In `Contact.astro`, set `EMAIL`, `GITHUB`, and `LINKEDIN` to your actual values.

- [ ] **Step 3: Add Contact to `src/pages/index.astro`**

Add `import Contact from '../components/Contact.astro';` to frontmatter and `<Contact />` after `<Projects />`.

- [ ] **Step 4: Verify in browser**

`bun run dev`. Scroll to Contact. Expected:
- Sandy background, centered layout
- Three bordered buttons: email with envelope icon, GitHub with GitHub icon, LinkedIn with LinkedIn icon
- Buttons fill teal on hover

- [ ] **Step 5: Commit**
```bash
git add src/components/Contact.astro src/pages/index.astro
git commit -m "feat: add Contact section with email, GitHub, LinkedIn"
```

---

### Task 8: Footer and final assembly

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro` (final version)

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
const GITHUB   = 'https://github.com/yourusername';
const LINKEDIN = 'https://linkedin.com/in/yourusername';
---

<footer>
  <div class="left">&copy; 2026 Rubenisme &mdash; All rights reserved.</div>
  <div class="center">
    <a href="/cv.pdf" download>Download CV</a>
    <span aria-hidden="true">·</span>
    <a href="/blog">Blog</a>
    <span aria-hidden="true">·</span>
    <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
    <span aria-hidden="true">·</span>
    <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
  </div>
  <div class="right">
    Built with <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a>
  </div>
</footer>

<style>
  footer {
    background: #083b77;
    color: rgba(255, 255, 255, 0.65);
    padding: 1.5rem 2rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    font-size: 0.82rem;
  }

  .left  { text-align: left; }
  .right { text-align: right; }

  .center {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    white-space: nowrap;
  }

  span { color: rgba(255, 255, 255, 0.3); }

  a {
    color: rgba(255, 255, 255, 0.65);
    transition: color 0.2s;
  }

  a:hover { color: #48cae4; }

  @media (max-width: 700px) {
    footer {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .left, .right { text-align: center; }
    .center {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
</style>
```

- [ ] **Step 2: Write final `src/pages/index.astro`**

```astro
---
import '../styles/global.css';
import Nav      from '../components/Nav.astro';
import Hero     from '../components/Hero.astro';
import About    from '../components/About.astro';
import Projects from '../components/Projects.astro';
import Contact  from '../components/Contact.astro';
import Footer   from '../components/Footer.astro';
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rubenisme</title>
  </head>
  <body>
    <div id="boat">
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M 32 4 C 48 20, 52 48, 48 60 L 16 60 C 12 48, 16 20, 32 4 Z" fill="#ffffff" />
        <path d="M 32 12 C 42 24, 44 44, 42 56 L 22 56 C 20 44, 22 24, 32 12 Z" fill="#0ea5e9" />
        <path d="M 26 26 L 38 26 L 38 42 L 26 42 Z" fill="#ffffff" />
        <path d="M 26 26 Q 32 20 38 26 Z" fill="#ffffff" />
        <path d="M 26 26 Q 32 24 38 26 L 36 28 Q 32 26 28 28 Z" fill="#0f172a" />
        <rect x="26" y="46" width="12" height="6" rx="2" fill="#ef4444" />
        <rect x="29" y="60" width="6" height="4" rx="1.5" fill="#1e293b" />
      </svg>
    </div>
    <canvas id="trail"></canvas>

    <Nav />
    <main>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
    <Footer />

    <script>
      import '../scripts/boat-cursor.js';
    </script>
  </body>
</html>
```

- [ ] **Step 3: End-to-end verification**

`bun run dev` — open `http://localhost:4321` and verify:
1. Boat cursor animates with wake trail on mouse movement
2. Nav fixed at top — links scroll smoothly to each section
3. Hero — ocean gradient, "Rubenisme" centered, bouncing arrow
4. About — two columns (professional left, personal + photo right)
5. Projects — 8 cards in 2-column grid, correct badges and icons
6. Contact — three teal-bordered buttons fill on hover
7. Footer — three-column layout, all links present
8. Resize browser to 400px wide — all columns stack, nav still readable

- [ ] **Step 4: Final commit**
```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Footer, complete single-page site assembly"
```
