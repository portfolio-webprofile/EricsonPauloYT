// INTRO + MUSIC
const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('bgMusic');

enterBtn.addEventListener('click', () => {
  intro.style.display = 'none';
  music.volume = 0.5;
  music.play();
});

// MUSIC TOGGLE
document.getElementById('musicToggle').addEventListener('click', () => {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
});

// THEME TOGGLE
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('theme-light');
  document.body.classList.toggle('theme-dark');
});

// VIEW COUNTER (CountAPI)
fetch('https://api.countapi.xyz/hit/ericsonpauloyt/intracon')
  .then(res => res.json())
  .then(data => {
    document.getElementById('views').innerText = `👁️ ${data.value} views`;
  })
  .catch(() => {
    document.getElementById('views').innerText = '👁️ Views unavailable';
  });
