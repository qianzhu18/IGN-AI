# Member MVP Checklist

## Data Layer
- [x] Define `Member` as a first-class page type in repo types
- [x] Expose `allMembers` from site data
- [x] Keep post-only lists backward-compatible
- [x] Add dedicated helper tests for member filtering and ordering

## Routing
- [x] Add `/members`
- [x] Add `/members/[slug]`
- [x] Add static paths generation for members
- [x] Add fallback member resolution when slug convention is inconsistent

## UI
- [x] Create member directory page
- [x] Create member detail page
- [x] Show avatar, bio, role
- [x] Show social links when present

## Content Contract
- [x] Document required fields
- [x] Document recommended fields
- [x] Document slug convention

## Upstream-Friendly Design
- [x] Keep implementation generic at the data layer
- [x] Avoid hardcoding community-specific branding into shared logic
- [x] Keep custom presentation separate from reusable logic
- [ ] Prepare a minimal upstream PR diff from the shared subset
