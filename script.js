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

// =====================================
// INTRO + MUSIC (MOBILE SAFE)
// =====================================
enterBtn.addEventListener('click', async () => {
  intro.classList.remove('active');
  intro.style.display = 'none';

  music.volume = 0.5;
  musicStarted = true;

  try {
    await music.play();
    localStorage.setItem('musicState', 'playing');
  } catch (e) {
    console.warn('Music autoplay blocked');
  }
});

// =====================================
// MUSIC TOGGLE
// =====================================
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

// =====================================
// AUTO PAUSE / RESUME
// =====================================
document.addEventListener('visibilitychange', () => {
  if (!musicStarted) return;

  if (document.hidden) {
    music.pause();
  } else if (localStorage.getItem('musicState') === 'playing') {
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
// VIEW COUNTER (COUNTAPI)
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  if (!viewsEl) return;

  const namespace = "ericsonpauloyt";
  const key = "intracon_city";

  fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
    .then(res => res.json())
    .then(data => {
      viewsEl.textContent = `👁️ ${data.value} views`;
    })
    .catch(() => {
      viewsEl.textContent = "👁️ Views unavailable";
    });
});

// =====================================
// YOUTUBE API (LATEST UPLOAD)
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
