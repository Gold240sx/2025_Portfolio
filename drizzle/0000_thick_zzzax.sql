DO $$ BEGIN
 CREATE TYPE "public"."deliveryStatus" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'canceled', 'returned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."discounttype" AS ENUM('multiple', 'minus', 'free');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."mediatype" AS ENUM('image', 'document', 'video', 'code');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."messageType" AS ENUM('quoteRequest', 'hireMe', 'generalInquiry');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."moodtype" AS ENUM('happy', 'sad', 'mad', 'angry', 'expressive', 'thankful', 'inquisitive', 'excited', 'grateful', 'interested', 'amazed', 'introspective', 'energized', 'sleepy', 'depressed', 'hungry', 'cold', 'hot', 'jealous');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."positionEnum" AS ENUM('Front End Developer', 'Full Stack Developer', 'Backend Developer', 'Mobile Developer', 'Web Developer', 'UI Developer / Designer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."productType" AS ENUM('web', 'iOS', 'android', 'macOS', 'api', 'hardware');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."progress" AS ENUM('in-progress', 'completed', 'active-complete');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."progressEnum" AS ENUM('que', 'pending', 'complete');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."schoolType" AS ENUM('high_school', 'college', 'bootcamp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."techType" AS ENUM('language', 'UI', 'framework', 'api-auth-db', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."workType" AS ENUM('employed', 'contract', 'self-employed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "about_me" (
	"id" integer PRIMARY KEY NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"user_id" text NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "active_sites" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"website" text NOT NULL,
	"api_endpoint" text NOT NULL,
	"recurrence" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_content" (
	"id" integer PRIMARY KEY NOT NULL,
	"blog_id" integer NOT NULL,
	"content" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blogs" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_references" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact_info" text NOT NULL,
	"relationship" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_preview" text,
	"instructor" text NOT NULL,
	"description" text NOT NULL,
	"tags" text[] NOT NULL,
	"technologies" integer[] NOT NULL,
	"certification" text,
	"progress" "progressEnum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"stripe_customer_id" text,
	CONSTRAINT "customers_email_unique" UNIQUE("email"),
	CONSTRAINT "customers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deliveries" (
	"id" integer PRIMARY KEY NOT NULL,
	"purchase_id" integer NOT NULL,
	"status" "deliveryStatus" DEFAULT 'pending' NOT NULL,
	"tracking_number" text,
	"carrier" text,
	"estimated_delivery_date" date,
	"actual_delivery_date" date,
	"stripe_order_id" text,
	CONSTRAINT "deliveries_stripe_order_id_unique" UNIQUE("stripe_order_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discount_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"discount_code" text NOT NULL,
	"discount_integer" numeric NOT NULL,
	"discount_type" "discounttype",
	"description" text,
	"expires" date,
	"used_in" text,
	"currently_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "education" (
	"id" integer PRIMARY KEY NOT NULL,
	"formal_id" integer NOT NULL,
	"course_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formal" (
	"id" integer PRIMARY KEY NOT NULL,
	"schools" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" integer PRIMARY KEY NOT NULL,
	"media" text NOT NULL,
	"media_type" "mediatype" NOT NULL,
	"alt" text,
	"description" text,
	"media_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" "messageType" NOT NULL,
	"quote_request" text,
	"hire_me_request" text,
	"general_inquiry" text,
	"submitted_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"id" integer PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"currency" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"stripe_price_id" text,
	CONSTRAINT "prices_stripe_price_id_unique" UNIQUE("stripe_price_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"stripe_product_id" text,
	CONSTRAINT "products_stripe_product_id_unique" UNIQUE("stripe_product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"short_descript" text,
	"product_images" text[] NOT NULL,
	"tech_stack" integer[] NOT NULL,
	"github_link" text,
	"figma_link" text,
	"live_link" text,
	"tags" text[] NOT NULL,
	"created" date NOT NULL,
	"features" text[] NOT NULL,
	"local_link" text,
	"progress" "progress" DEFAULT 'in-progress' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects_content" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchases" (
	"id" integer PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"product_id" integer,
	"subscription_id" integer,
	"purchase_date" timestamp with time zone DEFAULT now(),
	"amount" numeric(10, 2) NOT NULL,
	"currency" text NOT NULL,
	"stripe_payment_intent_id" text,
	CONSTRAINT "purchases_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" integer PRIMARY KEY NOT NULL,
	"reviewer_id" varchar(255) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" integer NOT NULL,
	"content" text NOT NULL,
	"rating" integer NOT NULL,
	"review_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" integer PRIMARY KEY NOT NULL,
	"role_name" text NOT NULL,
	CONSTRAINT "roles_role_name_unique" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_content" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"title" text NOT NULL,
	"logo_url" text,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" varchar(255),
	"about_me_id" integer,
	"blog_content_id" integer,
	"projects_content_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "social_media_profiles" (
	"id" integer PRIMARY KEY NOT NULL,
	"platform_name" text NOT NULL,
	"profile_url_format" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscribers" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" text,
	"email" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now(),
	"stripe_subscription_id" text,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email"),
	CONSTRAINT "subscribers_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" integer PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"interval" text NOT NULL,
	"interval_count" integer NOT NULL,
	"stripe_subscription_id" text,
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "technology" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"link" text NOT NULL,
	"type" "techType" NOT NULL,
	"logo_url" text,
	"description" text NOT NULL,
	"experience" integer NOT NULL,
	"logo" text,
	"current_stack" boolean NOT NULL,
	"product_type" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tools" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tech_type" text,
	"product_type" text,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "updates" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"last_update" timestamp with time zone NOT NULL,
	"current_mood" "moodtype",
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"user_id" text NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "website_general" (
	"id" integer PRIMARY KEY NOT NULL,
	"website_name" text NOT NULL,
	"website_logo" text NOT NULL,
	"resume" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work_history" (
	"id" integer PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"job_title" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"job_description" text NOT NULL,
	"location" text,
	"responsibilities" text[],
	"work_type" "workType" NOT NULL,
	"reference_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work_history_projects" (
	"work_history_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT "work_history_projects_work_history_id_project_id_pk" PRIMARY KEY("work_history_id","project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blog_content" ADD CONSTRAINT "blog_content_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_purchase_id_purchases_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education" ADD CONSTRAINT "education_formal_id_formal_id_fk" FOREIGN KEY ("formal_id") REFERENCES "public"."formal"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education" ADD CONSTRAINT "education_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prices" ADD CONSTRAINT "prices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchases" ADD CONSTRAINT "purchases_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchases" ADD CONSTRAINT "purchases_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "site_content" ADD CONSTRAINT "site_content_about_me_id_about_me_id_fk" FOREIGN KEY ("about_me_id") REFERENCES "public"."about_me"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "site_content" ADD CONSTRAINT "site_content_blog_content_id_blog_content_id_fk" FOREIGN KEY ("blog_content_id") REFERENCES "public"."blog_content"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "site_content" ADD CONSTRAINT "site_content_projects_content_id_projects_content_id_fk" FOREIGN KEY ("projects_content_id") REFERENCES "public"."projects_content"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_history" ADD CONSTRAINT "work_history_reference_id_contact_references_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."contact_references"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_history_projects" ADD CONSTRAINT "work_history_projects_work_history_id_work_history_id_fk" FOREIGN KEY ("work_history_id") REFERENCES "public"."work_history"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_history_projects" ADD CONSTRAINT "work_history_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" USING btree ("user_id");