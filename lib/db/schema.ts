import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const userRoleEnum = pgEnum("user_role", ["admin", "member"]);
export const storyStatusEnum = pgEnum("story_status", [
  "draft",
  "pending",
  "published",
  "rejected",
]);
export const issueStatusEnum = pgEnum("issue_status", [
  "new",
  "progress",
  "done",
]);
export const issueVisibilityEnum = pgEnum("issue_visibility", [
  "public",
  "hidden",
]);
export const sourceKindEnum = pgEnum("source_kind", [
  "official",
  "verified",
  "public",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "done",
  "progress",
  "planned",
]);
export const infraKindEnum = pgEnum("infra_kind", ["object", "network"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

export const stories = pgTable("stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  body: text("body").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: storyStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  publishedAt: timestamp("published_at", { mode: "date" }),
});

export const issues = pgTable("issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  body: text("body").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: issueStatusEnum("status").notNull().default("new"),
  visibility: issueVisibilityEnum("visibility").notNull().default("public"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Opšti podaci sajta — jedna aktivna konfiguracija. */
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  tagline: text("tagline").notNull(),
  municipality: text("municipality").notNull(),
  canton: text("canton").notNull(),
  settlements: text("settlements").array().notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  elevationM: integer("elevation_m").notNull(),
  locationNote: text("location_note").notNull(),
  danMzMonth: integer("dan_mz_month").notNull(),
  danMzDay: integer("dan_mz_day").notNull(),
  foundedYear: integer("founded_year").notNull(),
  lastNews: text("last_news").notNull(),
  lastNewsHref: text("last_news_href").notNull(),
  sources: text("sources").array().notNull(),
  disclaimer: text("disclaimer").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const siteStats = pgTable("site_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteRoadmap = pgTable("site_roadmap", {
  id: uuid("id").defaultRandom().primaryKey(),
  num: text("num").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  live: boolean("live").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const historijaItems = pgTable("historija_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  year: text("year").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  source: sourceKindEnum("source").notNull(),
  featured: boolean("featured").notNull().default(false),
  detail: text("detail").array().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const demografijaSettings = pgTable("demografija_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  note: text("note").notNull(),
  coverageNote: text("coverage_note").notNull(),
  source: sourceKindEnum("source").notNull(),
  sourceLabel: text("source_label").notNull(),
  males: integer("males").notNull(),
  females: integer("females").notNull(),
  areaKm2: real("area_km2").notNull(),
  total: integer("total").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const demografijaAgeGroups = pgTable("demografija_age_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  value: integer("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const demografijaEthnicity = pgTable("demografija_ethnicity", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  count: integer("count").notNull(),
  pct: text("pct").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const infrastrukturaSettings = pgTable("infrastruktura_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  intro: text("intro").notNull(),
  source: sourceKindEnum("source").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const roads = pgTable("roads", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  km: text("km").notNull(),
  fromPlace: text("from_place").notNull(),
  toPlace: text("to_place").notNull(),
  detail: text("detail").array().notNull().default([]),
  facts: jsonb("facts")
    .$type<{ label: string; value: string }[]>()
    .notNull()
    .default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const infraObjects = pgTable("infra_objects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  chip: text("chip").notNull(),
  kind: infraKindEnum("kind").notNull(),
  detail: text("detail").array().notNull().default([]),
  facts: jsonb("facts")
    .$type<{ label: string; value: string }[]>()
    .notNull()
    .default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const mapaSettings = pgTable("mapa_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  intro: text("intro"),
  centerLat: doublePrecision("center_lat").notNull(),
  centerLng: doublePrecision("center_lng").notNull(),
  zoom: integer("zoom").notNull(),
  path: jsonb("path").$type<[number, number][]>(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const mapaMarkers = pgTable("mapa_markers", {
  id: uuid("id").defaultRandom().primaryKey(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  color: text("color").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  legend: text("legend").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: projectStatusEnum("status").notNull(),
  statusLabel: text("status_label").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  year: text("year").notNull(),
  meta: text("meta").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  tag: text("tag").notNull(),
  name: text("name").notNull(),
  body: text("body").notNull(),
  founded: text("founded").notNull(),
  location: text("location").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  day: text("day").notNull(),
  month: text("month").notNull(),
  title: text("title").notNull(),
  meta: text("meta").notNull(),
  recurring: boolean("recurring").notNull().default(false),
  illustrative: boolean("illustrative").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const dijasporaSettings = pgTable("dijaspora_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  illustrative: boolean("illustrative").notNull().default(true),
  note: text("note").notNull(),
  total: integer("total").notNull(),
  countriesCount: integer("countries_count").notNull(),
  homeLat: doublePrecision("home_lat").notNull(),
  homeLng: doublePrecision("home_lng").notNull(),
  homeName: text("home_name").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const dijasporaCountries = pgTable("dijaspora_countries", {
  id: uuid("id").defaultRandom().primaryKey(),
  flag: text("flag").notNull(),
  name: text("name").notNull(),
  count: integer("count").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const pozdraviSettings = pgTable("pozdravi_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  illustrative: boolean("illustrative").notNull().default(true),
  note: text("note").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const pozdraviItems = pgTable("pozdravi_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  loc: text("loc").notNull(),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});
