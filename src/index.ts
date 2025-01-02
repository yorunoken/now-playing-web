import { serve } from "bun";
import type { SpotifyState } from "./types";

const PORT = process.env.PORT;
const key = process.env.SPOTIFY_KEY;

serve({
    port: PORT,
    async fetch(request) {
        const { method } = request;
        const { pathname, searchParams } = new URL(request.url);

        if (method === "GET" && pathname === "/api/currently-playing") {
            const data: SpotifyState = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
                headers: {
                    authorization: `Bearer ${key}`,
                },
            }).then((res) => res.json());

            return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        if (method === "GET" && pathname === "/api/album-art") {
            const imageUrl = searchParams.get("url");
            if (!imageUrl) {
                return new Response("Missing url parameter", { status: 400 });
            }

            const imageResponse = await fetch(imageUrl);
            const imageBlob = await imageResponse.blob();

            return new Response(imageBlob, {
                status: 200,
                headers: { "Content-Type": imageResponse.headers.get("Content-Type") || "image/jpeg" },
            });
        }

        // const pathUserId = Number(pathname.slice(1));
        if (pathname === "/") {
            return new Response(Bun.file(import.meta.dir + "/web" + "/index.html"));
        }

        const staticFile = Bun.file(import.meta.dir + "/web" + pathname);
        if (await staticFile.exists()) {
            return new Response(staticFile);
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Listening on http://localhost:${PORT} ...`);
