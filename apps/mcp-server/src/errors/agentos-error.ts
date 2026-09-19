export type AgentOsErrorCode =
  | "AUTHENTICATION_FAILED"
  | "AUTHORIZATION_DENIED"
  | "INVALID_INPUT"
  | "RESOURCE_NOT_FOUND"
  | "APPROVAL_REQUIRED"
  | "ACTION_REJECTED"
  | "ACTION_FAILED"
  | "VERIFICATION_FAILED"
  | "UPSTREAM_UNAVAILABLE"
  | "INTERNAL_ERROR";

export class AgentOsError extends Error {
  public readonly code: AgentOsErrorCode;
  public readonly details?: unknown;

  constructor(
    code: AgentOsErrorCode,
    message: string,
    details?: unknown
  ) {
    super(message);

    this.name = "AgentOsError";
    this.code = code;
    this.details = details;
  }
}