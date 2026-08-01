#!/usr/bin/env node

/*
 * Deprecated on 2026-08-02.
 *
 * This importer wrote Event content into the legacy `ext` JSON property and
 * recreated a second content model beside Notion's first-class fields. Keep a
 * hard stop at the old entry point so saved commands fail safely instead of
 * silently undoing the migration.
 */

console.error(
  'seed-notion-events.js is disabled: edit Event fields, page body and Page Cover directly in Notion. For legacy rows, run yarn notion:community:migrate first.'
)
process.exitCode = 1
