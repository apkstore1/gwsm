export type Org = {
  id: string;
  name: string;
  admin: string;
  seats: number;
  plan: "Starter" | "Business" | "Enterprise";
  domains: number;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  org: string;
  license: "Starter" | "Business" | "Enterprise";
  status: "Active" | "Suspended";
  storage: string;
};

export type DomainRow = {
  id: string;
  domain: string;
  org: string;
  status: "Verified" | "Pending MX" | "Action needed";
  mailboxes: number;
};

export const organizations: Org[] = [
  { id: "o1", name: "Alpha Logistics", admin: "dana.ruiz@alphalogistics.com", seats: 42, plan: "Business", domains: 2 },
  { id: "o2", name: "Nova Digital", admin: "john@novadigital.io", seats: 18, plan: "Starter", domains: 1 },
  { id: "o3", name: "Apex Health", admin: "m.okafor@apexhealth.co", seats: 96, plan: "Enterprise", domains: 1 },
];

export const users: UserRow[] = [
  { id: "u1", name: "Dana Ruiz", email: "dana.ruiz@alphalogistics.com", org: "Alpha Logistics", license: "Business", status: "Active", storage: "14.2 GB" },
  { id: "u2", name: "Peter Lang", email: "peter.lang@alphalogistics.com", org: "Alpha Logistics", license: "Business", status: "Active", storage: "6.8 GB" },
  { id: "u3", name: "John Mercer", email: "john@novadigital.io", org: "Nova Digital", license: "Starter", status: "Active", storage: "3.1 GB" },
  { id: "u4", name: "Sara Bellini", email: "sara@novadigital.io", org: "Nova Digital", license: "Starter", status: "Suspended", storage: "1.4 GB" },
  { id: "u5", name: "Michael Okafor", email: "m.okafor@apexhealth.co", org: "Apex Health", license: "Enterprise", status: "Active", storage: "38.6 GB" },
];

export const domains: DomainRow[] = [
  { id: "d1", domain: "alphalogistics.com", org: "Alpha Logistics", status: "Verified", mailboxes: 34 },
  { id: "d2", domain: "alpha-freight.net", org: "Alpha Logistics", status: "Pending MX", mailboxes: 8 },
  { id: "d3", domain: "novadigital.io", org: "Nova Digital", status: "Verified", mailboxes: 18 },
  { id: "d4", domain: "apexhealth.co", org: "Apex Health", status: "Action needed", mailboxes: 96 },
];

export const revenueData = [
  { month: "Feb", revenue: 12400, licenses: 108 },
  { month: "Mar", revenue: 13950, licenses: 116 },
  { month: "Apr", revenue: 13120, licenses: 121 },
  { month: "May", revenue: 15870, licenses: 134 },
  { month: "Jun", revenue: 17240, licenses: 142 },
  { month: "Jul", revenue: 18630, licenses: 156 },
];

export const activity = [
  { text: "Password reset for user john@novadigital.io", time: "2 mins ago" },
  { text: "Domain apexhealth.co flagged: SPF record missing", time: "26 mins ago" },
  { text: "12 licenses provisioned for Apex Health", time: "1 hour ago" },
  { text: "Invoice #INV-2481 issued to Alpha Logistics", time: "Yesterday" },
];

export type Forwarder = {
  id: string;
  source: string;
  destination: string;
  org: string;
  keepCopy: boolean;
  active: boolean;
};

export type EmailAccount = {
  id: string;
  address: string;
  org: string;
  type: "Mailbox" | "Alias" | "Group";
  quota: string;
  used: string;
  status: "Active" | "Suspended";
};

export type AppRow = {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  seats: number;
};

export type AuditLog = {
  id: string;
  action: string;
  target: string;
  actor: string;
  time: string;
  status: "Success" | "Warning" | "Failed";
};

export type SecurityAlert = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Medium" | "Low";
  resolved: boolean;
};

export const forwarders: Forwarder[] = [
  { id: "f1", source: "sales@alphalogistics.com", destination: "dana.ruiz@alphalogistics.com", org: "Alpha Logistics", keepCopy: true, active: true },
  { id: "f2", source: "info@novadigital.io", destination: "john@novadigital.io", org: "Nova Digital", keepCopy: false, active: true },
  { id: "f3", source: "billing@apexhealth.co", destination: "m.okafor@apexhealth.co", org: "Apex Health", keepCopy: true, active: false },
];

export const emailAccounts: EmailAccount[] = [
  { id: "e1", address: "dana.ruiz@alphalogistics.com", org: "Alpha Logistics", type: "Mailbox", quota: "30 GB", used: "14.2 GB", status: "Active" },
  { id: "e2", address: "dispatch@alphalogistics.com", org: "Alpha Logistics", type: "Group", quota: "50 GB", used: "22.9 GB", status: "Active" },
  { id: "e3", address: "hello@novadigital.io", org: "Nova Digital", type: "Alias", quota: "15 GB", used: "0.4 GB", status: "Active" },
  { id: "e4", address: "m.okafor@apexhealth.co", org: "Apex Health", type: "Mailbox", quota: "100 GB", used: "38.6 GB", status: "Active" },
  { id: "e5", address: "old.intake@apexhealth.co", org: "Apex Health", type: "Mailbox", quota: "30 GB", used: "9.1 GB", status: "Suspended" },
];

export const apps: AppRow[] = [
  { id: "a1", name: "Mail", category: "Communication", enabled: true, seats: 156 },
  { id: "a2", name: "Drive Storage", category: "Productivity", enabled: true, seats: 156 },
  { id: "a3", name: "Meet Video", category: "Communication", enabled: true, seats: 120 },
  { id: "a4", name: "Shared Calendar", category: "Productivity", enabled: true, seats: 156 },
  { id: "a5", name: "Vault Archiving", category: "Compliance", enabled: false, seats: 0 },
  { id: "a6", name: "Mobile Device Manager", category: "Security", enabled: true, seats: 84 },
];

export const auditLogs: AuditLog[] = [
  { id: "l1", action: "User created", target: "peter.lang@alphalogistics.com", actor: "Ana Reyes", time: "Aug 3, 09:42 AM", status: "Success" },
  { id: "l2", action: "Domain added", target: "alpha-freight.net", actor: "Ana Reyes", time: "Aug 2, 04:18 PM", status: "Warning" },
  { id: "l3", action: "License upgraded", target: "Apex Health", actor: "System", time: "Aug 1, 11:05 AM", status: "Success" },
  { id: "l4", action: "Password reset", target: "john@novadigital.io", actor: "Ana Reyes", time: "Jul 31, 02:33 PM", status: "Success" },
  { id: "l5", action: "MX verification", target: "apexhealth.co", actor: "System", time: "Jul 30, 08:12 AM", status: "Failed" },
];

export const securityAlerts: SecurityAlert[] = [
  { id: "s1", title: "SPF record missing", detail: "apexhealth.co has no SPF record published.", severity: "Critical", resolved: false },
  { id: "s2", title: "Suspicious sign-in", detail: "Login from a new location for sara@novadigital.io.", severity: "Medium", resolved: false },
  { id: "s3", title: "2-step verification off", detail: "4 users have not enrolled in 2SV.", severity: "Medium", resolved: false },
  { id: "s4", title: "Weak password policy", detail: "Minimum length below recommended 12 characters.", severity: "Low", resolved: true },
];
