import express, {
  type Express,
  type Request,
  type Response
} from "express";
import { randomUUID } from "node:crypto";

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

import { createMcpServer } from "../server.js";

interface McpSession {
  server: ReturnType<typeof createMcpServer>;
  transport: StreamableHTTPServerTransport;
}

const sessions = new Map<string, McpSession>();

export function createHttpApp(): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      service: "tapqr-agentos-mcp-server"
    });
  });

  app.all("/mcp", async (req: Request, res: Response) => {
    try {
      const sessionId = req.headers["mcp-session-id"] as
        | string
        | undefined;

      if (sessionId) {
        const session = sessions.get(sessionId);

        if (!session) {
          res.status(404).json({
            error: "MCP session not found"
          });
          return;
        }

        await session.transport.handleRequest(req, res, req.body);
        return;
      }

      if (req.method !== "POST") {
        res.status(400).json({
          error: "MCP initialization must use POST"
        });
        return;
      }

      if (!isInitializeRequest(req.body)) {
        res.status(400).json({
          error: "Expected an MCP initialize request"
        });
        return;
      }

      const server = createMcpServer();

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newSessionId) => {
          sessions.set(newSessionId, {
            server,
            transport
          });
        }
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          sessions.delete(transport.sessionId);
        }
      };

      transport.onerror = (error) => {
        console.error("MCP transport error:", error);
      };

      /*
       * The v1 MCP SDK transport types are slightly stricter than the
       * runtime implementation when exactOptionalPropertyTypes is enabled.
       *
       * Keep the compatibility boundary isolated here rather than weakening
       * strict TypeScript checking across the application.
       */
      await server.connect(
        transport as unknown as Parameters<typeof server.connect>[0]
      );

      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("MCP request handling error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          error: "Internal MCP server error"
        });
      }
    }
  });

  return app;
}