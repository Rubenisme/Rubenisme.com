const THEMES = ['light', 'deep', 'midnight'];

function updateDots(theme) {
  document.querySelectorAll('.theme-dot').forEach((dot, i) => {
    dot.classList.toggle('active', THEMES[i] === theme);
  });
}

const current = document.documentElement.getAttribute('data-theme') || 'light';
updateDots(current);

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateDots(next);
});
