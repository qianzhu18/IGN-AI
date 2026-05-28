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

  return (
    <Link
      href={getMemberPagePath(member)}
      className='group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-white/[0.04] no-underline'
    >
      <img
        src={getMemberAvatar(member)}
        alt={member.title || 'Member avatar'}
        className='h-8 w-8 flex-shrink-0 rounded-full object-cover ring-1 ring-white/10'
      />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-1.5'>
          <span className='truncate text-sm text-white/90 group-hover:text-[#ffd09a] transition'>
            {member.title}
          </span>
          {isFeaturedMember(member) && (
            <span className='text-[10px] text-emerald-400'>*</span>
          )}
          {verified && (
            <span className='text-[10px] text-sky-400'>~</span>
          )}
        </div>
        {quote && (
          <p className='text-[11px] text-neutral-600 truncate mt-0.5'>&ldquo;{quote}&rdquo;</p>
        )}
      </div>
      <span className='text-xs text-white/15 group-hover:text-white/40 transition'>&rarr;</span>
    </Link>
  )
}

function RoleGroup({ index, role, members, isOpen, onToggle }) {
  return (
    <div className='border-b border-white/[0.06] last:border-b-0'>
      <button
        onClick={onToggle}
        className='w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors'
      >
        <span className='flex-shrink-0 w-6 text-right text-xs font-mono text-neutral-600'>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className='flex-1 text-sm font-medium text-white/80'>{role}</span>
        <span className='flex-shrink-0 text-xs text-neutral-600 mr-2'>{members.length}</span>
        <svg
          className={`h-3.5 w-3.5 flex-shrink-0 text-neutral-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox='0 0 16 16' fill='none'
        >
          <path d='M4 6l4 4 4-4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>

      {isOpen && (
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

  const groups = useMemo(() => {
    const map = new Map()
    for (const m of members) {
      const role = m.role || 'Other'
      if (!map.has(role)) map.set(role, [])
      map.get(role).push(m)
    }
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
    <main className='min-h-screen bg-[#07080C] text-neutral-100'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-20'>
        {/* Header */}
        <div className='mb-8'>
          <p className='mb-3 text-xs font-medium tracking-wider uppercase text-[#F0CB8A]/72'>
            Community Directory
          </p>
          <h1 className='text-2xl sm:text-3xl font-bold text-white'>{pageTitle}</h1>
          <p className='mt-3 text-sm text-neutral-400 leading-relaxed'>{pageDescription}</p>
        </div>

        {/* Meta bar */}
        <div className='flex items-center justify-between mb-4'>
          <p className='text-xs text-neutral-600'>
            {members.length} members / {groups.length} roles
          </p>
          <div className='flex gap-3'>
            <button onClick={expandAll} className='text-xs text-neutral-600 hover:text-white/70 transition'>
              Expand all
            </button>
            <button onClick={collapseAll} className='text-xs text-neutral-600 hover:text-white/70 transition'>
              Collapse
            </button>
          </div>
        </div>

        {/* Accordion */}
        <div className='rounded-xl border border-white/[0.06] bg-white/[0.015] overflow-hidden'>
          {groups.length === 0 ? (
            <div className='px-6 py-12 text-center text-sm text-neutral-500'>
              No published members yet.
            </div>
          ) : (
            groups.map(([role, roleMembers], i) => (
              <RoleGroup
                key={role}
                index={i}
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
