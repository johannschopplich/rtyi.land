/**
 * Cloudflare Worker for HTTP Basic Authentication
 * Protects the entire VitePress documentation site
 */

const REALM = "RTYI Documentary";
const PROTECTED_PATHS = ["/drafts", "/streams"];

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    // Check if the path requires authentication
    const requiresAuth = PROTECTED_PATHS.some(
      (path) => url.pathname === path || url.pathname.startsWith(`${path}/`),
    );

    if (requiresAuth && !validateCredentials(request, env)) {
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
