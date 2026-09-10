-- Editorial relational tables (replaces cms_documents blob store)

CREATE TYPE "public"."source_kind" AS ENUM('official', 'verified', 'public');
--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('done', 'progress', 'planned');
--> statement-breakpoint
CREATE TYPE "public"."infra_kind" AS ENUM('object', 'network');
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "domain" text NOT NULL,
  "tagline" text NOT NULL,
  "municipality" text NOT NULL,
  "canton" text NOT NULL,
  "settlements" text[] NOT NULL,
  "lat" double precision NOT NULL,
  "lng" double precision NOT NULL,
  "elevation_m" integer NOT NULL,
  "location_note" text NOT NULL,
  "dan_mz_month" integer NOT NULL,
  "dan_mz_day" integer NOT NULL,
  "founded_year" integer NOT NULL,
  "last_news" text NOT NULL,
  "last_news_href" text NOT NULL,
  "sources" text[] NOT NULL,
  "disclaimer" text NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "site_stats" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "value" text NOT NULL,
  "label" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "site_roadmap" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "num" text NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "live" boolean DEFAULT false NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "historija_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "year" text NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "source" "source_kind" NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "detail" text[] DEFAULT '{}' NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "demografija_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "note" text NOT NULL,
  "coverage_note" text NOT NULL,
  "source" "source_kind" NOT NULL,
  "source_label" text NOT NULL,
  "males" integer NOT NULL,
  "females" integer NOT NULL,
  "area_km2" real NOT NULL,
  "total" integer NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "demografija_age_groups" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "label" text NOT NULL,
  "value" integer NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "demografija_ethnicity" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "label" text NOT NULL,
  "count" integer NOT NULL,
  "pct" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "infrastruktura_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "intro" text NOT NULL,
  "source" "source_kind" NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "roads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "km" text NOT NULL,
  "from_place" text NOT NULL,
  "to_place" text NOT NULL,
  "detail" text[] DEFAULT '{}' NOT NULL,
  "facts" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "infra_objects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "chip" text NOT NULL,
  "kind" "infra_kind" NOT NULL,
  "detail" text[] DEFAULT '{}' NOT NULL,
  "facts" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "mapa_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "intro" text,
  "center_lat" double precision NOT NULL,
  "center_lng" double precision NOT NULL,
  "zoom" integer NOT NULL,
  "path" jsonb,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "mapa_markers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "lat" double precision NOT NULL,
  "lng" double precision NOT NULL,
  "color" text NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "legend" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "status" "project_status" NOT NULL,
  "status_label" text NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "year" text NOT NULL,
  "meta" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "businesses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tag" text NOT NULL,
  "name" text NOT NULL,
  "body" text NOT NULL,
  "founded" text NOT NULL,
  "location" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "day" text NOT NULL,
  "month" text NOT NULL,
  "title" text NOT NULL,
  "meta" text NOT NULL,
  "recurring" boolean DEFAULT false NOT NULL,
  "illustrative" boolean DEFAULT false NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "dijaspora_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "illustrative" boolean DEFAULT true NOT NULL,
  "note" text NOT NULL,
  "total" integer NOT NULL,
  "countries_count" integer NOT NULL,
  "home_lat" double precision NOT NULL,
  "home_lng" double precision NOT NULL,
  "home_name" text NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "dijaspora_countries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "flag" text NOT NULL,
  "name" text NOT NULL,
  "count" integer NOT NULL,
  "lat" double precision NOT NULL,
  "lng" double precision NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "pozdravi_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "illustrative" boolean DEFAULT true NOT NULL,
  "note" text NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "pozdravi_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "loc" text NOT NULL,
  "text" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

DROP TABLE IF EXISTS "cms_documents";
