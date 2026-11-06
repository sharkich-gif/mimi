// ===== Modal =====
const openBtn = document.getElementById('openAbout');
const closeBtn = document.getElementById('closeAbout');
const modal = document.getElementById('aboutModal');

openBtn.addEventListener('click', () => {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('open');
  document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ===== Music Player =====
const tracks = [
  { title: 'Awake', artist: 'russianmafiaextra', file: 'music/awake.mp3' },
  { title: 'Черный', artist: 'CUPREOUS, DJ WESSTAG', file: 'music/cherniy.mp3' },
  { title: 'Полукровка', artist: 'ICEGERGERT', file: 'music/polukrovka.mp3' },
  { title: 'Дора дура', artist: 'Дора', file: 'music/dora-dura.mp3' },
  { title: '2000 баксов (Remaster 2025)', artist: 'Алексей Марковников, Диспетчера', file: 'music/2000-baksov.mp3' },
  { title: 'Эхо', artist: 'The Chemodan Clan, Пика', file: 'music/echo.mp3' },
  { title: 'Тамагочи', artist: 'лил кидд', file: 'music/tamagochi.mp3' },
];

const audio = document.getElementById('audioPlayer');
const trackListEl = document.getElementById('trackList');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const nowTrackEl = document.getElementById('nowTrack');

let currentIndex = -1;
let isPlaying = false;

// Build track list
tracks.forEach((track, i) => {
  const li = document.createElement('li');
  li.className = 'track-item';
  li.dataset.index = i;
  li.innerHTML = `
    <span class="track-num">${i + 1}</span>
    <div class="track-info">
      <div class="track-title">${track.title}</div>
      <div class="track-artist">${track.artist}</div>
    </div>
    <span class="track-status" id="status-${i}"></span>
  `;
  li.addEventListener('click', () => loadTrack(i, true));
  trackListEl.appendChild(li);
});

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateActive() {
  document.querySelectorAll('.track-item').forEach((el, i) => {
    el.classList.toggle('active', i === currentIndex);
  });
}

function loadTrack(index, autoplay = false) {
  if (index < 0 || index >= tracks.length) return;

  currentIndex = index;
  const track = tracks[index];

  nowTrackEl.textContent = `${track.title} — ${track.artist}`;
  updateActive();

  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';

  audio.src = track.file;
  audio.load();

  audio.addEventListener('error', function onError() {
    document.getElementById(`status-${index}`).textContent = 'нет файла';
    audio.removeEventListener('error', onError);
  }, { once: true });

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
    document.getElementById(`status-${index}`).textContent = '';
  }, { once: true });

  if (autoplay) {
    audio.play().then(() => {
      isPlaying = true;
      playBtn.textContent = '⏸';
    }).catch(() => {
      isPlaying = false;
      playBtn.textContent = '▶';
    });
  }
}

function togglePlay() {
  if (currentIndex === -1) {
    loadTrack(0, true);
    return;
  }

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = '▶';
  } else {
    audio.play().then(() => {
      isPlaying = true;
      playBtn.textContent = '⏸';
    }).catch(() => {});
  }
}

playBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
  const next = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
  loadTrack(next, true);
});

nextBtn.addEventListener('click', () => {
  const next = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
  loadTrack(next, true);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', () => {
  const next = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
  loadTrack(next, true);
});

progressBar.addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// Keep background video playing
const bgVideo = document.getElementById('bgVideo');
bgVideo.addEventListener('ended', () => {
  bgVideo.currentTime = 0;
  bgVideo.play();
});
