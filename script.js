// =============================
// INTRO + MUSIC (WITH MEMORY)
// =============================
const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

let musicStarted = false;
const savedMusicState = localStorage.getItem('musicState'); // playing | paused

enterBtn.addEventListener('click', () => {
  intro.style.display = 'none';
  music.volume = 0.5;
  musicStarted = true;

  if (savedMusicState !== 'paused') {
    music.play().then(() => {
      localStorage.setItem('musicState', 'playing');
    }).catch(() => {});
  }
});

musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play().catch(() => {});
    localStorage.setItem('musicState', 'playing');
  } else {
    music.pause();
    localStorage.setItem('musicState', 'paused');
  }
});

document.addEventListener('visibilitychange', () => {
  if (!musicStarted) return;
  if (document.hidden) {
    music.pause();
  } else if (localStorage.getItem('musicState') === 'playing') {
    music.play().catch(() => {});
  }
});

window.addEventListener('blur', () => {
  if (musicStarted) music.pause();
});

window.addEventListener('focus', () => {
  if (musicStarted && localStorage.getItem('musicState') === 'playing') {
    music.play().catch(() => {});
  }
});

// =============================
// THEME TOGGLE
// =============================
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('theme-light');
  document.body.classList.toggle('theme-dark');
});

// =============================
// VIEW COUNTER (CountAPI)
// =============================
fetch('https://api.countapi.xyz/hit/ericsonpauloyt/intracon')
  .then(res => res.json())
  .then(data => {
    document.getElementById('views').innerText = `👁️ ${data.value} views`;
  })
  .catch(() => {
    document.getElementById('views').innerText = '👁️ Views unavailable';
  });

// =============================
// YOUTUBE DATA API (LATEST)
// =============================
const YT_API_KEY = "PASTE_YOUR_API_KEY_HERE";
const CHANNEL_ID = "PASTE_CHANNEL_ID_HERE";

const ytContainer = document.getElementById("ytVideo");
const ytTitle = document.getElementById("ytTitle");

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
      <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
    `;
    ytTitle.innerText = video.snippet.title;
  })
  .catch(() => {
    ytContainer.innerHTML = "Failed to load video.";
  });
