CREATE TYPE "public"."reflection_theme" AS ENUM('work', 'personal', 'creative', 'learning', 'health', 'relationships', 'other');--> statement-breakpoint
CREATE TYPE "public"."reflection_type" AS ENUM('written', 'media');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"reflection_id" text NOT NULL,
	"content" text NOT NULL,
	"created_ts" timestamp DEFAULT now() NOT NULL,
	"updated_ts" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"id" text PRIMARY KEY NOT NULL,
	"follower_id" text NOT NULL,
	"following_id" text NOT NULL,
	"created_ts" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"reflection_id" text NOT NULL,
	"created_ts" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reflection" ADD COLUMN "type" "reflection_type" DEFAULT 'written' NOT NULL;--> statement-breakpoint
ALTER TABLE "reflection" ADD COLUMN "theme" "reflection_theme";--> statement-breakpoint
ALTER TABLE "reflection" ADD COLUMN "media_url" text;--> statement-breakpoint
ALTER TABLE "reflection" ADD COLUMN "media_type" varchar(50);--> statement-breakpoint
ALTER TABLE "remark" ADD COLUMN "reflection_id" text;--> statement-breakpoint
ALTER TABLE "remark" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_reflection_id_reflection_id_fk" FOREIGN KEY ("reflection_id") REFERENCES "public"."reflection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_profile_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_profile_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_reflection_id_reflection_id_fk" FOREIGN KEY ("reflection_id") REFERENCES "public"."reflection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "remark" ADD CONSTRAINT "remark_reflection_id_reflection_id_fk" FOREIGN KEY ("reflection_id") REFERENCES "public"."reflection"("id") ON DELETE set null ON UPDATE no action;