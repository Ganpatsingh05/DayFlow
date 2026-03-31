// ─── DATA ────────────────────────────────────────────────────────
const HABITS = [
  { id: 'wake',  icon: 'fas fa-clock', name: 'Wake up @ 6 AM',    tag: 'habit' },
  { id: 'med',   icon: 'fas fa-om', name: 'Meditation',         tag: 'habit' },
  { id: 'exer',  icon: 'fas fa-dumbbell', name: 'Exercise',           tag: 'health' },
  { id: 'skin',  icon: 'fas fa-sparkles', name: 'Skin Care Routine',  tag: 'habit' },
  { id: 'water', icon: 'fas fa-droplet', name: 'Drink 3L Water',     tag: 'health' },
  { id: 'study', icon: 'fas fa-book', name: 'Study Session',      tag: 'habit' },
  { id: 'plan',  icon: 'fas fa-clipboard-list', name: 'Plan Next Day',      tag: 'habit' },
  { id: 'nopm',  icon: 'fas fa-shield', name: 'No P/M Challenge',   tag: 'habit' },
  { id: 'wins',  icon: 'fas fa-star', name: 'Track 5 Daily Wins',   tag: 'personal' },
];

const QUOTES = [
  // Hindi Quotes & Slokas
  {
    text: "करमण्ये वाधिकारस्ते मा फलेषु कदाचन | मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||",
    author: "Bhagavad Gita (2.47)",
    meaning: "You have the right to work only, but never to its fruits. Never let the fruits of action be your motive, nor let your attachment be to inaction."
  },
  {
    text: "उद्भव: संसर्गाः संस्कारः तत्र भूयस्त्वम् |",
    author: "Sanskrit Saying",
    meaning: "Excellence is not a skill, it is a habit. What we repeatedly do becomes our character, and our character is our destiny."
  },
  {
    text: "प्रभातः कालो नृणां श्रेष्ठः |",
    author: "Hindi Proverb",
    meaning: "The morning is the most auspicious time of the day. Success begins with how we start our morning."
  },
  {
    text: "दिन प्रतिदिन थोड़ा सा प्रयास महान् लक्ष्य तक पहुंचाता है |",
    author: "Hindi Wisdom",
    meaning: "A little effort each day leads to great goals. Consistency beats intensity."
  },
  {
    text: "जीवन एक यज्ञ है, अपना सर्वश्रेष्ठ देकर आगे बढ़ो |",
    author: "Ancient Sanskrit",
    meaning: "Life is a sacrifice. Move forward by giving your best. Success comes through dedication and commitment."
  },
  {
    text: "सफलता उन्हें मिलती है जो अपने लक्ष्य पर नजर रखते हैं |",
    author: "Hindi Proverb",
    meaning: "Success belongs to those who keep their eyes on their goals. Focus and persistence are key."
  },
  {
    text: "हर दिन नया है, हर पल नया अवसर है |",
    author: "Life Philosophy",
    meaning: "Every day is new, every moment is a new opportunity. Don't let yesterday define today."
  },
  {
    text: "योग: कर्मसु कौशलम् |",
    author: "Bhagavad Gita (2.50)",
    meaning: "Yoga is skill in action. Excellence is performing your duties with complete focus and dedication."
  },
  {
    text: "कर्म ही धर्म है, फल की चिंता मत करो |",
    author: "Bhagavad Gita Philosophy",
    meaning: "Work is your responsibility, do not worry about results. Focus on doing your duty with dedication and sincerity."
  },
  {
    text: "शक्ति विद्या से मिलती है, विद्या से सब कुछ मिल सकता है |",
    author: "Hindi Wisdom",
    meaning: "Strength comes from knowledge. With knowledge, you can achieve anything. Education is the key to success."
  },
];

// ─── STATE (stored in Supabase) ────────────────────────────────
let state = {
  habits: {},
  tasks: [],
  water: 0,
  streak: 0,
  lastDate: null,
  completedToday: false,
};

let currentQuoteIndex = 0;

const MOODS = [
  { min: 0,  max: 0,   badge: '<i class="fas fa-leaf"></i> Just Starting',   bg: 'rgba(200,241,53,0.08)',  col: 'var(--accent)' },
  { min: 1,  max: 25,  badge: '<i class="fas fa-fire"></i> Warming Up',       bg: 'rgba(241,160,53,0.12)', col: 'var(--accent2)' },
  { min: 26, max: 50,  badge: '<i class="fas fa-bolt"></i> Getting There',    bg: 'rgba(53,200,241,0.12)', col: 'var(--accent3)' },
  { min: 51, max: 75,  badge: '<i class="fas fa-rocket"></i> On Fire!',          bg: 'rgba(200,241,53,0.14)', col: 'var(--accent)' },
  { min: 76, max: 99,  badge: '<i class="fas fa-gem"></i> Almost Perfect',   bg: 'rgba(241,53,245,0.12)', col: '#f135f5' },
  { min: 100,max: 100, badge: '<i class="fas fa-trophy"></i> Perfect Day!',     bg: 'rgba(53,241,122,0.15)', col: 'var(--success)' },
];

// Local save function (deprecated - using Supabase now)
function save() {
  // Data is auto-synced to Supabase via supabase-config.js
}

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────────
function showToast(message, type = 'success', icon = null) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  if (icon) {
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  } else {
    toast.textContent = message;
  }
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInToast 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ─── CELEBRATION EFFECT ──────────────────────────────────────────
function celebrate(x, y) {
  const icons = [
    '<i class="fas fa-cheers"></i>',
    '<i class="fas fa-star"></i>',
    '<i class="fas fa-sparkles"></i>',
    '<i class="fas fa-burst"></i>',
    '<i class="fas fa-heart"></i>',
    '<i class="fas fa-trophy"></i>'
  ];
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const emoji = document.createElement('div');
      emoji.className = 'celebration';
      emoji.innerHTML = icons[Math.floor(Math.random() * icons.length)];
      emoji.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
      emoji.style.top = y + 'px';
      document.body.appendChild(emoji);
      setTimeout(() => emoji.remove(), 1000);
    }, i * 100);
  }
}

// ─── INIT ────────────────────────────────────────────────────────
async function init() {
  renderDate();
  renderHabits();
  renderCustomTasks();
  renderWater();
  renderQuote();
  updateScore();
  saveDailyStatsToSupabase();
  setTimeout(updateAllCharts, 100);
}

function renderDate() {
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('datePill').innerHTML =
    `<strong>${days[now.getDay()]}</strong>, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const h = now.getHours();
  const greet = h < 12 ? "Good Morning," : h < 17 ? "Good Afternoon," : "Good Evening,";
  document.getElementById('greetingText').innerHTML = `${greet}<br><em>Let's crush today!</em>`;
}

// ─── HABITS ─────────────────────────────────────────────────────
function renderHabits() {
  const list = document.getElementById('habitsList');
  list.innerHTML = '';
  HABITS.forEach(h => {
    const done = !!state.habits[h.id];
    const el = document.createElement('div');
    el.className = 'task-item' + (done ? ' done' : '');
    el.innerHTML = `
      <div class="task-check">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1" stroke="#0d0d0d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="task-body">
        <div class="task-name"><i class="${h.icon}"></i> ${h.name}</div>
        <div class="task-meta">
          <span class="task-tag tag-${h.tag}">${h.tag}</span>
        </div>
      </div>
    `;
    el.onclick = () => toggleHabit(h.id, el);
    list.appendChild(el);
  });
  updateHabitCount();
}

function toggleHabit(id, el) {
  const wasComplete = Object.values(state.habits).filter(Boolean).length === HABITS.length;

  state.habits[id] = !state.habits[id];
  el.classList.toggle('done');
  el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 300);

  // auto-check water habit
  if (id === 'water') {
    state.water = state.habits[id] ? 3000 : state.water;
    renderWater();
  }

  updateScore();
  updateHabitCount();

  // Sync to Supabase
  updateHabitRemote(id, state.habits[id]);

  // Check if all habits are now complete
  const allComplete = Object.values(state.habits).filter(Boolean).length === HABITS.length;
  if (allComplete && !wasComplete && !state.completedToday) {
    celebrate(window.innerWidth / 2, window.innerHeight / 2);
    showToast('All daily habits completed!', 'success', 'fa-check-circle');
    state.completedToday = true;
    saveDailyStatsToSupabase();
  }
}

function updateHabitCount() {
  const done = Object.values(state.habits).filter(Boolean).length;
  document.getElementById('habitCount').textContent = `${done} / ${HABITS.length}`;
  document.getElementById('statHabits').textContent = done;
}

// ─── CUSTOM TASKS ────────────────────────────────────────────────
function renderCustomTasks() {
  const list = document.getElementById('customList');
  const empty = document.getElementById('emptyState');
  list.innerHTML = '';

  if (state.tasks.length === 0) {
    list.appendChild(empty || createEmpty());
    document.getElementById('customCount').textContent = '0 tasks';
    return;
  }

  document.getElementById('customCount').textContent = `${state.tasks.length} task${state.tasks.length > 1 ? 's' : ''}`;

  state.tasks.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'task-item' + (t.done ? ' done' : '');
    el.innerHTML = `
      <div class="task-check">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1" stroke="#0d0d0d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="task-body">
        <div class="task-name">${t.name}</div>
        <div class="task-meta">
          <span class="task-tag tag-${t.tag}">${t.tag}</span>
          <span class="task-time">${t.time}</span>
        </div>
      </div>
      <button class="task-del" onclick="deleteTask(event,${i})">×</button>
    `;
    el.onclick = (e) => { if (!e.target.classList.contains('task-del')) toggleTask(i, el); };
    list.appendChild(el);
  });
}

function createEmpty() {
  const d = document.createElement('div');
  d.className = 'empty-state';
  d.id = 'emptyState';
  d.textContent = 'No custom tasks yet. Add one below ↓';
  return d;
}

function toggleTask(i, el) {
  const task = state.tasks[i];
  task.done = !task.done;
  el.classList.toggle('done');
  el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 300);

  if (task.done) {
    showToast('Task completed!', 'success', 'fa-check');
  }

  updateScore();
  // Sync to Supabase
  if (task.id) {
    updateTaskRemote(task.id, { done: task.done });
  }
}

function addCustomTask() {
  const input = document.getElementById('taskInput');
  const tag = document.getElementById('tagSelect').value;
  const name = input.value.trim();
  if (!name) { input.focus(); return; }

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const task = { name, tag, done: false, time };
  state.tasks.push(task);

  input.value = '';
  renderCustomTasks();
  updateScore();
  showToast('New task added!', 'success', 'fa-plus-circle');

  // Sync to Supabase and get the ID back
  addTaskRemote(task).then(remoteTask => {
    if (remoteTask && remoteTask.id) {
      // Update the local task with the ID from Supabase
      const lastTask = state.tasks[state.tasks.length - 1];
      if (lastTask && lastTask.name === task.name) {
        lastTask.id = remoteTask.id;
      }
    }
  });
}

function deleteTask(e, i) {
  e.stopPropagation();
  const task = state.tasks[i];
  state.tasks.splice(i, 1);
  renderCustomTasks();
  updateScore();
  showToast('Task removed', 'success', 'fa-trash');

  // Sync to Supabase
  if (task.id) {
    deleteTaskRemote(task.id);
  }
}

document.getElementById('taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addCustomTask();
});

// ─── WATER ──────────────────────────────────────────────────────
function renderWater() {
  const cups = document.getElementById('waterCups');
  cups.innerHTML = '';
  const total = 6; // 6 × 500ml = 3L
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    const filled = i < Math.round(state.water / 500);
    btn.innerHTML = filled ? '<i class="fas fa-droplet" style="color: var(--accent3)"></i>' : '<i class="fas fa-glass-water" style="opacity: 0.4"></i>';
    btn.title = `${(i+1) * 500}ml`;
    btn.style.cssText = `background:none;border:none;cursor:pointer;font-size:1.5rem;transition:transform 0.15s;opacity:${filled?'1':'0.35'}`;
    btn.onmouseenter = () => btn.style.transform = 'scale(1.2)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';
    btn.onclick = () => {
      const target = (i + 1) * 500;
      state.water = state.water === target ? target - 500 : target;
      // sync with habit
      if (state.water >= 3000 && !state.habits['water']) {
        state.habits['water'] = true;
        renderHabits();
        updateScore();
        showToast('Water goal reached!', 'success', 'fa-droplet');
        updateHabitRemote('water', true);
      } else if (state.water < 3000 && state.habits['water']) {
        state.habits['water'] = false;
        renderHabits();
        updateScore();
        updateHabitRemote('water', false);
      }
      renderWater();
      updateHabitCount();
      saveDailyStatsToSupabase();
    };
    cups.appendChild(btn);
  }
  const litres = (state.water / 1000).toFixed(1);
  document.getElementById('waterLabel').textContent = `${litres} / 3 litres`;
  document.getElementById('waterBar').style.width = Math.min(100, (state.water / 3000) * 100) + '%';
}

// ─── SCORE ──────────────────────────────────────────────────────
function updateScore() {
  const habitsDone  = Object.values(state.habits).filter(Boolean).length;
  const tasksDone   = state.tasks.filter(t => t.done).length;
  const totalHabits = HABITS.length;
  const totalTasks  = state.tasks.length;
  const total       = totalHabits + totalTasks;
  const done        = habitsDone + tasksDone;
  const pct         = total === 0 ? 0 : Math.round((done / total) * 100);

  // Ring
  const circumference = 2 * Math.PI * 65;
  const offset = circumference - (pct / 100) * circumference;
  document.getElementById('ringFill').style.strokeDashoffset = offset;
  document.getElementById('ringFill').style.strokeDasharray = circumference;

  document.getElementById('scoreNum').textContent = pct + '%';

  // Progress bar
  document.getElementById('progBar').style.width = pct + '%';
  document.getElementById('progLabel').textContent = `${done} of ${total} tasks complete`;

  // Stats
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statDone').textContent = done;
  document.getElementById('statStreak').textContent = state.streak;

  // Mood badge
  const mood = MOODS.find(m => pct >= m.min && pct <= m.max) || MOODS[0];
  const badge = document.getElementById('moodBadge');
  badge.innerHTML = mood.badge;
  badge.style.background = mood.bg;
  badge.style.color = mood.col;

  // Description
  const descs = [
    "Start checking off tasks to track your productivity. Every completed task brings you closer to a perfect day.",
    "Good start! Keep building momentum. Each task you complete adds up to something great.",
    "You're making solid progress! You're halfway there — keep pushing!",
    "Impressive! You're in the zone. Don't stop now, greatness is within reach.",
    "Almost there! One final push to make this a perfect, unforgettable day.",
    "🎉 PERFECT DAY! You've completed everything. You're absolutely crushing it today!",
  ];
  const di = pct === 0 ? 0 : pct <= 20 ? 1 : pct <= 50 ? 2 : pct <= 75 ? 3 : pct < 100 ? 4 : 5;
  document.getElementById('scoreDesc').textContent = descs[di];

  // Ring color by score
  const ringEl = document.getElementById('ringFill');
  if (pct >= 100) ringEl.style.stroke = 'var(--success)';
  else if (pct >= 75) ringEl.style.stroke = '#f135f5';
  else if (pct >= 50) ringEl.style.stroke = 'var(--accent3)';
  else ringEl.style.stroke = 'var(--accent)';

  // Update charts
  saveDailyStatsToSupabase();
}

// ─── QUOTE ──────────────────────────────────────────────────────
function renderQuote() {
  currentQuoteIndex = new Date().getDay() % QUOTES.length;
  updateQuoteDisplay();
}

function updateQuoteDisplay() {
  const q = QUOTES[currentQuoteIndex];
  const container = document.getElementById('quoteContainer');

  document.getElementById('quoteText').textContent = q.text;
  document.getElementById('quoteAuthor').textContent = '— ' + q.author;

  const meaningEl = document.getElementById('quoteMeaning');
  if (q.meaning) {
    meaningEl.innerHTML = `<strong>Meaning:</strong> ${q.meaning}`;
    meaningEl.style.display = 'block';
  } else {
    meaningEl.style.display = 'none';
  }
}

function getRandomQuote() {
  currentQuoteIndex = Math.floor(Math.random() * QUOTES.length);
  updateQuoteDisplay();
}

// Add refresh button to quote widget
function setupQuoteRefresh() {
  const btn = document.getElementById('quoteRefreshBtn');
  if (btn) {
    btn.addEventListener('click', getRandomQuote);
  }
}

// ─── MUSIC PLAYER (Legacy - replaced by Spotify) ───────────────────────────────────────────────
let isPlaying = false;

function isYouTubeUrl(url) {
  return /youtube.com|youtu.be/.test(url);
}

function toggleMusic() {
  const player = document.getElementById('audioPlayer');
  const input = document.getElementById('musicUrl');

  if (!player || !input) {
    console.log('Spotify player active - use Spotify controls');
    return;
  }

  const btn = document.getElementById('playPauseBtn');
  const info = document.getElementById('musicInfo');

  if (!input.value.trim()) {
    showToast('Paste a music URL first', 'error', 'fa-exclamation-circle');
    return;
  }

  const url = input.value.trim();

  // Check if YouTube URL
  if (isYouTubeUrl(url)) {
    showToast('YouTube links not supported. Use MP3 URLs or YouTube→MP3 converter', 'error', 'fa-exclamation-circle');
    if (info) info.textContent = '❌ YouTube not supported';
    return;
  }

  if (!isPlaying) {
    if (!player.src || player.src !== url) {
      player.src = url;
      player.crossOrigin = 'anonymous';
    }
    player.play().catch(err => {
      showToast('Could not play. Ensure it\'s a direct audio URL (MP3, OGG, WAV)', 'error', 'fa-exclamation-circle');
      if (info) info.textContent = '❌ Play failed';
      console.error('Audio play error:', err);
    });
    isPlaying = true;
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
    if (info) info.textContent = '▶️ Playing';
  } else {
    player.pause();
    isPlaying = false;
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
    if (info) info.textContent = '⏸️ Paused';
  }
}

function updateMusicUrl() {
  const player = document.getElementById('audioPlayer');
  const input = document.getElementById('musicUrl');
  const btn = document.getElementById('playPauseBtn');

  if (!player || !input || !btn) return;

  // Reset if URL changes
  if (player.src && input.value.trim() !== player.src) {
    player.pause();
    player.src = '';
    isPlaying = false;
    btn.innerHTML = '<i class="fas fa-play"></i>';
    document.getElementById('musicInfo').textContent = 'URL updated';
  }
}

// Listen for URL changes (old music player - now using Spotify)
// Removed: document.getElementById('musicUrl').addEventListener(...)

// Stop music on tab close
window.addEventListener('beforeunload', () => {
  const player = document.getElementById('audioPlayer');
  if (player) player.pause();
});

// ─── RESET ──────────────────────────────────────────────────────
function resetDay() {
  if (!confirm('Reset all tasks for today? This cannot be undone.')) return;
  state.habits = {};
  state.tasks = [];
  state.water = 0;
  state.completedToday = false;
  renderHabits();
  renderCustomTasks();
  renderWater();
  updateScore();
  saveDailyStatsToSupabase();
  showToast('Day reset', 'success', 'fa-redo');
}

// ─── STATS TRACKING ────────────────────────────────────────────
// Stats are now saved to Supabase automatically via saveDailyStatsToSupabase()

function logDailyStats() {
  const habitsDone = Object.values(state.habits).filter(Boolean).length;
  const tasksDone = state.tasks.filter(t => t.done).length;
  const totalTasks = HABITS.length + state.tasks.length;
  const completion = totalTasks === 0 ? 0 : Math.round(((habitsDone + tasksDone) / totalTasks) * 100);

  console.log(`📊 Daily Stats: ${completion}% complete | Habits: ${habitsDone}/${HABITS.length} | Tasks: ${tasksDone}/${state.tasks.length}`);
}

// Save stats periodically and update charts
setInterval(() => {
  saveDailyStatsToSupabase();
  updateAllCharts();
}, 5 * 60 * 1000); // Every 5 minutes

let currentStatsRange = 7;
let charts = {};

// ─── CHARTS ────────────────────────────────────────────────────
function getDateRange(days) {
  const today = new Date();
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function getStatsForRange(days) {
  const dateRange = getDateRange(days);
  return dateRange.map(date => {
    return state.dailyStats.find(s => s.date === date) || {
      date: date,
      completion: 0,
      habitsDone: 0,
      tasksDone: 0,
      totalHabits: HABITS.length,
      totalTasks: 0,
      water: 0,
      isPerfect: false,
    };
  });
}

function switchStatsRange(days) {
  currentStatsRange = parseInt(days);
  document.querySelectorAll('.stats-period-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  updateAllCharts();
}

async function updateAllCharts() {
  // Try to use IndexedDB data first, fallback to localStorage
  const dbStats = await getStatsForDateRange(currentStatsRange);
  if (dbStats.length > 0) {
    // Use IndexedDB data
    updateCompletionChartWithData(dbStats);
    updateTasksChartWithData(dbStats);
    updateStreakChartWithData(dbStats);
    updateWaterChartWithData(dbStats);
    updateSummaryStatsWithData(dbStats);
  } else {
    // Fallback to localStorage
    updateCompletionChart();
    updateTasksChart();
    updateStreakChart();
    updateWaterChart();
    updateSummaryStats();
  }
}

function updateCompletionChart() {
  const data = getStatsForRange(currentStatsRange);
  const labels = data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const completions = data.map(s => s.completion);

  const ctx = document.getElementById('completionChart');
  if (!ctx) return;

  if (charts.completion) charts.completion.destroy();

  charts.completion = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Daily Completion %',
        data: completions,
        borderColor: 'var(--accent)',
        backgroundColor: 'rgba(200, 241, 53, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'var(--accent)',
        pointBorderColor: '#0d0d0d',
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: 'var(--muted)', callback: v => v + '%' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        x: { ticks: { color: 'var(--muted)' }, grid: { display: false } }
      }
    }
  });
}

function updateTasksChart() {
  const data = getStatsForRange(currentStatsRange);
  const labels = data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const habits = data.map(s => s.habitsDone);
  const tasks = data.map(s => s.tasksDone);

  const ctx = document.getElementById('tasksChart');
  if (!ctx) return;

  if (charts.tasks) charts.tasks.destroy();

  charts.tasks = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Habits',
          data: habits,
          backgroundColor: 'var(--accent2)',
          borderRadius: 4,
        },
        {
          label: 'Tasks',
          data: tasks,
          backgroundColor: 'var(--accent3)',
          borderRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { labels: { color: 'var(--text)' } } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: 'var(--muted)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        x: { ticks: { color: 'var(--muted)' }, grid: { display: false } }
      }
    }
  });
}

function updateStreakChart() {
  const data = getStatsForRange(currentStatsRange);
  const labels = data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const isPerfect = data.map(s => s.isPerfect ? 1 : 0);

  const ctx = document.getElementById('streakChart');
  if (!ctx) return;

  if (charts.streak) charts.streak.destroy();

  charts.streak = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Perfect Days',
        data: isPerfect.map((v, i) => v === 1 ? 1 : 0),
        borderColor: '#f135f5',
        backgroundColor: 'rgba(241, 53, 245, 0.1)',
        pointBackgroundColor: '#f135f5',
        pointBorderColor: '#0d0d0d',
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          beginAtZero: true,
          max: 1,
          ticks: { display: false },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        }
      }
    }
  });
}

function updateWaterChart() {
  const data = getStatsForRange(currentStatsRange);
  const labels = data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const water = data.map(s => (s.water / 1000).toFixed(1));

  const ctx = document.getElementById('waterChart');
  if (!ctx) return;

  if (charts.water) charts.water.destroy();

  charts.water = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Liters',
        data: water,
        backgroundColor: 'var(--accent3)',
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: 'var(--muted)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        x: { ticks: { color: 'var(--muted)' }, grid: { display: false } }
      }
    }
  });
}

function updateSummaryStats() {
  const data = getStatsForRange(currentStatsRange);

  const avgCompletion = Math.round(data.reduce((sum, s) => sum + s.completion, 0) / data.length);
  const totalTasksDone = data.reduce((sum, s) => sum + s.tasksDone + s.habitsDone, 0);
  const perfectDays = data.filter(s => s.isPerfect).length;
  const totalWater = (data.reduce((sum, s) => sum + s.water, 0) / 1000).toFixed(1);

  document.getElementById('avgCompletion').textContent = avgCompletion + '%';
  document.getElementById('totalTasksDone').textContent = totalTasksDone;
  document.getElementById('perfectDays').textContent = perfectDays;
  document.getElementById('totalWater').textContent = totalWater + 'L';
}

// Chart functions that use passed data from IndexedDB
function updateCompletionChartWithData(data) {
  const labels = data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const completions = data.map(s => s.completionPercentage);

  const ctx = document.getElementById('completionChart');
  if (!ctx) return;

  if (charts.completion) charts.completion.destroy();

  charts.completion = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Daily Completion %',
        data: completions,
        borderColor: 'var(--accent)',
        backgroundColor: 'rgba(200, 241, 53, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'var(--accent)',
        pointBorderColor: '#0d0d0d',
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: 'var(--muted)', callback: v => v + '%' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        x: { ticks: { color: 'var(--muted)' }, grid: { display: false } }
      }
    }
  });
}

function updateTasksChartWithData(data) {
  const labels = data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const habits = data.map(s => s.habitsDone);
  const tasks = data.map(s => s.tasksDone);

  const ctx = document.getElementById('tasksChart');
  if (!ctx) return;

  if (charts.tasks) charts.tasks.destroy();

  charts.tasks = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Habits',
          data: habits,
          backgroundColor: 'var(--accent2)',
          borderRadius: 4,
        },
        {
          label: 'Tasks',
          data: tasks,
          backgroundColor: 'var(--accent3)',
          borderRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { labels: { color: 'var(--text)' } } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: 'var(--muted)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        x: { ticks: { color: 'var(--muted)' }, grid: { display: false } }
      }
    }
  });
}

function updateStreakChartWithData(data) {
  const labels = data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const streaks = data.map(s => s.streak);

  const ctx = document.getElementById('streakChart');
  if (!ctx) return;

  if (charts.streak) charts.streak.destroy();

  charts.streak = new Chart(ctx, {
    type: 'area',
    data: {
      labels: labels,
      datasets: [{
        label: 'Day Streak',
        data: streaks,
        borderColor: '#f135f5',
        backgroundColor: 'rgba(241, 53, 245, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#f135f5',
        pointBorderColor: '#0d0d0d',
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: 'var(--muted)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        x: { ticks: { color: 'var(--muted)' }, grid: { display: false } }
      }
    }
  });
}

function updateWaterChartWithData(data) {
  const labels = data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const water = data.map(s => (s.waterIntake / 1000).toFixed(1));

  const ctx = document.getElementById('waterChart');
  if (!ctx) return;

  if (charts.water) charts.water.destroy();

  charts.water = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Water (Liters)',
        data: water,
        backgroundColor: 'var(--accent3)',
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: 'var(--muted)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        x: { ticks: { color: 'var(--muted)' }, grid: { display: false } }
      }
    }
  });
}

function updateSummaryStatsWithData(data) {
  const avgCompletion = data.length > 0 ? Math.round(data.reduce((sum, s) => sum + s.completionPercentage, 0) / data.length) : 0;
  const totalTasksDone = data.reduce((sum, s) => sum + s.tasksDone + s.habitsDone, 0);
  const perfectDays = data.filter(s => s.isPerfectDay).length;
  const totalWater = (data.reduce((sum, s) => sum + s.waterIntake, 0) / 1000).toFixed(1);

  document.getElementById('avgCompletion').textContent = avgCompletion + '%';
  document.getElementById('totalTasksDone').textContent = totalTasksDone;
  document.getElementById('perfectDays').textContent = perfectDays;
  document.getElementById('totalWater').textContent = totalWater + 'L';
}

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K to focus add task input
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput');
    if (taskInput) taskInput.focus();
  }
  // Ctrl/Cmd + Shift + R to reset day
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
    e.preventDefault();
    resetDay();
  }
});

// ─── KICK OFF ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init();
  setupQuoteRefresh();
});
