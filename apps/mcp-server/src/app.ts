import { createHttpApp } from "./transport/http.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "127.0.0.1";

const app = createHttpApp();

const server = app.listen(PORT, HOST, () => {
  console.log(
    `TapQR AgentOS MCP server listening on http://${HOST}:${PORT}`
  );

  console.log(`MCP endpoint: http://${HOST}:${PORT}/mcp`);
  console.log(`Health endpoint: http://${HOST}:${PORT}/health`);
});

function shutdown(signal: string): void {
  console.log(`Received ${signal}. Shutting down...`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});