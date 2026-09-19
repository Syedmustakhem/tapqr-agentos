import {
  AgentOsError,
  type AgentOsErrorCode
} from "./agentos-error.js";

export interface AgentOsErrorResponse {
  error: {
    code: AgentOsErrorCode;
    message: string;
  };
}

export function toErrorResponse(
  error: unknown
): AgentOsErrorResponse {
  if (error instanceof AgentOsError) {
    return {
      error: {
        code: error.code,
        message: error.message
      }
    };
  }

  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal AgentOS error."
    }
  };
}