import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  index,
} from "drizzle-orm/pg-core";

// Better Auth Tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("emailVerified").notNull(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").unique().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// App Tables
export const organizations = pgTable(
  "organizations",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    seats: integer("seats").notNull().default(0),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_organizations_userId").on(table.userId),
  })
);

export const domains = pgTable(
  "domains",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    name: text("name").notNull(),
    status: text("status").notNull().default("active"),
    mailboxCount: integer("mailboxCount").notNull().default(0),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_domains_userId").on(table.userId),
  })
);

export const emailAccounts = pgTable(
  "email_accounts",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    address: text("address").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_email_accounts_userId").on(table.userId),
  })
);

export const forwarders = pgTable(
  "forwarders",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    address: text("address").notNull(),
    destination: text("destination").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_forwarders_userId").on(table.userId),
  })
);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_users_userId").on(table.userId),
  })
);

export const settings = pgTable(
  "settings",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull().unique(),
    companyName: text("companyName").default("Workspace Manager"),
    supportEmail: text("supportEmail").default("support@resellerhq.com"),
    billingCurrency: text("billingCurrency").default("USD"),
    autoProvision: boolean("autoProvision").default(true),
    twoFactor: boolean("twoFactor").default(true),
    weeklyDigest: boolean("weeklyDigest").default(false),
    totalClients: integer("totalClients").default(3),
    activeDomains: integer("activeDomains").default(4),
    totalUsers: integer("totalUsers").default(156),
    monthlyRevenue: integer("monthlyRevenue").default(18630),
    accountBalance: numeric("accountBalance", { precision: 10, scale: 2 }).default("4820"),
    autoRechargeAmount: integer("autoRechargeAmount").default(1000),
    starterSeatPrice: numeric("starterSeatPrice", { precision: 5, scale: 2 }).default("6"),
    businessSeatPrice: numeric("businessSeatPrice", { precision: 5, scale: 2 }).default("12"),
    enterpriseSeatPrice: numeric("enterpriseSeatPrice", { precision: 5, scale: 2 }).default("22"),
    starterStorage: text("starterStorage").default("30 GB"),
    businessStorage: text("businessStorage").default("2 TB"),
    enterpriseStorage: text("enterpriseStorage").default("5 TB"),
    starterSupport: text("starterSupport").default("Standard"),
    businessSupport: text("businessSupport").default("Priority"),
    enterpriseSupport: text("enterpriseSupport").default("24/7 dedicated"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_settings_userId").on(table.userId),
  })
);
