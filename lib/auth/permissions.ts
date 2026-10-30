import { Permission, StaffRole } from "@/types/portal";

/**
 * Role-Based Access Control Matrix
 * Strict, typed mapping of Staff Roles to operational permissions.
 * Default is DENY.
 */
export const ROLE_PERMISSIONS: Record<StaffRole, ReadonlySet<Permission>> = {
  administrator: new Set<Permission>([
    "appointments:view",
    "appointments:create",
    "appointments:edit",
    "appointments:cancel",
    "appointments:checkin",
    "patients:view",
    "patients:create",
    "patients:edit",
    "patients:clinical_notes",
    "patients:delete",
    "billing:view",
    "billing:create",
    "billing:record_payment",
    "billing:reports",
    "billing:delete",
    "services:view",
    "services:manage",
    "team:view",
    "team:manage",
    "settings:view",
    "settings:manage",
    "audit:view",
  ]),

  receptionist: new Set<Permission>([
    "appointments:view",
    "appointments:create",
    "appointments:edit",
    "appointments:cancel",
    "appointments:checkin",
    "patients:view",
    "patients:create",
    "patients:edit",
    "billing:view",
    "billing:create",
    "billing:record_payment",
    "services:view",
  ]),

  dentist: new Set<Permission>([
    "appointments:view",
    "appointments:checkin",
    "patients:view",
    "patients:clinical_notes",
    "billing:view",
    "services:view",
  ]),

  accounts: new Set<Permission>([
    "appointments:view",
    "billing:view",
    "billing:create",
    "billing:record_payment",
    "billing:reports",
    "services:view",
  ]),
};

/**
 * Check if a given staff role has a specific permission.
 * Defaults to false (deny) if role or permission is invalid.
 */
export function hasPermission(role: StaffRole | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.has(permission);
}

/**
 * Check if a given staff role has ALL of the specified permissions.
 */
export function hasAllPermissions(role: StaffRole | undefined | null, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a given staff role has AT LEAST ONE of the specified permissions.
 */
export function hasAnyPermission(role: StaffRole | undefined | null, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Route protection requirement mapping
 */
export const ROUTE_PERMISSION_MAP: Record<string, Permission[]> = {
  "/staff/dashboard": ["appointments:view"],
  "/staff/appointments": ["appointments:view"],
  "/staff/patients": ["patients:view"],
  "/staff/billing": ["billing:view"],
  "/staff/services": ["services:view"],
  "/staff/reports": ["billing:reports"],
  "/staff/team": ["team:view"],
  "/staff/settings": ["settings:view"],
};

/**
 * Check if a role can access a staff portal route
 */
export function canAccessStaffRoute(role: StaffRole | undefined | null, pathname: string): boolean {
  if (!role) return false;
  
  // Normalise pathname (strip trailing slash)
  const cleanPath = pathname.replace(/\/$/, "");
  
  // Check exact route matches
  if (ROUTE_PERMISSION_MAP[cleanPath]) {
    return hasAnyPermission(role, ROUTE_PERMISSION_MAP[cleanPath]);
  }
  
  // Check prefix matches
  for (const [routePrefix, requiredPerms] of Object.entries(ROUTE_PERMISSION_MAP)) {
    if (cleanPath.startsWith(routePrefix)) {
      return hasAnyPermission(role, requiredPerms);
    }
  }
  
  // Default deny for unrecognised staff routes
  return false;
}

/**
 * Role display metadata
 */
export interface RoleMeta {
  role: StaffRole;
  label: string;
  badgeClass: string;
  description: string;
}

export const ROLE_METADATA: Record<StaffRole, RoleMeta> = {
  administrator: {
    role: "administrator",
    label: "Administrator",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
    description: "Full clinic management, staff provisioning, financial reporting & audit logging",
  },
  receptionist: {
    role: "receptionist",
    label: "Receptionist",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    description: "Patient registration, appointment scheduling, front-desk check-in & invoicing",
  },
  dentist: {
    role: "dentist",
    label: "Dentist / Surgeon",
    badgeClass: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800",
    description: "Clinical patient care, operatory schedule, treatment records & periodontal charting",
  },
  accounts: {
    role: "accounts",
    label: "Accounts & Billing",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    description: "Financial management, payment reconciliation, balance collection & revenue summaries",
  },
};

