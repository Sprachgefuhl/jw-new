const currentMode = localStorage.getItem('colourMode');
const modeIcon = document.getElementById('colour-icon');

if (!currentMode) {
  setMode('dark');
} else {
  setMode(currentMode);
}

function setMode(mode) {
  localStorage.setItem('colourMode', mode);
  document.body.style.setProperty('color-scheme', mode);
  modeIcon.className = mode === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function switchMode() {
  const currentMode = localStorage.getItem('colourMode');
  if (currentMode === 'dark') setMode('light');
  else setMode('dark');
}

modeIcon.addEventListener('click', switchMode);