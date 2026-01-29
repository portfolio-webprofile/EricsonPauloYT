const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const themeToggle = document.getElementById('themeToggle');
const viewsEl = document.getElementById('views');

let musicStarted=false;

/* INTRO + MUSIC */
enterBtn.addEventListener('click',async()=>{
  intro.style.display='none';
  music.volume=.5;
  musicStarted=true;
  try{await music.play();localStorage.setItem('musicState','playing')}catch(e){}
});

/* MUSIC TOGGLE */
musicToggle.addEventListener('click',async()=>{
  if(!musicStarted)return;
  if(music.paused){await music.play().catch(()=>{});localStorage.setItem('musicState','playing')}
  else{music.pause();localStorage.setItem('musicState','paused')}
});

/* AUTO PAUSE */
document.addEventListener('visibilitychange',()=>{
  if(!musicStarted)return;
  if(document.hidden)music.pause();
  else if(localStorage.getItem('musicState')==='playing'){music.play().catch(()=>{})}
});

/* THEME TOGGLE */
themeToggle.addEventListener('click',()=>{
  document.body.classList.toggle('theme-dark');
  document.body.classList.toggle('theme-light');
});

/* VIEWS */
fetch('https://api.countapi.xyz/hit/ericsonpauloyt/intracon_city')
  .then(r=>r.json())
  .then(d=>viewsEl.textContent=`👁️ ${d.value} views`)
  .catch(()=>viewsEl.textContent='👁️ Views unavailable');
