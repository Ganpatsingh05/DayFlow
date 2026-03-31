export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({ error: 'Spotify credentials not configured' });
  }

  try {
    // Exchange authorization code for access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      }).toString()
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Spotify token error:', data);
      return res.status(response.status).json({ error: data.error_description || 'Failed to get token' });
    }

    // Return token to frontend
    return res.status(200).json({
      access_token: data.access_token,
      expires_in: data.expires_in
    });
  } catch (error) {
    console.error('Spotify callback error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
