import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_records_record_type" AS ENUM('recap', 'story', 'resource', 'project');
  CREATE TYPE "public"."enum_records_date_status" AS ENUM('confirmed', 'approximate', 'unknown');
  CREATE TYPE "public"."enum_records_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__records_v_version_record_type" AS ENUM('recap', 'story', 'resource', 'project');
  CREATE TYPE "public"."enum__records_v_version_date_status" AS ENUM('confirmed', 'approximate', 'unknown');
  CREATE TYPE "public"."enum__records_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_blocks_community_collection_collection" AS ENUM('members', 'events', 'records', 'posts');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_community_collection_collection" AS ENUM('members', 'events', 'records', 'posts');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_join_submissions_status" AS ENUM('submitted', 'reviewing', 'contacted', 'accepted', 'waitlisted', 'withdrawn', 'spam', 'archived');
  CREATE TYPE "public"."enum_redirects_status_code" AS ENUM('301', '302', '307', '308');
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'ai-service';
  CREATE TABLE "members_focus_areas" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar
  );

  CREATE TABLE "members" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "avatar_id" integer,
    "role" varchar,
    "city" varchar,
    "headline" varchar,
    "bio" jsonb,
    "quote" varchar,
    "joined_at" timestamp(3) with time zone,
    "featured" boolean DEFAULT false,
    "verified" boolean DEFAULT false,
    "socials_website" varchar,
    "socials_github" varchar,
    "socials_x" varchar,
    "socials_linkedin" varchar,
    "socials_xiaohongshu" varchar,
    "slug" varchar,
    "seo_title" varchar,
    "seo_description" varchar,
    "seo_image_id" integer,
    "seo_no_index" boolean DEFAULT false,
    "source_notion_page_id" varchar,
    "source_last_synced_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_members_status" DEFAULT 'draft'
  );

  CREATE TABLE "_members_v_version_focus_areas" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_members_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_avatar_id" integer,
    "version_role" varchar,
    "version_city" varchar,
    "version_headline" varchar,
    "version_bio" jsonb,
    "version_quote" varchar,
    "version_joined_at" timestamp(3) with time zone,
    "version_featured" boolean DEFAULT false,
    "version_verified" boolean DEFAULT false,
    "version_socials_website" varchar,
    "version_socials_github" varchar,
    "version_socials_x" varchar,
    "version_socials_linkedin" varchar,
    "version_socials_xiaohongshu" varchar,
    "version_slug" varchar,
    "version_seo_title" varchar,
    "version_seo_description" varchar,
    "version_seo_image_id" integer,
    "version_seo_no_index" boolean DEFAULT false,
    "version_source_notion_page_id" varchar,
    "version_source_last_synced_at" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__members_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean,
    "autosave" boolean
  );

  CREATE TABLE "events_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "members_id" integer
  );

  CREATE TABLE "_events_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "members_id" integer
  );

  CREATE TABLE "records_outcomes" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar
  );

  CREATE TABLE "records_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar
  );

  CREATE TABLE "records_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar
  );

  CREATE TABLE "records" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "excerpt" varchar,
    "cover_id" integer,
    "content" jsonb,
    "record_type" "enum_records_record_type",
    "timeline_date" timestamp(3) with time zone,
    "timeline_end_date" timestamp(3) with time zone,
    "date_status" "enum_records_date_status" DEFAULT 'confirmed',
    "location" varchar,
    "featured" boolean DEFAULT false,
    "slug" varchar,
    "seo_title" varchar,
    "seo_description" varchar,
    "seo_image_id" integer,
    "seo_no_index" boolean DEFAULT false,
    "source_notion_page_id" varchar,
    "source_last_synced_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_records_status" DEFAULT 'draft'
  );

  CREATE TABLE "records_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "events_id" integer,
    "members_id" integer,
    "media_id" integer
  );

  CREATE TABLE "_records_v_version_outcomes" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_records_v_version_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_records_v_version_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_records_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_excerpt" varchar,
    "version_cover_id" integer,
    "version_content" jsonb,
    "version_record_type" "enum__records_v_version_record_type",
    "version_timeline_date" timestamp(3) with time zone,
    "version_timeline_end_date" timestamp(3) with time zone,
    "version_date_status" "enum__records_v_version_date_status" DEFAULT 'confirmed',
    "version_location" varchar,
    "version_featured" boolean DEFAULT false,
    "version_slug" varchar,
    "version_seo_title" varchar,
    "version_seo_description" varchar,
    "version_seo_image_id" integer,
    "version_seo_no_index" boolean DEFAULT false,
    "version_source_notion_page_id" varchar,
    "version_source_last_synced_at" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__records_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean,
    "autosave" boolean
  );

  CREATE TABLE "_records_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "events_id" integer,
    "members_id" integer,
    "media_id" integer
  );

  CREATE TABLE "posts_categories" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar
  );

  CREATE TABLE "posts_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar
  );

  CREATE TABLE "posts" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "excerpt" varchar,
    "cover_id" integer,
    "content" jsonb,
    "published_at" timestamp(3) with time zone,
    "featured" boolean DEFAULT false,
    "slug" varchar,
    "seo_title" varchar,
    "seo_description" varchar,
    "seo_image_id" integer,
    "seo_no_index" boolean DEFAULT false,
    "source_notion_page_id" varchar,
    "source_last_synced_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_posts_status" DEFAULT 'draft'
  );

  CREATE TABLE "posts_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "members_id" integer,
    "events_id" integer,
    "records_id" integer
  );

  CREATE TABLE "_posts_v_version_categories" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_posts_v_version_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_posts_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_excerpt" varchar,
    "version_cover_id" integer,
    "version_content" jsonb,
    "version_published_at" timestamp(3) with time zone,
    "version_featured" boolean DEFAULT false,
    "version_slug" varchar,
    "version_seo_title" varchar,
    "version_seo_description" varchar,
    "version_seo_image_id" integer,
    "version_seo_no_index" boolean DEFAULT false,
    "version_source_notion_page_id" varchar,
    "version_source_last_synced_at" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__posts_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean,
    "autosave" boolean
  );

  CREATE TABLE "_posts_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "members_id" integer,
    "events_id" integer,
    "records_id" integer
  );

  CREATE TABLE "pages_blocks_rich_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "content" jsonb,
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_call_to_action" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "body" varchar,
    "action_label" varchar,
    "action_href" varchar,
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_community_collection" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar,
    "collection" "enum_pages_blocks_community_collection_collection",
    "limit" numeric DEFAULT 6,
    "featured_only" boolean DEFAULT false,
    "block_name" varchar
  );

  CREATE TABLE "pages" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "excerpt" varchar,
    "slug" varchar,
    "seo_title" varchar,
    "seo_description" varchar,
    "seo_image_id" integer,
    "seo_no_index" boolean DEFAULT false,
    "source_notion_page_id" varchar,
    "source_last_synced_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "_pages_v_blocks_rich_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "content" jsonb,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_call_to_action" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "body" varchar,
    "action_label" varchar,
    "action_href" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_community_collection" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar,
    "collection" "enum__pages_v_blocks_community_collection_collection",
    "limit" numeric DEFAULT 6,
    "featured_only" boolean DEFAULT false,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_excerpt" varchar,
    "version_slug" varchar,
    "version_seo_title" varchar,
    "version_seo_description" varchar,
    "version_seo_image_id" integer,
    "version_seo_no_index" boolean DEFAULT false,
    "version_source_notion_page_id" varchar,
    "version_source_last_synced_at" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__pages_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean,
    "autosave" boolean
  );

  CREATE TABLE "join_submissions_interests" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "join_submissions" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "contact" varchar NOT NULL,
    "role" varchar NOT NULL,
    "message" varchar NOT NULL,
    "source" varchar DEFAULT 'website' NOT NULL,
    "status" "enum_join_submissions_status" DEFAULT 'submitted' NOT NULL,
    "profile_draft_avatar_id" integer,
    "profile_draft_headline" varchar,
    "profile_draft_website" varchar,
    "profile_draft_github" varchar,
    "profile_draft_xiaohongshu" varchar,
    "review_assignee_id" integer,
    "review_notes" varchar,
    "review_contacted_at" timestamp(3) with time zone,
    "dedupe_key" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "redirects" (
    "id" serial PRIMARY KEY NOT NULL,
    "from" varchar NOT NULL,
    "to" varchar NOT NULL,
    "status_code" "enum_redirects_status_code" DEFAULT '301' NOT NULL,
    "active" boolean DEFAULT true,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "site_settings_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar
  );

  CREATE TABLE "_site_settings_v_version_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar,
    "_uuid" varchar
  );

  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "members_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "pages_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "posts_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "records_find" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "records_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "join_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "default_s_e_o_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "default_s_e_o_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "default_s_e_o_image_id" integer;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_default_s_e_o_title" varchar;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_default_s_e_o_description" varchar;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_default_s_e_o_image_id" integer;
  ALTER TABLE "members_focus_areas" ADD CONSTRAINT "members_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members" ADD CONSTRAINT "members_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "members" ADD CONSTRAINT "members_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_members_v_version_focus_areas" ADD CONSTRAINT "_members_v_version_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_members_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_members_v" ADD CONSTRAINT "_members_v_parent_id_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_members_v" ADD CONSTRAINT "_members_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_members_v" ADD CONSTRAINT "_members_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "records_outcomes" ADD CONSTRAINT "records_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "records_tags" ADD CONSTRAINT "records_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "records_links" ADD CONSTRAINT "records_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "records" ADD CONSTRAINT "records_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "records" ADD CONSTRAINT "records_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "records_rels" ADD CONSTRAINT "records_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "records_rels" ADD CONSTRAINT "records_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "records_rels" ADD CONSTRAINT "records_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "records_rels" ADD CONSTRAINT "records_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_records_v_version_outcomes" ADD CONSTRAINT "_records_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_records_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_records_v_version_tags" ADD CONSTRAINT "_records_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_records_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_records_v_version_links" ADD CONSTRAINT "_records_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_records_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_records_v" ADD CONSTRAINT "_records_v_parent_id_records_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."records"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_records_v" ADD CONSTRAINT "_records_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_records_v" ADD CONSTRAINT "_records_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_records_v_rels" ADD CONSTRAINT "_records_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_records_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_records_v_rels" ADD CONSTRAINT "_records_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_records_v_rels" ADD CONSTRAINT "_records_v_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_records_v_rels" ADD CONSTRAINT "_records_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_categories" ADD CONSTRAINT "posts_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_records_fk" FOREIGN KEY ("records_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_categories" ADD CONSTRAINT "_posts_v_version_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_records_fk" FOREIGN KEY ("records_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_community_collection" ADD CONSTRAINT "pages_blocks_community_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_call_to_action" ADD CONSTRAINT "_pages_v_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_community_collection" ADD CONSTRAINT "_pages_v_blocks_community_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "join_submissions_interests" ADD CONSTRAINT "join_submissions_interests_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."join_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "join_submissions" ADD CONSTRAINT "join_submissions_profile_draft_avatar_id_media_id_fk" FOREIGN KEY ("profile_draft_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "join_submissions" ADD CONSTRAINT "join_submissions_review_assignee_id_users_id_fk" FOREIGN KEY ("review_assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_social_links" ADD CONSTRAINT "_site_settings_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "members_focus_areas_order_idx" ON "members_focus_areas" USING btree ("_order");
  CREATE INDEX "members_focus_areas_parent_id_idx" ON "members_focus_areas" USING btree ("_parent_id");
  CREATE INDEX "members_avatar_idx" ON "members" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "members_slug_idx" ON "members" USING btree ("slug");
  CREATE INDEX "members_seo_seo_image_idx" ON "members" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "members_source_source_notion_page_id_idx" ON "members" USING btree ("source_notion_page_id");
  CREATE INDEX "members_updated_at_idx" ON "members" USING btree ("updated_at");
  CREATE INDEX "members_created_at_idx" ON "members" USING btree ("created_at");
  CREATE INDEX "members__status_idx" ON "members" USING btree ("_status");
  CREATE INDEX "_members_v_version_focus_areas_order_idx" ON "_members_v_version_focus_areas" USING btree ("_order");
  CREATE INDEX "_members_v_version_focus_areas_parent_id_idx" ON "_members_v_version_focus_areas" USING btree ("_parent_id");
  CREATE INDEX "_members_v_parent_idx" ON "_members_v" USING btree ("parent_id");
  CREATE INDEX "_members_v_version_version_avatar_idx" ON "_members_v" USING btree ("version_avatar_id");
  CREATE INDEX "_members_v_version_version_slug_idx" ON "_members_v" USING btree ("version_slug");
  CREATE INDEX "_members_v_version_seo_version_seo_image_idx" ON "_members_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_members_v_version_source_version_source_notion_page_id_idx" ON "_members_v" USING btree ("version_source_notion_page_id");
  CREATE INDEX "_members_v_version_version_updated_at_idx" ON "_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_members_v_version_version_created_at_idx" ON "_members_v" USING btree ("version_created_at");
  CREATE INDEX "_members_v_version_version__status_idx" ON "_members_v" USING btree ("version__status");
  CREATE INDEX "_members_v_created_at_idx" ON "_members_v" USING btree ("created_at");
  CREATE INDEX "_members_v_updated_at_idx" ON "_members_v" USING btree ("updated_at");
  CREATE INDEX "_members_v_latest_idx" ON "_members_v" USING btree ("latest");
  CREATE INDEX "_members_v_autosave_idx" ON "_members_v" USING btree ("autosave");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_members_id_idx" ON "events_rels" USING btree ("members_id");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_members_id_idx" ON "_events_v_rels" USING btree ("members_id");
  CREATE INDEX "records_outcomes_order_idx" ON "records_outcomes" USING btree ("_order");
  CREATE INDEX "records_outcomes_parent_id_idx" ON "records_outcomes" USING btree ("_parent_id");
  CREATE INDEX "records_tags_order_idx" ON "records_tags" USING btree ("_order");
  CREATE INDEX "records_tags_parent_id_idx" ON "records_tags" USING btree ("_parent_id");
  CREATE INDEX "records_links_order_idx" ON "records_links" USING btree ("_order");
  CREATE INDEX "records_links_parent_id_idx" ON "records_links" USING btree ("_parent_id");
  CREATE INDEX "records_cover_idx" ON "records" USING btree ("cover_id");
  CREATE UNIQUE INDEX "records_slug_idx" ON "records" USING btree ("slug");
  CREATE INDEX "records_seo_seo_image_idx" ON "records" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "records_source_source_notion_page_id_idx" ON "records" USING btree ("source_notion_page_id");
  CREATE INDEX "records_updated_at_idx" ON "records" USING btree ("updated_at");
  CREATE INDEX "records_created_at_idx" ON "records" USING btree ("created_at");
  CREATE INDEX "records__status_idx" ON "records" USING btree ("_status");
  CREATE INDEX "records_rels_order_idx" ON "records_rels" USING btree ("order");
  CREATE INDEX "records_rels_parent_idx" ON "records_rels" USING btree ("parent_id");
  CREATE INDEX "records_rels_path_idx" ON "records_rels" USING btree ("path");
  CREATE INDEX "records_rels_events_id_idx" ON "records_rels" USING btree ("events_id");
  CREATE INDEX "records_rels_members_id_idx" ON "records_rels" USING btree ("members_id");
  CREATE INDEX "records_rels_media_id_idx" ON "records_rels" USING btree ("media_id");
  CREATE INDEX "_records_v_version_outcomes_order_idx" ON "_records_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_records_v_version_outcomes_parent_id_idx" ON "_records_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_records_v_version_tags_order_idx" ON "_records_v_version_tags" USING btree ("_order");
  CREATE INDEX "_records_v_version_tags_parent_id_idx" ON "_records_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_records_v_version_links_order_idx" ON "_records_v_version_links" USING btree ("_order");
  CREATE INDEX "_records_v_version_links_parent_id_idx" ON "_records_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_records_v_parent_idx" ON "_records_v" USING btree ("parent_id");
  CREATE INDEX "_records_v_version_version_cover_idx" ON "_records_v" USING btree ("version_cover_id");
  CREATE INDEX "_records_v_version_version_slug_idx" ON "_records_v" USING btree ("version_slug");
  CREATE INDEX "_records_v_version_seo_version_seo_image_idx" ON "_records_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_records_v_version_source_version_source_notion_page_id_idx" ON "_records_v" USING btree ("version_source_notion_page_id");
  CREATE INDEX "_records_v_version_version_updated_at_idx" ON "_records_v" USING btree ("version_updated_at");
  CREATE INDEX "_records_v_version_version_created_at_idx" ON "_records_v" USING btree ("version_created_at");
  CREATE INDEX "_records_v_version_version__status_idx" ON "_records_v" USING btree ("version__status");
  CREATE INDEX "_records_v_created_at_idx" ON "_records_v" USING btree ("created_at");
  CREATE INDEX "_records_v_updated_at_idx" ON "_records_v" USING btree ("updated_at");
  CREATE INDEX "_records_v_latest_idx" ON "_records_v" USING btree ("latest");
  CREATE INDEX "_records_v_autosave_idx" ON "_records_v" USING btree ("autosave");
  CREATE INDEX "_records_v_rels_order_idx" ON "_records_v_rels" USING btree ("order");
  CREATE INDEX "_records_v_rels_parent_idx" ON "_records_v_rels" USING btree ("parent_id");
  CREATE INDEX "_records_v_rels_path_idx" ON "_records_v_rels" USING btree ("path");
  CREATE INDEX "_records_v_rels_events_id_idx" ON "_records_v_rels" USING btree ("events_id");
  CREATE INDEX "_records_v_rels_members_id_idx" ON "_records_v_rels" USING btree ("members_id");
  CREATE INDEX "_records_v_rels_media_id_idx" ON "_records_v_rels" USING btree ("media_id");
  CREATE INDEX "posts_categories_order_idx" ON "posts_categories" USING btree ("_order");
  CREATE INDEX "posts_categories_parent_id_idx" ON "posts_categories" USING btree ("_parent_id");
  CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");
  CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_seo_seo_image_idx" ON "posts" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "posts_source_source_notion_page_id_idx" ON "posts" USING btree ("source_notion_page_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_members_id_idx" ON "posts_rels" USING btree ("members_id");
  CREATE INDEX "posts_rels_events_id_idx" ON "posts_rels" USING btree ("events_id");
  CREATE INDEX "posts_rels_records_id_idx" ON "posts_rels" USING btree ("records_id");
  CREATE INDEX "_posts_v_version_categories_order_idx" ON "_posts_v_version_categories" USING btree ("_order");
  CREATE INDEX "_posts_v_version_categories_parent_id_idx" ON "_posts_v_version_categories" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_tags_order_idx" ON "_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_posts_v_version_tags_parent_id_idx" ON "_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_seo_version_seo_image_idx" ON "_posts_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_posts_v_version_source_version_source_notion_page_id_idx" ON "_posts_v" USING btree ("version_source_notion_page_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_members_id_idx" ON "_posts_v_rels" USING btree ("members_id");
  CREATE INDEX "_posts_v_rels_events_id_idx" ON "_posts_v_rels" USING btree ("events_id");
  CREATE INDEX "_posts_v_rels_records_id_idx" ON "_posts_v_rels" USING btree ("records_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_call_to_action_order_idx" ON "pages_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "pages_blocks_call_to_action_parent_id_idx" ON "pages_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_call_to_action_path_idx" ON "pages_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "pages_blocks_community_collection_order_idx" ON "pages_blocks_community_collection" USING btree ("_order");
  CREATE INDEX "pages_blocks_community_collection_parent_id_idx" ON "pages_blocks_community_collection" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_community_collection_path_idx" ON "pages_blocks_community_collection" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "pages_source_source_notion_page_id_idx" ON "pages" USING btree ("source_notion_page_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_call_to_action_order_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_call_to_action_parent_id_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_call_to_action_path_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_community_collection_order_idx" ON "_pages_v_blocks_community_collection" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_community_collection_parent_id_idx" ON "_pages_v_blocks_community_collection" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_community_collection_path_idx" ON "_pages_v_blocks_community_collection" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_source_version_source_notion_page_id_idx" ON "_pages_v" USING btree ("version_source_notion_page_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "join_submissions_interests_order_idx" ON "join_submissions_interests" USING btree ("_order");
  CREATE INDEX "join_submissions_interests_parent_id_idx" ON "join_submissions_interests" USING btree ("_parent_id");
  CREATE INDEX "join_submissions_contact_idx" ON "join_submissions" USING btree ("contact");
  CREATE INDEX "join_submissions_status_idx" ON "join_submissions" USING btree ("status");
  CREATE INDEX "join_submissions_profile_draft_profile_draft_avatar_idx" ON "join_submissions" USING btree ("profile_draft_avatar_id");
  CREATE INDEX "join_submissions_review_review_assignee_idx" ON "join_submissions" USING btree ("review_assignee_id");
  CREATE UNIQUE INDEX "join_submissions_dedupe_key_idx" ON "join_submissions" USING btree ("dedupe_key");
  CREATE INDEX "join_submissions_updated_at_idx" ON "join_submissions" USING btree ("updated_at");
  CREATE INDEX "join_submissions_created_at_idx" ON "join_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_active_idx" ON "redirects" USING btree ("active");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_social_links_order_idx" ON "_site_settings_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_social_links_parent_id_idx" ON "_site_settings_v_version_social_links" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_records_fk" FOREIGN KEY ("records_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_join_submissions_fk" FOREIGN KEY ("join_submissions_id") REFERENCES "public"."join_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_s_e_o_image_id_media_id_fk" FOREIGN KEY ("default_s_e_o_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_default_s_e_o_image_id_media_id_fk" FOREIGN KEY ("version_default_s_e_o_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_members_id_idx" ON "payload_locked_documents_rels" USING btree ("members_id");
  CREATE INDEX "payload_locked_documents_rels_records_id_idx" ON "payload_locked_documents_rels" USING btree ("records_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_join_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("join_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "site_settings_default_s_e_o_default_s_e_o_image_idx" ON "site_settings" USING btree ("default_s_e_o_image_id");
  CREATE INDEX "_site_settings_v_version_default_s_e_o_version_default_s_idx" ON "_site_settings_v" USING btree ("version_default_s_e_o_image_id");`)
}

export async function down({
  db,
  payload,
  req
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "members_focus_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_members_v_version_focus_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_members_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "records_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "records_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "records_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "records" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "records_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_records_v_version_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_records_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_records_v_version_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_records_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_records_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_call_to_action" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_community_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_call_to_action" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_community_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "join_submissions_interests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "join_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_social_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "members_focus_areas" CASCADE;
  DROP TABLE "members" CASCADE;
  DROP TABLE "_members_v_version_focus_areas" CASCADE;
  DROP TABLE "_members_v" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "records_outcomes" CASCADE;
  DROP TABLE "records_tags" CASCADE;
  DROP TABLE "records_links" CASCADE;
  DROP TABLE "records" CASCADE;
  DROP TABLE "records_rels" CASCADE;
  DROP TABLE "_records_v_version_outcomes" CASCADE;
  DROP TABLE "_records_v_version_tags" CASCADE;
  DROP TABLE "_records_v_version_links" CASCADE;
  DROP TABLE "_records_v" CASCADE;
  DROP TABLE "_records_v_rels" CASCADE;
  DROP TABLE "posts_categories" CASCADE;
  DROP TABLE "posts_tags" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_categories" CASCADE;
  DROP TABLE "_posts_v_version_tags" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_call_to_action" CASCADE;
  DROP TABLE "pages_blocks_community_collection" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_call_to_action" CASCADE;
  DROP TABLE "_pages_v_blocks_community_collection" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "join_submissions_interests" CASCADE;
  DROP TABLE "join_submissions" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "_site_settings_v_version_social_links" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_members_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_records_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_join_submissions_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";

  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_default_s_e_o_image_id_media_id_fk";

  ALTER TABLE "_site_settings_v" DROP CONSTRAINT "_site_settings_v_version_default_s_e_o_image_id_media_id_fk";

  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'admin'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'admin'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "payload_locked_documents_rels_members_id_idx";
  DROP INDEX "payload_locked_documents_rels_records_id_idx";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_join_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_redirects_id_idx";
  DROP INDEX "site_settings_default_s_e_o_default_s_e_o_image_idx";
  DROP INDEX "_site_settings_v_version_default_s_e_o_version_default_s_idx";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "members_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "pages_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "posts_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "records_find";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "records_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "join_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  ALTER TABLE "site_settings" DROP COLUMN "default_s_e_o_title";
  ALTER TABLE "site_settings" DROP COLUMN "default_s_e_o_description";
  ALTER TABLE "site_settings" DROP COLUMN "default_s_e_o_image_id";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_default_s_e_o_title";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_default_s_e_o_description";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_default_s_e_o_image_id";
  DROP TYPE "public"."enum_members_status";
  DROP TYPE "public"."enum__members_v_version_status";
  DROP TYPE "public"."enum_records_record_type";
  DROP TYPE "public"."enum_records_date_status";
  DROP TYPE "public"."enum_records_status";
  DROP TYPE "public"."enum__records_v_version_record_type";
  DROP TYPE "public"."enum__records_v_version_date_status";
  DROP TYPE "public"."enum__records_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_pages_blocks_community_collection_collection";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_community_collection_collection";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_join_submissions_status";
  DROP TYPE "public"."enum_redirects_status_code";`)
}
