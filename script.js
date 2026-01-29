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
// =====================================
// DRAGGABLE FLOATING CONTROLS (FIXED)
// =====================================
(function () {
  const box = document.getElementById('floatingControls');
  if (!box) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;

  const getPoint = (e) => {
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const startDrag = (e) => {
    isDragging = true;
    box.classList.add('dragging');

    const point = getPoint(e);
    startX = point.x;
    startY = point.y;

    const rect = box.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;

    // 🔴 THIS IS THE KEY
    box.style.left = startLeft + 'px';
    box.style.top = startTop + 'px';
    box.style.right = 'auto';
    box.style.bottom = 'auto';

    e.preventDefault();
  };

  const drag = (e) => {
    if (!isDragging) return;

    const point = getPoint(e);
    let newLeft = startLeft + (point.x - startX);
    let newTop = startTop + (point.y - startY);

    const maxX = window.innerWidth - box.offsetWidth - 8;
    const maxY = window.innerHeight - box.offsetHeight - 8;

    newLeft = Math.max(8, Math.min(maxX, newLeft));
    newTop = Math.max(8, Math.min(maxY, newTop));

    box.style.left = newLeft + 'px';
    box.style.top = newTop + 'px';
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    box.classList.remove('dragging');

    // Save position
    localStorage.setItem(
      'floatingControlsPos',
      JSON.stringify({
        left: box.style.left,
        top: box.style.top
      })
    );
  };

  // Restore position
  const saved = localStorage.getItem('floatingControlsPos');
  if (saved) {
    const pos = JSON.parse(saved);
    box.style.left = pos.left;
    box.style.top = pos.top;
    box.style.right = 'auto';
    box.style.bottom = 'auto';
  }

  // EVENTS
  box.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  box.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', endDrag);
})();
