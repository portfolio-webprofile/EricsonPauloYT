const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const themeToggle = document.getElementById('themeToggle');
const viewsEl = document.getElementById('views');
const body = document.body;

let musicStarted = false;

/* INTRO + ANIMATION */
enterBtn.addEventListener('click', async () => {
  intro.classList.add('fade-out');

  setTimeout(() => {
    intro.style.display = 'none';
    body.classList.remove('intro-active');
  }, 900);

  music.volume = .5;
  musicStarted = true;

  try {
    await music.play();
    localStorage.setItem('musicState','playing');
  } catch {}
});

/* MUSIC TOGGLE */
musicToggle.addEventListener('click', async () => {
  if(!musicStarted) return;
  if(music.paused) await music.play();
  else music.pause();
});

/* THEME */
themeToggle.addEventListener('click',()=>{
  body.classList.toggle('theme-light');
});

/* VIEWS */
fetch('https://api.countapi.xyz/hit/ericsonpauloyt/intracon_city')
.then(r=>r.json())
.then(d=>viewsEl.textContent=`👁️ ${d.value} views`)
.catch(()=>viewsEl.textContent='👁️ Views unavailable');

/* YOUTUBE LATEST UPLOAD (NO API) */
const channelId = "UCy8Wjz8c1d9G5k0dZzKpQxQ";
document.getElementById('ytVideo').innerHTML = `
<iframe
  src="https://www.youtube.com/embed?listType=user_uploads&list=${channelId}"
  allowfullscreen
></iframe>`;

/* SOCIAL LINKS */
document.querySelectorAll('[data-platform]').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.preventDefault();
    const urls={
      youtube:'https://www.youtube.com/channel/UCy8Wjz8c1d9G5k0dZzKpQxQ',
      facebook:'https://www.facebook.com/',
      tiktok:'https://www.tiktok.com/',
      discord:'https://discord.com/'
    };
    window.open(urls[btn.dataset.platform],'_blank');
  });
});
