/* ===============================
   ELEMENTS
================================ */
const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const themeToggle = document.getElementById('themeToggle');
const viewsEl = document.getElementById('views');
const floating = document.getElementById('floatingControls');
const body = document.body;

/* ===============================
   STATE
================================ */
let musicStarted = false;

/* ===============================
   INTRO + ANIMATION
================================ */
enterBtn.addEventListener('click', async () => {
  intro.classList.add('fade-out');

  setTimeout(() => {
    intro.style.display = 'none';
    body.classList.remove('intro-active');
  }, 900);

  music.volume = .5;
  musicStarted = true;

  /* Restore last music time */
  const savedTime = localStorage.getItem('musicTime');
  if (savedTime) {
    music.currentTime = parseFloat(savedTime);
  }

  try {
    await music.play();
    localStorage.setItem('musicState', 'playing');
  } catch {}
});

/* ===============================
   MUSIC TOGGLE
================================ */
musicToggle.addEventListener('click', async () => {
  if (!musicStarted) return;

  if (music.paused) {
    await music.play().catch(() => {});
    localStorage.setItem('musicState', 'playing');
  } else {
    music.pause();
    localStorage.setItem('musicState', 'paused');
  }
});

/* ===============================
   SAVE MUSIC TIME (CONTINUE WHERE LEFT OFF)
================================ */
music.addEventListener('timeupdate', () => {
  if (!musicStarted) return;
  localStorage.setItem('musicTime', music.currentTime);
});

/* ===============================
   AUTO PAUSE / RESUME WHEN APP OR TAB CHANGES
================================ */
document.addEventListener('visibilitychange', () => {
  if (!musicStarted) return;

  if (document.hidden) {
    music.pause();
  } else if (localStorage.getItem('musicState') === 'playing') {
    music.play().catch(() => {});
  }
});

/* ===============================
   THEME TOGGLE
================================ */
themeToggle.addEventListener('click', () => {
  body.classList.toggle('theme-light');
});

/* ===============================
   VIEWS COUNTER
================================ */
fetch('https://api.countapi.xyz/hit/ericsonpauloyt/intracon_city')
  .then(r => r.json())
  .then(d => viewsEl.textContent = `👁️ ${d.value} views`)
  .catch(() => viewsEl.textContent = '👁️ Views unavailable');

/* ===============================
   YOUTUBE LATEST UPLOAD (NO API)
================================ */
const channelId = "UCy8Wjz8c1d9G5k0dZzKpQxQ";
document.getElementById('ytVideo').innerHTML = `
<iframe
  src="https://www.youtube.com/embed?listType=user_uploads&list=${channelId}"
  allowfullscreen
></iframe>`;

/* ===============================
   SOCIAL LINKS (AUTO OPEN APPS)
================================ */
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
        appUrl = 'fb://profile/100063911123456';
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

    window.location.href = appUrl;
    setTimeout(() => {
      window.location.href = webUrl;
    }, 1200);
  });
});

/* ===============================
   DRAGGABLE FLOATING CONTROLS
   + SAVE POSITION
================================ */
(() => {
  let startX = 0, startY = 0;
  let offsetX = 0, offsetY = 0;
  let dragging = false;
  let moved = false;
  const THRESHOLD = 6;

  /* RESTORE POSITION */
  const saved = localStorage.getItem('floatingControlsPos');
  if (saved) {
    const { left, top } = JSON.parse(saved);
    floating.style.left = left;
    floating.style.top = top;
    floating.style.right = 'auto';
    floating.style.bottom = 'auto';
  }

  floating.addEventListener('pointerdown', e => {
    const rect = floating.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    dragging = true;
    moved = false;
    floating.setPointerCapture(e.pointerId);
  });

  floating.addEventListener('pointermove', e => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!moved && Math.hypot(dx, dy) < THRESHOLD) return;
    moved = true;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    const maxX = window.innerWidth - floating.offsetWidth - 8;
    const maxY = window.innerHeight - floating.offsetHeight - 8;

    x = Math.max(8, Math.min(maxX, x));
    y = Math.max(8, Math.min(maxY, y));

    floating.style.left = x + 'px';
    floating.style.top = y + 'px';
    floating.style.right = 'auto';
    floating.style.bottom = 'auto';
  });

  floating.addEventListener('pointerup', () => {
    dragging = false;

    if (moved) {
      localStorage.setItem(
        'floatingControlsPos',
        JSON.stringify({
          left: floating.style.left,
          top: floating.style.top
        })
      );
    }
  });
})();
