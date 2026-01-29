const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const themeToggle = document.getElementById('themeToggle');
const viewsEl = document.getElementById('views');

let musicStarted = false;

/* INTRO + MUSIC */
enterBtn.addEventListener('click', async () => {
  intro.style.display = 'none';
  music.volume = 0.5;
  musicStarted = true;
  try {
    await music.play();
    localStorage.setItem('musicState','playing');
  } catch(e){}
});

/* MUSIC TOGGLE */
musicToggle.addEventListener('click', async () => {
  if(!musicStarted) return;
  if(music.paused){
    await music.play().catch(()=>{});
    localStorage.setItem('musicState','playing');
  }else{
    music.pause();
    localStorage.setItem('musicState','paused');
  }
});

/* AUTO PAUSE */
document.addEventListener('visibilitychange',()=>{
  if(!musicStarted) return;
  if(document.hidden) music.pause();
  else if(localStorage.getItem('musicState')==='playing'){
    music.play().catch(()=>{});
  }
});

/* THEME TOGGLE – FIXED */
themeToggle.addEventListener('click',()=>{
  const body = document.body;
  body.classList.toggle('theme-dark');
  body.classList.toggle('theme-light');

  localStorage.setItem(
    'theme',
    body.classList.contains('theme-dark') ? 'dark' : 'light'
  );
});

/* LOAD SAVED THEME */
window.addEventListener('DOMContentLoaded',()=>{
  const saved = localStorage.getItem('theme');
  if(saved === 'light'){
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
  }
});

/* VIEW COUNTER */
fetch('https://api.countapi.xyz/hit/ericsonpauloyt/intracon_city')
  .then(res=>res.json())
  .then(data=>{
    viewsEl.textContent = `👁️ ${data.value} views`;
  })
  .catch(()=>{
    viewsEl.textContent = '👁️ Views unavailable';
  });
