# Member Schema

For the full IGNAI Notion community schema template, field types, post author mapping,
and event-ready fields, see:

- `docs/notion-community-schema-template.zh-CN.md`

## Status: MIGRATED (2026-05-20)

All 24 fields verified present in Notion database via `yarn notion:members:smoke schema-check`.

## Required
- `type = Member`
- `status = Published`
- `title`
- `slug`

## Community Fields (all created in Notion)
- `bio` - rich_text
- `role` - rich_text
- `avatar` - url
- `featured` - checkbox
- `verified` - checkbox
- `joinedAtText` - rich_text
- `quote` - rich_text
- `sortOrder` - number
- `social_github` - url
- `social_x` - url
- `social_linkedin` - url
- `website` - url

## Post Author Mapping (created in Notion)
- `author` - rich_text
- `author_slug` - rich_text

## Event Fields (pre-created in Notion)
- `event_start` - date
- `event_end` - date
- `location` - rich_text
- `organizer_slugs` - rich_text

## Slug Convention

```text
members/<person-slug>
```

Example:
```text
members/qianzhu
members/alice-chen
```

## Commands

```bash
yarn notion:members:smoke schema        # List all fields
yarn notion:members:smoke schema-check  # Check missing fields
yarn notion:members:smoke migrate-schema # Create missing fields
yarn notion:members:smoke query         # Read entries
yarn notion:members:smoke create-draft --title "Name" --role "Builder"
```

## Notes
- `featured` is used for directory ordering
- `verified` can be used for reviewed member badges
- `joinedAtText` and `quote` help member pages feel more personal
- if `avatar` is absent, the page icon / cover thumbnail may be used as fallback
