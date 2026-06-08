# Community Site MVP

## Why
NotionNext is excellent for creator and blog workflows, but this repository is moving toward a community / organization website.

## Product Split

### Local Product Track
What we need for the IGN AI site:

- community landing and narrative
- join flow
- organization voice and structure
- community members and roles
- events and follow-up operations

### Shared Capability Track
What may be generalized and contributed back:

- `Member` page type support
- member listing data access
- member detail routing conventions
- multi-author preparation
- reusable schema documentation

## Member MVP

### Data
- `type = Member`
- published members should be queryable separately from posts
- member records should not break existing post/category/tag flows

### Routes
- `/members`
- `/members/[slug]`

### Fields
- `title`
- `slug`
- `avatar`
- `bio`
- `role`
- `featured`
- social links

### Design Principle
Prefer a generic data contract and light route support first. Keep custom community styling thin and replaceable.

## Non-MVP
- full admin CRUD backend
- permission system
- event registration storage
- internal member onboarding workflow

## Next Shared Candidates
- `Event` type
- multi-author post metadata beyond the IGNAI theme
- upstream-friendly related members / related events extraction

## Current Local Product Additions
- IGNAI post detail pages now resolve `author` / `author_slug` into visible member links.
- IGNAI post detail pages can display related members from `member_slugs` or `ext.member_slugs`.
- IGNAI post detail pages can display related events from `event_slugs` or `ext.event_slugs`.
