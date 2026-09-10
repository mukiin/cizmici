CREATE TABLE IF NOT EXISTS "gallery_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "author_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "caption" text,
  "mime_type" text DEFAULT 'image/webp' NOT NULL,
  "data_base64" text NOT NULL,
  "width" integer NOT NULL,
  "height" integer NOT NULL,
  "bytes" integer NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gallery_images_created_at_idx" ON "gallery_images" ("created_at" DESC);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gallery_images_author_id_idx" ON "gallery_images" ("author_id");
