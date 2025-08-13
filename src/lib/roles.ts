export type AppRole = "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN";

export const ROLES = {
  USER: "USER",
  STAFF: "STAFF",
  COORD: "COORD",
  CONCELHO: "CONCELHO",
  ADMIN: "ADMIN",
} as const satisfies Record<AppRole, AppRole>;

export const ROLE_ORDER: AppRole[] = [
  ROLES.USER,
  ROLES.STAFF,
  ROLES.COORD,
  ROLES.CONCELHO,
  ROLES.ADMIN,
];

export function isRole(value: unknown): value is AppRole {
  return typeof value === "string" && (Object.values(ROLES) as string[]).includes(value);
}

export function hasAtLeastRole(userRole: AppRole, requiredRole: AppRole): boolean {
  const userIndex = ROLE_ORDER.indexOf(userRole);
  const requiredIndex = ROLE_ORDER.indexOf(requiredRole);
  return userIndex >= requiredIndex;
}

export function canAccess(userRole: AppRole, allowedRoles: AppRole[]): boolean {
  return allowedRoles.includes(userRole);
}


