// ─── SPOTIFY WEB PLAYBACK INTEGRATION ───────────────────────────────

const SPOTIFY_CONFIG = {
  clientId: '4cd6c592ad394233b043af5d435d8357',
  redirectUri: 'https://dayflow-six-phi.vercel.app/callback',
  scopes: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-library-read'
  ]
};

let spotifyAccessToken = null;
let spotifyPlayerReady = false;
let spotifyPlayer = null;
let currentTrack = null;

// ─── GET SPOTIFY ACCESS TOKEN ───────────────────────────────────────
function getSpotifyAuthUrl() {
  const scope = SPOTIFY_CONFIG.scopes.join('%20');
  return `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CONFIG.clientId}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.redirectUri)}&scope=${scope}`;
}

// ─── HANDLE SPOTIFY CALLBACK ────────────────────────────────────────
async function handleSpotifyCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const error = params.get('error');

  if (error) {
    console.error('Spotify auth error:', error);
    showToast('Spotify connection cancelled', 'error', 'fa-exclamation-circle');
    setTimeout(() => window.location.href = '/', 2000);
    return;
  }

  if (!code) return;

  try {
    console.log('🔄 Exchanging Spotify auth code for token...');

    // Call Vercel serverless function to exchange code for token
    const response = await fetch('/api/spotify-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Token exchange failed');
    }

    const data = await response.json();
    spotifyAccessToken = data.access_token;
    localStorage.setItem('spotifyToken', spotifyAccessToken);
    console.log('✅ Spotify token received!');

    // Clean URL and show app
    window.history.replaceState({}, document.title, '/');
    location.reload();
  } catch (err) {
    console.error('Spotify callback error:', err);
    showToast('Failed to connect Spotify: ' + err.message, 'error', 'fa-exclamation-circle');
    setTimeout(() => window.location.href = '/', 2000);
  }
}

// ─── CHECK FOR SAVED TOKEN ─────────────────────────────────────────
function initSpotifyAuth() {
  spotifyAccessToken = localStorage.getItem('spotifyToken');

  if (!spotifyAccessToken) {
    showSpotifyLogin();
  } else {
    initSpotifyPlayer();
  }
}

// ─── SHOW LOGIN BUTTON ──────────────────────────────────────────────
function showSpotifyLogin() {
  const widget = document.querySelector('.music-widget');
  if (!widget) return;

  widget.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <p style="color: var(--muted); margin-bottom: 12px;">Connect Spotify to play music</p>
      <a href="${getSpotifyAuthUrl()}" class="add-btn" style="display: inline-block; text-decoration: none;">
        <i class="fab fa-spotify"></i> Connect Spotify
      </a>
    </div>
  `;
}

// ─── INIT SPOTIFY PLAYER ───────────────────────────────────────────
function initSpotifyPlayer() {
  if (!spotifyAccessToken) return;

  // Load Spotify Web Playback SDK
  const script = document.createElement('script');
  script.src = 'https://sdk.scdn.spotifycdn.com/spotify-player.js';
  document.head.appendChild(script);

  // Window callback for when SDK is ready
  window.onSpotifyWebPlaybackSDKReady = () => {
    spotifyPlayer = new Spotify.Player({
      name: 'DayFlow',
      getOAuthToken: callback => callback(spotifyAccessToken),
      volume: 0.5
    });

    // Ready event
    spotifyPlayer.addListener('ready', ({ device_id }) => {
      spotifyPlayerReady = true;
      console.log('✅ Spotify player ready. Device ID:', device_id);
      renderSpotifyPlayer();
    });

    // Player state changed
    spotifyPlayer.addListener('player_state_changed', state => {
      if (state) {
        currentTrack = state.track_window.current_track;
        updateSpotifyDisplay(state);
      }
    });

    // Error handling
    spotifyPlayer.addListener('authentication_error', ({ message }) => {
      console.error('Auth error:', message);
      spotifyAccessToken = null;
      localStorage.removeItem('spotifyToken');
      showSpotifyLogin();
    });

    spotifyPlayer.addListener('account_error', ({ message }) => {
      console.error('Account error:', message);
    });

    spotifyPlayer.connect();
  };
}

// ─── RENDER SPOTIFY PLAYER UI ──────────────────────────────────────
function renderSpotifyPlayer() {
  const widget = document.querySelector('.music-widget');
  if (!widget) return;

  widget.innerHTML = `
    <div style="display: flex; gap: 12px;">
      <input
        type="text"
        id="spotifySearch"
        placeholder="Search songs..."
        class="add-input"
        style="flex: 1; margin: 0;"
      />
      <button onclick="searchSpotifyTrack()" class="music-btn" style="padding: 10px 14px;">
        <i class="fas fa-search"></i>
      </button>
    </div>
    <div id="spotifyNowPlaying" style="margin-top: 12px; padding: 12px; background: var(--surface2); border-radius: 8px; text-align: center;">
      <div style="font-size: 0.75rem; color: var(--muted); text-transform: uppercase;">Now Playing</div>
      <div id="trackName" style="font-size: 0.9rem; font-weight: 600; margin-top: 4px;">No track</div>
      <div id="trackArtist" style="font-size: 0.8rem; color: var(--muted); margin-top: 2px;">-</div>
    </div>
    <div style="display: flex; gap: 8px; margin-top: 12px;">
      <button onclick="spotifyPrevious()" class="music-btn" style="flex: 1;">
        <i class="fas fa-step-backward"></i>
      </button>
      <button id="spotifyPlayBtn" onclick="spotifyPlayPause()" class="music-btn" style="flex: 1;">
        <i class="fas fa-play"></i>
      </button>
      <button onclick="spotifyNext()" class="music-btn" style="flex: 1;">
        <i class="fas fa-step-forward"></i>
      </button>
      <button onclick="spotifyLogout()" class="music-btn" style="flex: 1; background: var(--danger);">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  `;

  document.getElementById('spotifySearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchSpotifyTrack();
  });
}

// ─── UPDATE NOW PLAYING DISPLAY ────────────────────────────────────
function updateSpotifyDisplay(state) {
  if (!state) return;

  const track = state.track_window.current_track;
  const isPlaying = !state.paused;

  if (track) {
    document.getElementById('trackName').textContent = track.name;
    document.getElementById('trackArtist').textContent = track.artists.map(a => a.name).join(', ');
  }

  const playBtn = document.getElementById('spotifyPlayBtn');
  if (playBtn) {
    playBtn.innerHTML = isPlaying
      ? '<i class="fas fa-pause"></i>'
      : '<i class="fas fa-play"></i>';
  }
}

// ─── SEARCH SPOTIFY TRACK ──────────────────────────────────────────
async function searchSpotifyTrack() {
  const query = document.getElementById('spotifySearch').value.trim();
  if (!query) return;

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`
        }
      }
    );

    const data = await response.json();
    const track = data.tracks.items[0];

    if (track) {
      await spotifyPlayTrack(track.uri);
      document.getElementById('spotifySearch').value = '';
    } else {
      showToast('Track not found', 'error', 'fa-exclamation-circle');
    }
  } catch (err) {
    console.error('Search error:', err);
    showToast('Search failed', 'error', 'fa-exclamation-circle');
  }
}

// ─── PLAY SPECIFIC TRACK ───────────────────────────────────────────
async function spotifyPlayTrack(trackUri) {
  if (!spotifyPlayerReady || !spotifyAccessToken) return;

  try {
    // Get device ID first
    const devicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { 'Authorization': `Bearer ${spotifyAccessToken}` }
    });

    const devicesData = await devicesResponse.json();
    const activeDevice = devicesData.devices.find(d => d.is_active) || devicesData.devices[0];

    if (!activeDevice) {
      showToast('No Spotify device found. Open Spotify somewhere.', 'error', 'fa-exclamation-circle');
      return;
    }

    // Play track
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${activeDevice.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${spotifyAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: [trackUri] })
    });

    showToast('Playing track!', 'success', 'fa-play');
  } catch (err) {
    console.error('Play error:', err);
    showToast('Could not play track', 'error', 'fa-exclamation-circle');
  }
}

// ─── PLAYBACK CONTROLS ─────────────────────────────────────────────
function spotifyPlayPause() {
  if (!spotifyPlayer) return;
  spotifyPlayer.togglePlay();
}

function spotifyNext() {
  if (!spotifyPlayer) return;
  spotifyPlayer.nextTrack();
}

function spotifyPrevious() {
  if (!spotifyPlayer) return;
  spotifyPlayer.previousTrack();
}

// ─── LOGOUT ────────────────────────────────────────────────────────
function spotifyLogout() {
  spotifyAccessToken = null;
  localStorage.removeItem('spotifyToken');
  if (spotifyPlayer) spotifyPlayer.disconnect();
  showSpotifyLogin();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  const code = new URLSearchParams(window.location.search).get('code');

  if (code) {
    // We have auth code - exchange it for token
    handleSpotifyCallback();
  } else {
    // Normal app initialization
    initSpotifyAuth();
  }
});
