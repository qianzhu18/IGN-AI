import Link from 'next/link'
import { useState, useMemo } from 'react'
import { getMemberPagePath } from '@/lib/utils/post'
import {
  getMemberAvatar,
  getMemberQuote,
  getMemberVerificationLabel,
  isFeaturedMember
} from '@/lib/utils/member'

function MemberRow({ member }) {
  const quote = getMemberQuote(member)
  const verified = getMemberVerificationLabel(member)

  return (
    <Link
      href={getMemberPagePath(member)}
      className='group flex items-center gap-3 sm:gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 sm:px-4 py-3 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline'
    >
      <img
        src={getMemberAvatar(member)}
        alt={member.title || 'Member avatar'}
        className='h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-full object-cover ring-1 ring-white/10'
      />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='truncate text-sm font-medium text-white group-hover:text-[#ffd09a] transition'>
            {member.title}
          </span>
          {isFeaturedMember(member) && (
            <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] text-emerald-200'>
              Featured
            </span>
          )}
          {verified && (
            <span className='rounded-full border border-sky-400/25 bg-sky-400/10 px-1.5 py-0.5 text-[10px] text-sky-100'>
              {verified}
            </span>
          )}
        </div>
        {quote && (
          <p className='mt-0.5 text-xs text-neutral-600 truncate hidden sm:block'>
            &ldquo;{quote}&rdquo;
          </p>
        )}
      </div>
      <span className='flex-shrink-0 text-xs text-white/20 group-hover:text-white/50 transition'>&rarr;</span>
    </Link>
  )
}

function RoleGroup({ role, members, isOpen, onToggle }) {
  return (
    <div className='rounded-xl border border-white/[0.06] bg-white/[0.015] overflow-hidden'>
      <button
        onClick={onToggle}
        className='w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 text-left hover:bg-white/[0.03] transition-colors'
      >
        <div className='flex items-center gap-3 min-w-0'>
          <span className='text-sm sm:text-base font-semibold text-white truncate'>{role}</span>
          <span className='flex-shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-neutral-400'>
            {members.length}
          </span>
        </div>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox='0 0 16 16' fill='none'
        >
          <path d='M4 6l4 4 4-4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>

      {isOpen && (
        <div className='px-3 sm:px-4 pb-3 sm:pb-4 flex flex-col gap-1.5 sm:gap-2'>
          {members.map(member => (
            <MemberRow key={member.id || member.slug} member={member} />
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

  const groups = useMemo(() => {
    const map = new Map()
    for (const m of members) {
      const role = m.role || 'Other'
      if (!map.has(role)) map.set(role, [])
      map.get(role).push(m)
    }
    // 按组内人数降序
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length)
  }, [members])

  const toggleGroup = (role) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(role)) next.delete(role)
      else next.add(role)
      return next
    })
  }

  const expandAll = () => setOpenGroups(new Set(groups.map(([r]) => r)))
  const collapseAll = () => setOpenGroups(new Set())

  return (
    <main className='min-h-screen bg-[#07080C] px-4 sm:px-6 py-16 sm:py-20 text-neutral-100'>
      <div className='mx-auto max-w-3xl'>
        <p className='mb-3 text-xs font-medium tracking-wider uppercase text-[#F0CB8A]/72'>
          Community Directory
        </p>
        <h1 className='text-2xl sm:text-3xl font-bold text-white'>{pageTitle}</h1>
        <p className='mt-3 text-sm sm:text-base leading-7 text-neutral-400'>
          {pageDescription}
        </p>

        {/* 统计 + 展开/收起 */}
        <div className='mt-8 flex items-center justify-between'>
          <p className='text-xs text-neutral-500'>
            {members.length} members / {groups.length} groups
          </p>
          <div className='flex gap-2'>
            <button onClick={expandAll} className='text-xs text-neutral-500 hover:text-white transition'>
              Expand all
            </button>
            <span className='text-xs text-neutral-700'>|</span>
            <button onClick={collapseAll} className='text-xs text-neutral-500 hover:text-white transition'>
              Collapse
            </button>
          </div>
        </div>

        {/* 分组列表 */}
        <div className='mt-4 flex flex-col gap-2 sm:gap-3'>
          {groups.length === 0 ? (
            <div className='rounded-lg border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center text-neutral-500'>
              No published members yet.
            </div>
          ) : (
            groups.map(([role, roleMembers]) => (
              <RoleGroup
                key={role}
                role={role}
                members={roleMembers}
                isOpen={openGroups.has(role)}
                onToggle={() => toggleGroup(role)}
              />
            ))
          )}
        </div>
      </div>
    </main>
  )
}
