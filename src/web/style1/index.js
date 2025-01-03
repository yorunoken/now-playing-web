const PORT = 4000;

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const currentDuration = document.getElementById("curr-duration");
const songDuration = document.getElementById("song-duration");
const albumArt = document.getElementById("album-art");
const progressBar = document.getElementById("progress");
const pauseOverlay = document.getElementById("pause-overlay");

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function progressBarUpdate(currTime, totalTime) {
    const progressPercentage = (currTime / totalTime) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    currentDuration.innerText = formatTime(currTime);
    songDuration.innerText = formatTime(totalTime);
}

async function refresh() {
    const spotify = await fetch(`http://localhost:${PORT}/api/currently-playing`, {
        method: "GET",
    }).then((res) => res.json());

    const { item } = spotify;
    const currentPosition = spotify.progress_ms;
    const totalDuration = item.duration_ms;
    const isPlaying = spotify.is_playing;
    const albumSrc = item.album.images[0].url;

    title.innerText = item.name || "-";
    artist.innerText = item.artists[0].name || "-";
    albumArt.src = `http://localhost:${PORT}/api/album-art?url=${albumSrc}`;

    if (isPlaying) {
        pauseOverlay.classList.add("hidden");
    } else {
        pauseOverlay.classList.remove("hidden");
    }

    progressBarUpdate(currentPosition, totalDuration);
}

refresh();
setInterval(refresh, 1000);
