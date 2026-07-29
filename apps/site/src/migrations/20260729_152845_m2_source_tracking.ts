import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "source_notion_page_id" varchar;
  ALTER TABLE "media" ADD COLUMN "source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "source_checksum" varchar;
  ALTER TABLE "media" ADD COLUMN "source_last_synced_at" timestamp(3) with time zone;
  ALTER TABLE "members" ADD COLUMN "source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "members" ADD COLUMN "source_checksum" varchar;
  ALTER TABLE "_members_v" ADD COLUMN "version_source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "_members_v" ADD COLUMN "version_source_checksum" varchar;
  ALTER TABLE "events" ADD COLUMN "source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "events" ADD COLUMN "source_checksum" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "_events_v" ADD COLUMN "version_source_checksum" varchar;
  ALTER TABLE "records" ADD COLUMN "source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "records" ADD COLUMN "source_checksum" varchar;
  ALTER TABLE "_records_v" ADD COLUMN "version_source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "_records_v" ADD COLUMN "version_source_checksum" varchar;
  ALTER TABLE "posts" ADD COLUMN "source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "source_checksum" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_source_checksum" varchar;
  ALTER TABLE "pages" ADD COLUMN "source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "pages" ADD COLUMN "source_checksum" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_source_notion_last_edited_at" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_source_checksum" varchar;
  CREATE UNIQUE INDEX "media_source_source_notion_page_id_idx" ON "media" USING btree ("source_notion_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_source_source_notion_page_id_idx";
  ALTER TABLE "media" DROP COLUMN "source_notion_page_id";
  ALTER TABLE "media" DROP COLUMN "source_notion_last_edited_at";
  ALTER TABLE "media" DROP COLUMN "source_checksum";
  ALTER TABLE "media" DROP COLUMN "source_last_synced_at";
  ALTER TABLE "members" DROP COLUMN "source_notion_last_edited_at";
  ALTER TABLE "members" DROP COLUMN "source_checksum";
  ALTER TABLE "_members_v" DROP COLUMN "version_source_notion_last_edited_at";
  ALTER TABLE "_members_v" DROP COLUMN "version_source_checksum";
  ALTER TABLE "events" DROP COLUMN "source_notion_last_edited_at";
  ALTER TABLE "events" DROP COLUMN "source_checksum";
  ALTER TABLE "_events_v" DROP COLUMN "version_source_notion_last_edited_at";
  ALTER TABLE "_events_v" DROP COLUMN "version_source_checksum";
  ALTER TABLE "records" DROP COLUMN "source_notion_last_edited_at";
  ALTER TABLE "records" DROP COLUMN "source_checksum";
  ALTER TABLE "_records_v" DROP COLUMN "version_source_notion_last_edited_at";
  ALTER TABLE "_records_v" DROP COLUMN "version_source_checksum";
  ALTER TABLE "posts" DROP COLUMN "source_notion_last_edited_at";
  ALTER TABLE "posts" DROP COLUMN "source_checksum";
  ALTER TABLE "_posts_v" DROP COLUMN "version_source_notion_last_edited_at";
  ALTER TABLE "_posts_v" DROP COLUMN "version_source_checksum";
  ALTER TABLE "pages" DROP COLUMN "source_notion_last_edited_at";
  ALTER TABLE "pages" DROP COLUMN "source_checksum";
  ALTER TABLE "_pages_v" DROP COLUMN "version_source_notion_last_edited_at";
  ALTER TABLE "_pages_v" DROP COLUMN "version_source_checksum";`)
}
