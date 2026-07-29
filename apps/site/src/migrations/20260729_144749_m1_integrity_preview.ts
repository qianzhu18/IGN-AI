import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "events" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "events" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "events" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "_events_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_seo_image_id" integer;
  ALTER TABLE "_events_v" ADD COLUMN "version_seo_no_index" boolean DEFAULT false;
  ALTER TABLE "events" ADD CONSTRAINT "events_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "events_seo_seo_image_idx" ON "events" USING btree ("seo_image_id");
  CREATE INDEX "_events_v_version_seo_version_seo_image_idx" ON "_events_v" USING btree ("version_seo_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "events" DROP CONSTRAINT "events_seo_image_id_media_id_fk";

  ALTER TABLE "_events_v" DROP CONSTRAINT "_events_v_version_seo_image_id_media_id_fk";

  DROP INDEX "events_seo_seo_image_idx";
  DROP INDEX "_events_v_version_seo_version_seo_image_idx";
  ALTER TABLE "events" DROP COLUMN "seo_title";
  ALTER TABLE "events" DROP COLUMN "seo_description";
  ALTER TABLE "events" DROP COLUMN "seo_image_id";
  ALTER TABLE "events" DROP COLUMN "seo_no_index";
  ALTER TABLE "_events_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_events_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_events_v" DROP COLUMN "version_seo_image_id";
  ALTER TABLE "_events_v" DROP COLUMN "version_seo_no_index";`)
}
