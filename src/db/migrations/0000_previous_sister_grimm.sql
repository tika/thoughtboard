CREATE TYPE "public"."onboarding_step" AS ENUM('welcome', 'handle', 'avatar', 'completed');--> statement-breakpoint
CREATE TABLE "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"handle" varchar(50),
	"avatar_url" text,
	"onboarding_step" "onboarding_step" DEFAULT 'welcome' NOT NULL,
	"created_ts" timestamp DEFAULT now(),
	"updated_ts" timestamp,
	CONSTRAINT "profile_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "reflection" (
	"id" text PRIMARY KEY NOT NULL,
	"created_ts" timestamp DEFAULT now() NOT NULL,
	"updated_ts" timestamp NOT NULL,
	"content" text NOT NULL,
	"remark_id" text,
	CONSTRAINT "reflection_remark_id_unique" UNIQUE("remark_id")
);
--> statement-breakpoint
CREATE TABLE "remark" (
	"id" text PRIMARY KEY NOT NULL,
	"created_ts" timestamp DEFAULT now() NOT NULL,
	"updated_ts" timestamp NOT NULL,
	"user_id" text NOT NULL,
	"content" varchar(280) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reflection" ADD CONSTRAINT "reflection_remark_id_remark_id_fk" FOREIGN KEY ("remark_id") REFERENCES "public"."remark"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "remark" ADD CONSTRAINT "remark_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;