export type PrincipalRole =
  | "OWNER"
  | "MANAGER"
  | "STAFF";

export interface AuthenticatedPrincipal {
  userId: string;
  businessId: string;
  role: PrincipalRole;
}