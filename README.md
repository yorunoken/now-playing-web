# NowPlayingWeb - Spotify Now Playing Display

A minimal web display that shows your currently playing Spotify track with real-time updates, including album art, song title, artist, and progress bar.

## Prerequisites

- [Bun](https://bun.sh) runtime installed
- Spotify Premium account
- Spotify API access token

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

3. Edit your `.env` file in the root directory with the following:
```env
PORT=4000
SPOTIFY_KEY=your_spotify_access_token
```

### Getting a Spotify Access Token

1. Open your web browser
2. Open your devtools
3. Navigate to https://open.spotify.com
4. Check your networks tab for any requests made, and check if they have `Bearer {key}` in their headers, if so, that's your key

## Running the Application

Start the server:
```bash
bun run src/index.ts
# or
bun dev
```

Visit `http://localhost:4000` in your browser to see your current Spotify playback status.
