DO $$ BEGIN
 CREATE TYPE "public"."forum_vote_target" AS ENUM('topic', 'comment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "forum_topics" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "author_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "forum_comments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "topic_id" uuid NOT NULL REFERENCES "forum_topics"("id") ON DELETE cascade,
  "author_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "body" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "forum_votes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "target_type" "forum_vote_target" NOT NULL,
  "value" integer NOT NULL,
  "target_id" uuid NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "forum_votes_user_target_idx" ON "forum_votes" ("user_id", "target_type", "target_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "forum_votes_target_idx" ON "forum_votes" ("target_type", "target_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "forum_topics_created_at_idx" ON "forum_topics" ("created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "forum_comments_topic_id_idx" ON "forum_comments" ("topic_id");
