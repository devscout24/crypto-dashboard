import { io } from "socket.io-client";

// Resolve Socket URL
// Prefer same-origin in production (behind Nginx proxy for /socket.io)
const socketUrl = (() => {
  if (import.meta.env.PROD && typeof window !== "undefined") {
    return window.location.origin;
  }
  const fromEnv = import.meta.env.VITE_APP_SOCKET_URL as string | undefined;
  if (fromEnv) return fromEnv;
  const fromApi = import.meta.env.VITE_APP_API_URL as string | undefined;
  if (fromApi) return new URL(fromApi).origin;
  return typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5050";
})();

// Create a single shared Socket.IO client instance
export const socket = io(socketUrl, {
  // Be strict in dev to avoid proxy/polling issues
  transports: import.meta.env.PROD ? ["websocket", "polling"] : ["websocket"],
  path: "/socket.io",
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 60000,
  // Do not force a new connection per consumer
  forceNew: false,
  autoConnect: true,
});

// Helpful during deployment debugging
if (typeof window !== "undefined") {
  console.log("Socket connecting to:", socketUrl);
}

// Extra diagnostics in development
if (!import.meta.env.PROD && typeof window !== "undefined") {
  socket.on("connect", () => console.log("[socket] connected", socket.id));
  socket.on("disconnect", (reason) =>
    console.log("[socket] disconnected", reason)
  );
  socket.on("connect_error", (err) =>
    console.error("[socket] connect_error", err?.message || err)
  );
  socket.on("error", (err) => console.error("[socket] error", err));
}

export default socket;
