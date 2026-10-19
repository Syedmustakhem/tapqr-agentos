import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerAllTools } from "./tools/registry.js";

export class TapQRAgentOS extends McpAgent {
  server = new McpServer({
    name: "tapqr-agentos",
    version: "0.1.0",
  });

  async init() {
    registerAllTools(this.server);
  }
}

export default TapQRAgentOS.serve("/mcp");