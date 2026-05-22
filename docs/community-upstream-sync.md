# Community / Upstream Sync Plan

## Goal
Use this repository as both:

1. a real community product codebase
2. a staging ground for reusable NotionNext contributions

## Split Rule

### Good upstream candidates
- data-layer support for new page types
- route-generation helpers
- schema documentation
- backward-compatible filters and selectors

### Keep local for now
- IGN AI-specific branding
- custom narrative sections
- local growth loops
- community-specific operations flows

## Recommended PR Order
1. docs: explain community-site use case
2. data layer: expose `allMembers`
3. routing: shared member route support or conventions
4. presentation: only propose generic UI if it is theme-agnostic and small

## Story To Tell Publicly
This is not random customization. It is a concrete example of extending a creator-blog framework into a community operating system, then feeding the reusable parts back upstream.
