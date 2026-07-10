import Link from 'next/link'
import { useState, useMemo } from 'react'
import { getMemberPagePath } from '@/lib/utils/post'
import {
  getMemberAvatar,
  getMemberQuote,
  getMemberVerificationLabel,
  isFeaturedMember
} from '@/lib/utils/member'

function MemberCard({ member }) {
  const quote = getMemberQuote(member)
  const verified = getMemberVerificationLabel(member)
  const role = member.role || '成员'
  const description = member.bio || member.summary || quote

  return (
    <Link
      href={getMemberPagePath(member)}
      prefetch={false}
      className='ignai-member-card group flex items-start gap-3 rounded-lg px-3 py-3 transition-all duration-200 no-underline'
    >
      <img
        src={getMemberAvatar(member)}
        alt={member.title || 'Member avatar'}
        className='ignai-member-avatar mt-0.5 h-10 w-10 flex-shrink-0 rounded-full object-cover'
      />
      <div className='flex-1 min-w-0'>
        <div className='flex min-w-0 flex-wrap items-center gap-2'>
          <span className='ignai-member-name truncate text-sm font-medium transition'>
            {member.title}
          </span>
          <span className='ignai-member-badge rounded-full px-2 py-0.5 text-[10px]'>
            {role}
          </span>
          {isFeaturedMember(member) && (
            <span className='ignai-member-badge ignai-member-badge-featured rounded-full px-2 py-0.5 text-[10px]'>
              Featured
            </span>
          )}
          {verified && (
            <span className='ignai-member-badge ignai-member-badge-verified rounded-full px-2 py-0.5 text-[10px]'>
              {verified}
            </span>
          )}
        </div>
        {description && (
          <p className='ignai-member-description mt-1 line-clamp-2 text-xs leading-5'>
            {description}
          </p>
        )}
      </div>
      <span className='ignai-member-arrow text-xs transition'>&rarr;</span>
    </Link>
  )
}

function RoleGroup({ index, role, members, isOpen, onToggle, forceOpen = false }) {
  const expanded = forceOpen || isOpen

  return (
    <div className='ignai-member-role-group last:border-b-0'>
      <button
        type='button'
        onClick={forceOpen ? undefined : onToggle}
        disabled={forceOpen}
        className={`ignai-member-role-toggle w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${forceOpen ? 'cursor-default' : ''}`}
      >
        <span className='ignai-member-role-index flex-shrink-0 w-6 text-right text-xs font-mono'>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className='ignai-member-role-title flex-1 text-sm font-medium'>{role}</span>
        <span className='ignai-member-role-count flex-shrink-0 text-xs mr-2'>{members.length}</span>
        {!forceOpen && (
          <svg
            className={`ignai-member-role-chevron h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            viewBox='0 0 16 16' fill='none'
          >
            <path d='M4 6l4 4 4-4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        )}
      </button>

      {expanded && (
        <div className='pb-2'>
          {members.map(member => (
            <MemberCard key={member.id || member.slug} member={member} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MemberDirectoryPage({
  members = [],
  siteInfo,
  pageTitle,
  pageDescription
}) {
  const [openGroups, setOpenGroups] = useState(new Set())
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(null)
  const [showAllRoles, setShowAllRoles] = useState(false)
  const isCompactPublicDirectory = members.length > 0 && members.length <= 6

  const groups = useMemo(() => {
    const map = new Map()
    for (const m of members) {
      const role = m.role || 'Other'
      if (!map.has(role)) map.set(role, [])
      map.get(role).push(m)
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length)
  }, [members])

  const allRoles = useMemo(
    () => groups.map(([role, roleMembers]) => ({
      role,
      count: roleMembers.length
    })),
    [groups]
  )
  const visibleRoles = isCompactPublicDirectory || showAllRoles ? allRoles : allRoles.slice(0, 10)

  const filteredMembers = useMemo(() => {
    let list = members
    if (roleFilter) {
      list = list.filter(m => (m.role || 'Other') === roleFilter)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(m =>
        (m.title || '').toLowerCase().includes(q) ||
        (m.role || '').toLowerCase().includes(q) ||
        (m.bio || '').toLowerCase().includes(q) ||
        (m.summary || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [members, search, roleFilter])

  const filteredGroups = useMemo(() => {
    const map = new Map()
    for (const m of filteredMembers) {
      const role = m.role || 'Other'
      if (!map.has(role)) map.set(role, [])
      map.get(role).push(m)
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length)
  }, [filteredMembers])

  const isFiltering = Boolean(search.trim() || roleFilter)

  const toggleGroup = (role) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(role)) next.delete(role)
      else next.add(role)
      return next
    })
  }

  const expandAll = () => setOpenGroups(new Set(filteredGroups.map(([r]) => r)))
  const collapseAll = () => setOpenGroups(new Set())

  return (
    <main className='ignai-member-directory min-h-screen'>
      <style jsx global>{`
        .ignai-member-directory {
          background:
            radial-gradient(circle at 12% 0%, rgba(255, 111, 35, 0.12), transparent 30rem),
            radial-gradient(circle at 92% 8%, rgba(104, 157, 255, 0.08), transparent 28rem),
            #07080c;
          color: rgba(255, 247, 235, 0.92);
        }

        .ignai-member-directory-shell {
          padding-top: clamp(5.5rem, 8vw, 7.5rem);
          padding-bottom: clamp(4rem, 7vw, 6rem);
        }

        .ignai-member-directory-panel,
        .ignai-member-public-note,
        .ignai-member-list-panel {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.026);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.16);
        }

        .ignai-member-eyebrow,
        .ignai-member-filter-title,
        .ignai-member-note-label {
          color: rgba(240, 203, 138, 0.78);
        }

        .ignai-member-title {
          color: rgba(255, 250, 241, 0.96);
        }

        .ignai-member-lead,
        .ignai-member-filter-copy,
        .ignai-member-note-copy {
          color: rgba(255, 247, 235, 0.52);
        }

        .ignai-member-search-icon,
        .ignai-member-clear-icon,
        .ignai-member-meta,
        .ignai-member-role-index,
        .ignai-member-role-count,
        .ignai-member-role-chevron {
          color: rgba(255, 247, 235, 0.34);
        }

        .ignai-member-search-input {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 250, 241, 0.94);
        }

        .ignai-member-search-input::placeholder {
          color: rgba(255, 247, 235, 0.3);
        }

        .ignai-member-search-input:focus {
          border-color: rgba(255, 208, 154, 0.36);
          outline: none;
          box-shadow: 0 0 0 1px rgba(255, 208, 154, 0.16);
        }

        .ignai-member-chip,
        .ignai-member-list-action {
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 247, 235, 0.48);
        }

        .ignai-member-chip:hover,
        .ignai-member-list-action:hover {
          border-color: rgba(255, 255, 255, 0.16);
          color: rgba(255, 247, 235, 0.76);
          background: rgba(255, 255, 255, 0.04);
        }

        .ignai-member-chip.is-active {
          border-color: rgba(255, 208, 154, 0.34);
          background: rgba(255, 208, 154, 0.1);
          color: rgba(255, 247, 235, 0.92);
        }

        .ignai-member-chip-count {
          color: rgba(255, 247, 235, 0.36);
        }

        .ignai-member-role-group {
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .ignai-member-role-toggle:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .ignai-member-role-title {
          color: rgba(255, 247, 235, 0.82);
        }

        .ignai-member-card:hover {
          background: rgba(255, 255, 255, 0.045);
        }

        .ignai-member-avatar {
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12);
        }

        .ignai-member-name {
          color: rgba(255, 247, 235, 0.9);
        }

        .ignai-member-card:hover .ignai-member-name {
          color: #ffd09a;
        }

        .ignai-member-badge {
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 247, 235, 0.44);
        }

        .ignai-member-badge-featured {
          border-color: rgba(52, 211, 153, 0.22);
          color: rgba(110, 231, 183, 0.82);
        }

        .ignai-member-badge-verified {
          border-color: rgba(56, 189, 248, 0.22);
          color: rgba(125, 211, 252, 0.82);
        }

        .ignai-member-description {
          color: rgba(255, 247, 235, 0.46);
        }

        .ignai-member-arrow {
          color: rgba(255, 247, 235, 0.18);
        }

        .ignai-member-card:hover .ignai-member-arrow {
          color: rgba(255, 247, 235, 0.48);
        }

        html.light .ignai-member-directory {
          background: transparent;
          color: #21150f;
        }

        html.light .ignai-member-directory-panel,
        html.light .ignai-member-public-note,
        html.light .ignai-member-list-panel {
          border-color: rgba(132, 82, 43, 0.14);
          background: rgba(255, 252, 247, 0.7);
          box-shadow: 0 18px 48px rgba(121, 76, 43, 0.06);
        }

        html.light .ignai-member-eyebrow,
        html.light .ignai-member-filter-title,
        html.light .ignai-member-note-label {
          color: rgba(212, 124, 45, 0.76);
        }

        html.light .ignai-member-title {
          color: #25150e;
        }

        html.light .ignai-member-lead,
        html.light .ignai-member-filter-copy,
        html.light .ignai-member-note-copy {
          color: rgba(59, 43, 31, 0.62);
        }

        html.light .ignai-member-search-icon,
        html.light .ignai-member-clear-icon,
        html.light .ignai-member-meta,
        html.light .ignai-member-role-index,
        html.light .ignai-member-role-count,
        html.light .ignai-member-role-chevron {
          color: rgba(48, 31, 20, 0.44);
        }

        html.light .ignai-member-search-input {
          border-color: rgba(132, 82, 43, 0.14);
          background: rgba(255, 255, 255, 0.72);
          color: #25150e;
        }

        html.light .ignai-member-search-input::placeholder {
          color: rgba(48, 31, 20, 0.34);
        }

        html.light .ignai-member-search-input:focus {
          border-color: rgba(242, 101, 34, 0.35);
          box-shadow: 0 0 0 1px rgba(242, 101, 34, 0.12);
        }

        html.light .ignai-member-chip,
        html.light .ignai-member-list-action {
          border-color: rgba(132, 82, 43, 0.14);
          color: rgba(48, 31, 20, 0.62);
          background: rgba(255, 255, 255, 0.28);
        }

        html.light .ignai-member-chip:hover,
        html.light .ignai-member-list-action:hover {
          border-color: rgba(242, 101, 34, 0.26);
          color: #25150e;
          background: rgba(255, 246, 236, 0.82);
        }

        html.light .ignai-member-chip.is-active {
          border-color: rgba(242, 101, 34, 0.35);
          background: rgba(242, 101, 34, 0.08);
          color: #25150e;
        }

        html.light .ignai-member-chip-count {
          color: rgba(48, 31, 20, 0.42);
        }

        html.light .ignai-member-role-group {
          border-bottom-color: rgba(132, 82, 43, 0.12);
        }

        html.light .ignai-member-role-toggle:not(:disabled):hover,
        html.light .ignai-member-card:hover {
          background: rgba(242, 101, 34, 0.045);
        }

        html.light .ignai-member-role-title,
        html.light .ignai-member-name {
          color: #25150e;
        }

        html.light .ignai-member-card:hover .ignai-member-name {
          color: #f15a24;
        }

        html.light .ignai-member-avatar {
          box-shadow: 0 0 0 1px rgba(132, 82, 43, 0.16);
        }

        html.light .ignai-member-badge {
          border-color: rgba(132, 82, 43, 0.14);
          color: rgba(48, 31, 20, 0.52);
          background: rgba(255, 255, 255, 0.42);
        }

        html.light .ignai-member-badge-featured {
          border-color: rgba(16, 185, 129, 0.24);
          color: rgba(4, 120, 87, 0.9);
        }

        html.light .ignai-member-badge-verified {
          border-color: rgba(14, 165, 233, 0.24);
          color: rgba(3, 105, 161, 0.9);
        }

        html.light .ignai-member-description {
          color: rgba(48, 31, 20, 0.54);
        }

        html.light .ignai-member-arrow {
          color: rgba(48, 31, 20, 0.22);
        }

        html.light .ignai-member-card:hover .ignai-member-arrow {
          color: rgba(48, 31, 20, 0.56);
        }

        @media (max-width: 640px) {
          .ignai-member-directory-shell {
            padding-top: 4.75rem;
          }
        }
      `}</style>
      <div className='ignai-member-directory-shell mx-auto w-full max-w-[880px] px-5 sm:px-6'>
        {/* Header */}
        <div className='mb-7'>
          <p className='ignai-member-eyebrow mb-3 text-xs font-semibold tracking-[0.18em] uppercase'>
            Community Directory
          </p>
          <h1 className='ignai-member-title text-3xl sm:text-4xl font-bold tracking-tight'>{pageTitle}</h1>
          <p className='ignai-member-lead mt-3 max-w-2xl text-sm sm:text-base leading-relaxed'>{pageDescription}</p>
        </div>

        {isCompactPublicDirectory && !isFiltering && (
          <div className='ignai-member-public-note mb-5 rounded-xl p-4 sm:p-5'>
            <p className='ignai-member-note-label text-[11px] font-semibold uppercase tracking-[0.16em]'>
              Public Preview
            </p>
            <p className='ignai-member-note-copy mt-2 text-sm leading-6'>
              这里只展示已经授权公开的成员资料。IGNAI 的社区规模和日常连接主要发生在微信与线下活动里，成员墙会随着大家愿意公开的信息逐步补齐。
            </p>
          </div>
        )}

        {/* Search + Filter */}
        <div className='ignai-member-directory-panel mb-5 space-y-4 rounded-xl p-4 sm:p-5'>
          <div className='relative'>
            <svg className='ignai-member-search-icon absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5'>
              <circle cx='7' cy='7' r='5' />
              <path d='M11 11l3.5 3.5' strokeLinecap='round' />
            </svg>
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='搜索成员...'
              className='ignai-member-search-input w-full rounded-lg py-2.5 pl-10 pr-4 text-sm transition'
            />
            {search && (
              <button
                type='button'
                onClick={() => setSearch('')}
                className='ignai-member-clear-icon absolute right-3 top-1/2 -translate-y-1/2 transition'
              >
                <svg className='h-3.5 w-3.5' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <path d='M4 4l8 8M12 4l-8 8' strokeLinecap='round' />
                </svg>
              </button>
            )}
          </div>

          <div>
            <div className='mb-3 flex items-center justify-between gap-3'>
              <div>
                <p className='ignai-member-filter-title text-[11px] font-semibold uppercase tracking-[0.16em]'>
                  按角色筛选
                </p>
                <p className='ignai-member-filter-copy mt-1 text-xs'>
                  {isCompactPublicDirectory
                    ? '当前展示已公开资料的成员角色。'
                    : '先展示人数较多的角色，更多角色可展开。'}
                </p>
              </div>
              {allRoles.length > 10 && !isCompactPublicDirectory && (
                <button
                  type='button'
                  onClick={() => setShowAllRoles(value => !value)}
                  className='ignai-member-chip shrink-0 rounded-full px-3 py-1.5 text-xs transition'
                >
                  {showAllRoles ? '收起角色' : `更多 ${allRoles.length - 10} 个`}
                </button>
              )}
            </div>

            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => setRoleFilter(null)}
                className={`ignai-member-chip rounded-full px-3 py-1.5 text-xs transition ${!roleFilter ? 'is-active' : ''}`}
              >
                全部
                <span className='ignai-member-chip-count ml-1'>{members.length}</span>
              </button>
              {visibleRoles.map(({ role, count }) => (
                <button
                  key={role}
                  type='button'
                  onClick={() => setRoleFilter(roleFilter === role ? null : role)}
                  className={`ignai-member-chip rounded-full px-3 py-1.5 text-xs transition ${roleFilter === role ? 'is-active' : ''}`}
                >
                  {role}
                  <span className='ignai-member-chip-count ml-1'>{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meta bar */}
        <div className='flex items-center justify-between mb-4'>
          <p className='ignai-member-meta text-xs'>
            {isFiltering
              ? `${filteredMembers.length} / ${members.length} 位成员`
              : `${members.length} 位成员 / ${groups.length} 个角色`}
          </p>
          {!isCompactPublicDirectory && (
            <div className='flex gap-2'>
              <button type='button' onClick={expandAll} className='ignai-member-list-action rounded-md px-2.5 py-1.5 text-xs transition'>
                展开全部
              </button>
              <button type='button' onClick={collapseAll} className='ignai-member-list-action rounded-md px-2.5 py-1.5 text-xs transition'>
                收起
              </button>
            </div>
          )}
        </div>

        {/* Accordion */}
        <div className='ignai-member-list-panel rounded-xl overflow-hidden'>
          {filteredGroups.length === 0 ? (
            <div className='ignai-member-meta px-6 py-12 text-center text-sm'>
              {isFiltering ? '没有匹配的成员' : 'No published members yet.'}
            </div>
          ) : (
            filteredGroups.map(([role, roleMembers], i) => (
              <RoleGroup
                key={role}
                index={i}
                role={role}
                members={roleMembers}
                isOpen={isFiltering || openGroups.has(role)}
                onToggle={() => toggleGroup(role)}
                forceOpen={isCompactPublicDirectory}
              />
            ))
          )}
        </div>
      </div>
    </main>
  )
}
