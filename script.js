// =====================================
// ELEMENT REFERENCES
// =====================================
const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const themeToggle = document.getElementById('themeToggle');

const viewsEl = document.getElementById('views');
const ytContainer = document.getElementById('ytVideo');
const ytTitle = document.getElementById('ytTitle');

// =====================================
// STATE
// =====================================
let musicStarted = false;
const savedMusicState = localStorage.getItem('musicState'); // "playing" | "paused"

// =====================================
// INTRO + MUSIC START (WITH MEMORY)
// =====================================
enterBtn.addEventListener('click', () => {
  intro.style.display = 'none';
  music.volume = 0.5;
  musicStarted = true;

  if (savedMusicState !== 'paused') {
    music.play()
      .then(() => localStorage.setItem('musicState', 'playing'))
      .catch(() => {});
  }
});

// =====================================
// MUSIC TOGGLE (USER CONTROL)
// =====================================
musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play().catch(() => {});
    localStorage.setItem('musicState', 'playing');
  } else {
    music.pause();
    localStorage.setItem('musicState', 'paused');
  }
});

// =====================================
// AUTO PAUSE / RESUME (DESKTOP + MOBILE)
// =====================================
document.addEventListener('visibilitychange', () => {
  if (!musicStarted) return;

  if (document.hidden) {
    music.pause();
  } else if (localStorage.getItem('musicState') === 'playing') {
    music.play().catch(() => {});
  }
});

window.addEventListener('pagehide', () => {
  if (musicStarted) music.pause();
});

window.addEventListener('pageshow', () => {
  if (musicStarted && localStorage.getItem('musicState') === 'playing') {
    music.play().catch(() => {});
  }
});

document.addEventListener('freeze', () => {
  if (musicStarted) music.pause();
});

document.addEventListener('resume', () => {
  if (musicStarted && localStorage.getItem('musicState') === 'playing') {
    music.play().catch(() => {});
  }
});

// =====================================
// THEME TOGGLE
// =====================================
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('theme-dark');
  document.body.classList.toggle('theme-light');
});

// =====================================
// VIEW COUNTER (COUNTAPI – FIXED)
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  if (!viewsEl) return;

  const namespace = "ericsonpauloyt";
  const key = "intracon_city";

  const today = new Date().toDateString();
  const lastView = localStorage.getItem("lastViewDate");

  const hitUrl = `https://api.countapi.xyz/hit/${namespace}/${key}`;
  const getUrl = `https://api.countapi.xyz/get/${namespace}/${key}`;

  const updateViewText = (val) => {
    viewsEl.textContent = `👁️ ${val} views`;
  };

  if (lastView !== today) {
    fetch(hitUrl)
      .then(res => res.json())
      .then(data => {
        updateViewText(data.value);
        localStorage.setItem("lastViewDate", today);
      })
      .catch(() => {
        viewsEl.textContent = "👁️ Views unavailable";
      });
  } else {
    fetch(getUrl)
      .then(res => res.json())
      .then(data => {
        updateViewText(data.value);
      })
      .catch(() => {
        viewsEl.textContent = "👁️ Views unavailable";
      });
  }
});

// =====================================
// YOUTUBE DATA API (LATEST UPLOAD)
// =====================================
const YT_API_KEY = "PASTE_YOUR_API_KEY_HERE";
const CHANNEL_ID = "PASTE_CHANNEL_ID_HERE";

fetch(
  `https://www.googleapis.com/youtube/v3/search?` +
  `key=${YT_API_KEY}` +
  `&channelId=${CHANNEL_ID}` +
  `&part=snippet,id` +
  `&order=date` +
  `&maxResults=1`
)
  .then(res => res.json())
  .then(data => {
    if (!data.items || !data.items.length) {
      ytContainer.innerHTML = "No videos found.";
      return;
    }

    const video = data.items[0];
    if (video.id.kind !== "youtube#video") {
      ytContainer.innerHTML = "Latest upload is not a video.";
      return;
    }

    const videoId = video.id.videoId;

    ytContainer.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}"
        allowfullscreen
      ></iframe>
    `;

    ytTitle.innerText = video.snippet.title;
  })
  .catch(() => {
    ytContainer.innerHTML = "Failed to load video.";
  });
