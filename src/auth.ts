import type { SpotifyState } from "./types";

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
}

export class Spotify {
    private static token: string | null = null;
    private static refreshToken: string | null = null;
    private static tokenExpiry: number = 0;

    static getAuthUrl(): string {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.REDIRECT_URI;
        const scope = ["user-read-currently-playing", "user-read-playback-state"].join(" ");

        const params = new URLSearchParams({
            response_type: "code",
            client_id: clientId!,
            scope: scope,
            redirect_uri: redirectUri!,
        });

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    private static async getNewToken(code?: string): Promise<string> {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirectUri = process.env.REDIRECT_URI;

        if (!clientId || !clientSecret) {
            throw new Error("Missing Spotify Credentials.");
        }

        const params = code
            ? {
                  grant_type: "authorization_code",
                  code: code,
                  redirect_uri: redirectUri,
              }
            : {
                  grant_type: "refresh_token",
                  refresh_token: this.refreshToken!,
              };

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
            },
            body: new URLSearchParams(params as any).toString(),
        });

        const data: SpotifyTokenResponse = await response.json();

        this.token = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

        if (data.refresh_token) {
            this.refreshToken = data.refresh_token;
        }

        return data.access_token;
    }

    static async getToken(code?: string): Promise<string> {
        if (code) {
            return await this.getNewToken(code);
        }

        if (!this.token || Date.now() >= this.tokenExpiry) {
            if (!this.refreshToken) {
                throw new Error("No refresh token available. User needs to authenticate.");
            }
            console.log("Refreshing token...");
            return await this.getNewToken();
        }

        return this.token;
    }

    static async getMePlaying() {
        const token = await this.getToken();

        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 204) {
            return null;
        }

        const data: SpotifyState = await response.json();
        return data;
    }
}
