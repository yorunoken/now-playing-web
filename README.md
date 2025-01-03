# NowPlayingWeb - Spotify Now Playing Display

A minimal web display that shows your currently playing Spotify track with real-time updates, including album art, song title, artist, and progress bar.

## Prerequisites

- [Bun](https://bun.sh) runtime installed
- Spotify Premium account
- Spotify Developer App credentials

## Setup

1. Install Bun if you haven't already:
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Clone the repository and install dependencies:
```bash
git clone https://github.com/yorunoken/now-playing-web
cd now-playing-web
bun install
```

3. Create a Spotify Developer Application:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create an App"
   - Fill in the app name and description
   - Once created, note down your Client ID and Client Secret
   - Click "Edit Settings"
   - Add `http://localhost:4000/callback` to the Redirect URIs
   - Save changes

4. Create a `.env` file in the root directory with the following:
```env
PORT=4000
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:4000/callback
```

## Running the Application

1. Start the server:
```bash
bun run src/index.ts
# or
bun dev
```

2. Visit `http://localhost:4000` in your browser

3. You'll be redirected to Spotify's login page if you haven't authenticated, or if you're not, visit `http://localhost:4000/login`
   - Log in with your Spotify account
   - Approve the permissions requested
   - You'll be redirected back to the app

4. The display will now show your current Spotify playback status with real-time updates

## Troubleshooting

If you encounter any issues:

1. Make sure your Spotify account is Premium
2. Verify your Client ID and Client Secret are correct
3. Ensure the redirect URI matches exactly in both your .env file and Spotify Dashboard
4. Check that you're actively playing something on Spotify
5. Try logging out and back in if the authentication seems stuck
