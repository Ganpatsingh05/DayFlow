// ─── SUPABASE CONFIGURATION ─────────────────────────────────────
// Wait for Supabase library to load
function waitForSupabase(callback, attempts = 0) {
  if (window.supabase) {
    console.log('✅ Supabase library loaded');
    callback();
  } else if (attempts < 20) {
    // Wait up to 2 seconds for Supabase to load
    setTimeout(() => waitForSupabase(callback, attempts + 1), 100);
  } else {
    console.error('❌ ERROR: Supabase library failed to load from CDN');
    console.error('Check your internet connection or CDN status');
  }
}

// Initialize when Supabase library is ready
waitForSupabase(() => {
  // Load from environment variables set by env-loader.js
  const SUPABASE_URL = window.ENV?.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = window.ENV?.VITE_SUPABASE_ANON_KEY;

  console.log('Initializing Supabase with URL:', SUPABASE_URL?.substring(0, 30) + '...');

  // Create global supabase client
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      window.supabase_client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase client initialized successfully');
    } catch (err) {
      console.error('❌ Error creating Supabase client:', err);
      window.supabase_client = null;
    }
  } else {
    console.error('❌ ERROR: Supabase credentials not configured!');
    console.error('VITE_SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Missing');
    console.error('VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Set' : 'Missing');
  }

  // Start auth after Supabase is ready
  startDayFlowApp();
});

// Global variables
var supabase = null;
if (typeof currentUser === 'undefined') var currentUser = null;
if (typeof authUnsubscribe === 'undefined') var authUnsubscribe = null;

// Helper function to get supabase client
function getSupabase() {
  return window.supabase_client;
}

// Start the app after Supabase is ready
function startDayFlowApp() {
  console.log('🚀 Starting DayFlow App');
  initAuth();
  startAutoSync();
}

// ─── AUTHENTICATION ─────────────────────────────────────────────
async function initAuth() {
  return new Promise((resolve) => {
    const sb = getSupabase();
    if (!sb) {
      console.error('❌ Supabase not initialized. Auth cannot start.');
      showAuthModal();
      resolve();
      return;
    }

    authUnsubscribe = sb.auth.onAuthStateChange(async (event, session) => {
      currentUser = session?.user;

      if (currentUser) {
        console.log('✅ Logged in as:', currentUser.email);

        // Clear old localStorage data (migration to Supabase)
        const oldState = localStorage.getItem('dayflow_state');
        if (oldState) {
          console.log('🧹 Clearing old localStorage data...');
          localStorage.removeItem('dayflow_state');
          showToast('Old cache cleared. Fresh start!', 'success', 'fa-broom');
        }

        document.getElementById('logoutBtn').style.display = 'block';
        hideAuthModal();
        await loadUserData();
        init();
      } else {
        // Clear on logout
        state = {
          habits: {},
          tasks: [],
          water: 0,
          streak: 0,
          lastDate: null,
          completedToday: false,
        };
        document.getElementById('logoutBtn').style.display = 'none';
        showAuthModal();
      }
      resolve();
    });
  });
}

function showAuthModal() {
  const authContainer = document.getElementById('authContainer');
  if (authContainer) {
    authContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

function hideAuthModal() {
  const authContainer = document.getElementById('authContainer');
  if (authContainer) {
    authContainer.style.display = 'none';
    document.body.style.overflow = 'auto'; // Allow scrolling
  }
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(tab + 'Form').classList.add('active');
}

async function handleSignIn(event) {
  event.preventDefault();
  const email = document.getElementById('signinEmail').value.trim();
  const password = document.getElementById('signinPassword').value;
  const btn = event.target;

  if (!email || !password) {
    showAuthError('Please enter email and password');
    return;
  }

  if (!getSupabase()) {
    showAuthError('❌ Supabase not initialized. Check console.');
    console.error('Supabase client is null');
    return;
  }

  // Show loading state
  const originalText = btn.textContent;
  btn.textContent = '⏳ Signing in...';
  btn.disabled = true;

  try {
    console.log('🔒 Attempting sign in for:', email);
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });

    if (error) {
      console.error('❌ Sign in error:', error);
      showAuthError(error.message);
    } else {
      console.log('✅ Sign in successful');
      // Clear inputs
      document.getElementById('signinEmail').value = '';
      document.getElementById('signinPassword').value = '';
    }
  } catch (err) {
    console.error('❌ Sign in exception:', err);
    showAuthError('Error: ' + err.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

async function handleSignUp(event) {
  event.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const btn = event.target;

  if (!email || !password || !confirm) {
    showAuthError('Please fill all fields');
    return;
  }

  if (password !== confirm) {
    showAuthError('Passwords do not match');
    return;
  }

  if (password.length < 8) {
    showAuthError('Password must be at least 8 characters');
    return;
  }

  if (!getSupabase()) {
    showAuthError('❌ Supabase not initialized. Check console.');
    console.error('Supabase client is null');
    return;
  }

  // Show loading state
  const originalText = btn.textContent;
  btn.textContent = '⏳ Creating account...';
  btn.disabled = true;

  try {
    console.log('📝 Attempting sign up for:', email);
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      console.error('❌ Sign up error:', error);
      showAuthError(error.message);
    } else {
      console.log('✅ Sign up successful. Confirmation email sent.');
      showAuthError('✓ Account created! Check your email or sign in.', 'success');

      // Clear inputs
      document.getElementById('signupEmail').value = '';
      document.getElementById('signupPassword').value = '';
      document.getElementById('signupConfirm').value = '';

      setTimeout(() => switchAuthTab('signin'), 2000);
    }
  } catch (err) {
    console.error('❌ Sign up exception:', err);
    showAuthError('Error: ' + err.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

function showAuthError(message, type = 'error') {
  const errorEl = document.getElementById('authError');
  if (!errorEl) {
    console.error('Auth error element not found');
    alert(message);
    return;
  }

  errorEl.textContent = message;
  errorEl.className = 'auth-error';
  errorEl.style.display = 'block';

  if (type === 'success') {
    errorEl.classList.add('success');
  }

  // Auto-hide after 5 seconds for non-success messages
  if (type !== 'success') {
    setTimeout(() => {
      errorEl.style.display = 'none';
    }, 5000);
  }
}

async function handleLogout() {
  const sb = getSupabase();
  if (sb) {
    await sb.auth.signOut();
  }
  currentUser = null;
  showAuthModal();
}

// ─── DATA OPERATIONS ────────────────────────────────────────────

// Load all user data
async function loadUserData() {
  if (!currentUser) return;

  const sb = getSupabase();
  if (!sb) return;

  const today = new Date().toDateString();

  // Load habits for today
  const { data: habitsData } = await sb
    .from('habits')
    .select('*')
    .eq('user_id', currentUser.id)
    .eq('date', today);

  state.habits = {};
  habitsData?.forEach(h => {
    state.habits[h.habit_id] = h.completed;
  });

  // Load tasks for today
  const { data: tasksData } = await sb
    .from('tasks')
    .select('*')
    .eq('user_id', currentUser.id)
    .eq('date', today);

  // Normalize task data - ensure all properties are correctly mapped
  state.tasks = (tasksData || []).map(task => ({
    id: task.id,
    name: task.name,
    tag: task.tag,
    done: task.done === true, // Ensure boolean value
    time: task.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    created_at: task.created_at
  }));

  // Load today's stats
  const { data: statsData } = await sb
    .from('daily_stats')
    .select('*')
    .eq('user_id', currentUser.id)
    .eq('date', today)
    .single();

  if (statsData) {
    state.water = statsData.water_intake;
    state.streak = statsData.streak;
  }
}

// Save daily stats
async function saveDailyStatsToSupabase() {
  if (!currentUser) return;

  const sb = getSupabase();
  if (!sb) return;

  const today = new Date().toDateString();
  const done = Object.values(state.habits).filter(Boolean).length;
  const total = HABITS.length + state.tasks.length;
  const completion = total === 0 ? 0 : Math.round((done / total) * 100);

  const dailySnapshot = {
    user_id: currentUser.id,
    date: today,
    timestamp: new Date().getTime(),
    completion_percentage: completion,
    habits_done: Object.values(state.habits).filter(Boolean).length,
    habits_total: HABITS.length,
    tasks_done: state.tasks.filter(t => t.done).length,
    tasks_total: state.tasks.length,
    water_intake: state.water,
    streak: state.streak,
    is_perfect_day: completion === 100
  };

  const { error } = await sb
    .from('daily_stats')
    .upsert(dailySnapshot, { onConflict: 'user_id,date' });

  if (error) console.error('Error saving stats:', error);
}

// Update habit
async function updateHabitRemote(habitId, completed) {
  if (!currentUser) return;

  const sb = getSupabase();
  if (!sb) return;

  const today = new Date().toDateString();

  const { error } = await sb
    .from('habits')
    .upsert({
      user_id: currentUser.id,
      date: today,
      habit_id: habitId,
      completed: completed
    }, { onConflict: 'user_id,date,habit_id' });

  if (error) console.error('Error updating habit:', error);

  await saveDailyStatsToSupabase();
}

// Add task
async function addTaskRemote(taskData) {
  if (!currentUser) return null;

  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from('tasks')
    .insert({
      user_id: currentUser.id,
      date: new Date().toDateString(),
      name: taskData.name,
      tag: taskData.tag,
      done: false
    })
    .select();

  if (error) {
    console.error('Error adding task:', error);
    return null;
  }

  // Return the inserted task with its ID
  return data && data.length > 0 ? data[0] : null;
}

// Update task
async function updateTaskRemote(taskId, updates) {
  if (!currentUser) return;

  const sb = getSupabase();
  if (!sb) return;

  const { error } = await sb
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', currentUser.id);

  if (error) console.error('Error updating task:', error);

  await saveDailyStatsToSupabase();
}

// Delete task
async function deleteTaskRemote(taskId) {
  if (!currentUser) return;

  const sb = getSupabase();
  if (!sb) return;

  const { error } = await sb
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', currentUser.id);

  if (error) console.error('Error deleting task:', error);

  await saveDailyStatsToSupabase();
}

// ─── STATS QUERIES ──────────────────────────────────────────────

async function getStatsForDateRange(days = 7) {
  if (!currentUser) return [];

  const sb = getSupabase();
  if (!sb) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffString = cutoffDate.toDateString();

  const { data } = await sb
    .from('daily_stats')
    .select('*')
    .eq('user_id', currentUser.id)
    .gte('date', cutoffString)
    .order('date', { ascending: true });

  return data || [];
}

async function exportStatsToCSV(days = 30) {
  const stats = await getStatsForDateRange(days);

  if (stats.length === 0) {
    showToast('No data to export', 'info', 'fa-info-circle');
    return;
  }

  let csv = 'Date,Completion %,Habits Done,Tasks Done,Water (L),Streak,Perfect Day\n';

  stats.forEach(stat => {
    csv += `"${stat.date}",${stat.completion_percentage},${stat.habits_done}/${stat.habits_total},${stat.tasks_done}/${stat.tasks_total},${(stat.water_intake / 1000).toFixed(1)},${stat.streak},${stat.is_perfect_day ? 'Yes' : 'No'}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dayflow-stats-${days}days-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  showToast(`Exported ${stats.length} days of data`, 'success', 'fa-download');
}

// ─── AUTO-SYNC ──────────────────────────────────────────────────
// Auto-sync data to Supabase every 30 seconds when user is logged in
function startAutoSync() {
  setInterval(() => {
    if (currentUser) {
      saveDailyStatsToSupabase().catch(err => console.error('Auto-sync error:', err));
    }
  }, 30000); // 30 seconds
}

// ─── INITIALIZE ─────────────────────────────────────────────────
// Initialization happens in waitForSupabase callback when Supabase library loads
