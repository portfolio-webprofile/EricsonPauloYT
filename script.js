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
// =====================================
// AUTO OPEN SOCIAL APPS (APP → WEB FALLBACK)
// =====================================
document.querySelectorAll('[data-platform]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    const platform = btn.dataset.platform;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    let appUrl = '';
    let webUrl = '';

    switch (platform) {
      case 'youtube':
        appUrl = isAndroid
          ? 'intent://www.youtube.com/channel/UCy8Wjz8c1d9G5k0dZzKpQxQ#Intent;package=com.google.android.youtube;scheme=https;end'
          : 'youtube://www.youtube.com/channel/UCy8Wjz8c1d9G5k0dZzKpQxQ';
        webUrl = 'https://www.youtube.com/channel/UCy8Wjz8c1d9G5k0dZzKpQxQ';
        break;

      case 'facebook':
        appUrl = isAndroid
          ? 'fb://profile/100063911123456'
          : 'fb://profile/100063911123456';
        webUrl = 'https://www.facebook.com/share/1DoHvuvnUc/';
        break;

      case 'tiktok':
        appUrl = isAndroid
          ? 'snssdk1128://user/profile/ericson_paulo'
          : 'tiktok://user?username=ericson_paulo';
        webUrl = 'https://www.tiktok.com/@ericson_paulo';
        break;

      case 'discord':
        appUrl = 'discord://discord.com/users/956172755521384488';
        webUrl = 'https://discord.com/users/956172755521384488';
        break;
    }

    // Try opening app
    window.location.href = appUrl;

    // Fallback to web after delay
    setTimeout(() => {
      window.location.href = webUrl;
    }, 1200);
  });
});
