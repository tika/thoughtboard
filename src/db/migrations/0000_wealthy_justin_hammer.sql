CREATE TABLE "reflection" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_ts" timestamp DEFAULT now(),
	"updated_ts" timestamp,
	"content" text NOT NULL,
	"remark_id" integer
);
--> statement-breakpoint
CREATE TABLE "remark" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_ts" timestamp DEFAULT now(),
	"updated_ts" timestamp,
	"user_id" text,
	"content" varchar(280) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reflection" ADD CONSTRAINT "reflection_remark_id_remark_id_fk" FOREIGN KEY ("remark_id") REFERENCES "public"."remark"("id") ON DELETE no action ON UPDATE no action;