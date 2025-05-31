/**
 * Cloudflare Pages middleware for HTTP Basic Authentication
 * Protects the entire VitePress documentation site
 */

interface Env {
  AUTH_USERNAME?: string;
  AUTH_PASSWORD?: string;
}

const REALM = "RTYI Documentation";

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;

  // Skip auth for health checks and monitoring
  const url = new URL(request.url);
  if (url.pathname === "/health" || url.pathname === "/ping") {
    return next();
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

  return next();
};

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
