import "dotenv/config";
import { env } from "./config/env.js";
import { createHttpApp } from "./transport/http.js";

const app = createHttpApp();

const server = app.listen(
  env.PORT,
  env.HOST,
  () => {
    console.log(
      `TapQR AgentOS MCP server listening on http://${env.HOST}:${env.PORT}`
    );

    console.log(
      `MCP endpoint: http://${env.HOST}:${env.PORT}/mcp`
    );

    console.log(
      `Health endpoint: http://${env.HOST}:${env.PORT}/health`
    );

    console.log(
      `TapQR API: ${env.TAPQR_API_BASE_URL}`
    );

    console.log(
      `Environment: ${env.NODE_ENV}`
    );
  }
);

function shutdown(signal: string): void {
  console.log(
    `Received ${signal}. Shutting down...`
  );

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