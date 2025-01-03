import { serve } from "bun";
import type { SpotifyState } from "./types";
import { Spotify } from "./auth";

const PORT = process.env.PORT;
const key = process.env.SPOTIFY_KEY;

Spotify.initialize();

serve({
    port: PORT,
    async fetch(request) {
        const { method } = request;
        const { pathname, searchParams } = new URL(request.url);

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (method === "OPTIONS") {
            return new Response(null, {
                headers: corsHeaders,
            });
        }

        if (method === "GET" && pathname === "/login") {
            const authUrl = Spotify.getAuthUrl();
            return Response.redirect(authUrl);
        }

        if (method === "GET" && pathname === "/callback") {
            const code = searchParams.get("code");
            if (!code) {
                return new Response("Missing code parameter", { status: 400 });
            }

            try {
                await Spotify.getToken(code);
                return Response.redirect("/");
            } catch (error) {
                return new Response("Authentication failed", { status: 500 });
            }
        }

        if (method === "GET" && pathname === "/api/currently-playing") {
            try {
                const data = await Spotify.getMePlaying();
                if (!data) {
                    console.log({ error: "No track playing" });
                    return new Response(JSON.stringify({ error: "No track playing" }), {
                        status: 204,
                        headers: { "Content-Type": "application/json" },
                    });
                }

                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error: any) {
                if (error.message.includes("User needs to authenticate")) {
                    return Response.redirect("/login");
                }
                return new Response(JSON.stringify({ error: "Failed to fetch current track" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
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

        const style = searchParams.get("style") ?? "1";

        if (pathname === "/") {
            const file = Bun.file(import.meta.dir + `/web/style${style}/index.html`);
            return new Response(file, {
                headers: {
                    "Content-Type": "text/html",
                    ...corsHeaders,
                },
            });
        }

        const styleMatch = pathname.match(/^\/(style\d+)(\/.*)?$/);
        if (styleMatch) {
            const styleDir = styleMatch[1];
            const filePath = import.meta.dir + `/web/${styleDir}` + (styleMatch[2] || "/index.html");
            try {
                const file = Bun.file(filePath);
                if (await file.exists()) {
                    const contentType = filePath.endsWith(".css") ? "text/css" : filePath.endsWith(".js") ? "application/javascript" : "text/html";

                    return new Response(file, {
                        headers: {
                            "Content-Type": contentType,
                            ...corsHeaders,
                        },
                    });
                }
            } catch (error) {
                console.error("Error serving static file:", error);
            }
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Listening on http://localhost:${PORT} ...`);
