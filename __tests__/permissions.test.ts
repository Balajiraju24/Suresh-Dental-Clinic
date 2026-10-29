import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasPermission,
  canAccessStaffRoute,
} from "../lib/auth/permissions";

describe("Role-Based Access Control (RBAC) Matrix", () => {
  it("Administrator possesses all permissions", () => {
    assert.equal(hasPermission("administrator", "appointments:view"), true);
    assert.equal(hasPermission("administrator", "appointments:create"), true);
    assert.equal(hasPermission("administrator", "patients:clinical_notes"), true);
    assert.equal(hasPermission("administrator", "billing:reports"), true);
    assert.equal(hasPermission("administrator", "team:manage"), true);
    assert.equal(hasPermission("administrator", "settings:manage"), true);
    assert.equal(hasPermission("administrator", "audit:view"), true);
  });

  it("Receptionist permissions conform strictly to front desk requirements", () => {
    // Permitted
    assert.equal(hasPermission("receptionist", "appointments:view"), true);
    assert.equal(hasPermission("receptionist", "appointments:create"), true);
    assert.equal(hasPermission("receptionist", "appointments:checkin"), true);
    assert.equal(hasPermission("receptionist", "patients:create"), true);
    assert.equal(hasPermission("receptionist", "billing:create"), true);
    assert.equal(hasPermission("receptionist", "billing:record_payment"), true);

    // Strictly Denied
    assert.equal(hasPermission("receptionist", "patients:clinical_notes"), false);
    assert.equal(hasPermission("receptionist", "team:manage"), false);
    assert.equal(hasPermission("receptionist", "settings:manage"), false);
    assert.equal(hasPermission("receptionist", "audit:view"), false);
    assert.equal(hasPermission("receptionist", "billing:reports"), false);
  });

  it("Dentist permissions enforce clinical scope and restrict admin/invoicing", () => {
    // Permitted
    assert.equal(hasPermission("dentist", "appointments:view"), true);
    assert.equal(hasPermission("dentist", "appointments:checkin"), true);
    assert.equal(hasPermission("dentist", "patients:view"), true);
    assert.equal(hasPermission("dentist", "patients:clinical_notes"), true);
    assert.equal(hasPermission("dentist", "billing:view"), true);

    // Strictly Denied
    assert.equal(hasPermission("dentist", "billing:create"), false);
    assert.equal(hasPermission("dentist", "billing:record_payment"), false);
    assert.equal(hasPermission("dentist", "team:manage"), false);
    assert.equal(hasPermission("dentist", "settings:manage"), false);
    assert.equal(hasPermission("dentist", "audit:view"), false);
  });

  it("Accounts role permissions are limited to financial reconciliation and reports", () => {
    // Permitted
    assert.equal(hasPermission("accounts", "billing:view"), true);
    assert.equal(hasPermission("accounts", "billing:create"), true);
    assert.equal(hasPermission("accounts", "billing:record_payment"), true);
    assert.equal(hasPermission("accounts", "billing:reports"), true);
    assert.equal(hasPermission("accounts", "appointments:view"), true);

    // Strictly Denied
    assert.equal(hasPermission("accounts", "patients:clinical_notes"), false);
    assert.equal(hasPermission("accounts", "patients:create"), false);
    assert.equal(hasPermission("accounts", "team:manage"), false);
    assert.equal(hasPermission("accounts", "settings:manage"), false);
  });

  it("Default deny behavior for null or undefined roles", () => {
    assert.equal(hasPermission(null, "appointments:view"), false);
    assert.equal(hasPermission(undefined, "patients:view"), false);
    assert.equal(canAccessStaffRoute(null, "/staff/dashboard"), false);
    assert.equal(canAccessStaffRoute(undefined, "/staff/appointments"), false);
  });

  it("Staff Route authorization guards correctly evaluate paths", () => {
    // Dashboard accessible to all valid staff roles
    assert.equal(canAccessStaffRoute("administrator", "/staff/dashboard"), true);
    assert.equal(canAccessStaffRoute("receptionist", "/staff/dashboard"), true);
    assert.equal(canAccessStaffRoute("dentist", "/staff/dashboard"), true);
    assert.equal(canAccessStaffRoute("accounts", "/staff/dashboard"), true);

    // Team management restricted to administrator
    assert.equal(canAccessStaffRoute("administrator", "/staff/team"), true);
    assert.equal(canAccessStaffRoute("receptionist", "/staff/team"), false);
    assert.equal(canAccessStaffRoute("dentist", "/staff/team"), false);
    assert.equal(canAccessStaffRoute("accounts", "/staff/team"), false);

    // Settings restricted to administrator
    assert.equal(canAccessStaffRoute("administrator", "/staff/settings"), true);
    assert.equal(canAccessStaffRoute("receptionist", "/staff/settings"), false);
    assert.equal(canAccessStaffRoute("dentist", "/staff/settings"), false);
    assert.equal(canAccessStaffRoute("accounts", "/staff/settings"), false);

    // Financial Reports restricted to Administrator & Accounts
    assert.equal(canAccessStaffRoute("administrator", "/staff/reports"), true);
    assert.equal(canAccessStaffRoute("accounts", "/staff/reports"), true);
    assert.equal(canAccessStaffRoute("receptionist", "/staff/reports"), false);
    assert.equal(canAccessStaffRoute("dentist", "/staff/reports"), false);
  });
});
