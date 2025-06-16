/**
 * Cloudflare Worker for HTTP Basic Authentication
 * Protects the entire VitePress documentation site
 */

const REALM = "RTYI Documentary";

// Paths that should be publicly accessible without authentication
const ALLOWED_PATHS = [
  "/health",
  "/ping",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-dark.svg",
  "/favicon-light.svg",
  "/apple-touch-icon.png",
];

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    // Skip auth for allowed paths (health checks, monitoring, and assets)
    if (ALLOWED_PATHS.includes(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    if (!validateCredentials(request, env)) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": `Basic realm="${REALM}"`,
          "Content-Type": "text/plain",
        },
      });
    }

    // Forward the request to static assets
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

function validateCredentials(request: Request, env: Env): boolean {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return false;
  }

  try {
    const credentials = globalThis.atob(authHeader.slice(6));
    const [username, password] = credentials.split(":");

    const expectedUsername = env.AUTH_USERNAME || "admin";
    const expectedPassword = env.AUTH_PASSWORD || "password";

    return username === expectedUsername && password === expectedPassword;
  } catch {
    return false;
  }
}
