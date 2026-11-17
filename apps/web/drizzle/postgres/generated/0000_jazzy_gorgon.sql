CREATE TABLE "mut_sa_communities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"cover_image_url" text,
	"icon_url" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mut_sa_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"source_url" text,
	"content" text NOT NULL,
	"embedding" vector(768),
	"school_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mut_sa_marketplace_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price_kes" text NOT NULL,
	"category" text NOT NULL,
	"image_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"location" "geography(Point,4326)",
	"campus_zone" text,
	"verified_seller" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mut_sa_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"community_id" uuid,
	"body" text DEFAULT '' NOT NULL,
	"media_type" text DEFAULT 'text' NOT NULL,
	"media_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"repost_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "mut_sa_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"bio" text,
	"avatar_url" text,
	"banner_url" text,
	"followers_count" integer DEFAULT 0 NOT NULL,
	"following_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mut_sa_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" uuid,
	"anonymous" boolean DEFAULT false NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"category" text NOT NULL,
	"details" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "mut_sa_timeline_entries" (
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"score" real DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mut_sa_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"email_verified_at" timestamp with time zone,
	"display_name" text NOT NULL,
	"role" varchar(16) DEFAULT 'student' NOT NULL,
	"password_hash" text,
	"reg_no" text,
	"school_id" uuid,
	"course_id" uuid,
	"year_group_id" uuid,
	"deleted_at" timestamp with time zone,
	"delete_requested_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mut_sa_communities" ADD CONSTRAINT "mut_sa_communities_created_by_mut_sa_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."mut_sa_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mut_sa_documents" ADD CONSTRAINT "mut_sa_documents_school_id_mut_sa_communities_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."mut_sa_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mut_sa_marketplace_listings" ADD CONSTRAINT "mut_sa_marketplace_listings_seller_id_mut_sa_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."mut_sa_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mut_sa_posts" ADD CONSTRAINT "mut_sa_posts_author_id_mut_sa_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."mut_sa_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mut_sa_posts" ADD CONSTRAINT "mut_sa_posts_community_id_mut_sa_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."mut_sa_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mut_sa_profiles" ADD CONSTRAINT "mut_sa_profiles_user_id_mut_sa_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mut_sa_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mut_sa_reports" ADD CONSTRAINT "mut_sa_reports_reporter_id_mut_sa_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."mut_sa_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mut_sa_timeline_entries" ADD CONSTRAINT "mut_sa_timeline_entries_user_id_mut_sa_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mut_sa_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mut_sa_timeline_entries" ADD CONSTRAINT "mut_sa_timeline_entries_post_id_mut_sa_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."mut_sa_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "mut_sa_communities_slug_idx" ON "mut_sa_communities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "mut_sa_communities_parent_idx" ON "mut_sa_communities" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "mut_sa_posts_feed_idx" ON "mut_sa_posts" USING btree ("created_at","id");--> statement-breakpoint
CREATE INDEX "mut_sa_posts_community_feed_idx" ON "mut_sa_posts" USING btree ("community_id","created_at","id");--> statement-breakpoint
CREATE UNIQUE INDEX "mut_sa_profiles_username_idx" ON "mut_sa_profiles" USING btree ("username");--> statement-breakpoint
CREATE INDEX "mut_sa_reports_queue_idx" ON "mut_sa_reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "mut_sa_timeline_feed_idx" ON "mut_sa_timeline_entries" USING btree ("user_id","score","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "mut_sa_users_email_idx" ON "mut_sa_users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "mut_sa_users_reg_no_idx" ON "mut_sa_users" USING btree ("reg_no");