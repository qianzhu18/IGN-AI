import Link from 'next/link'
import { useState } from 'react'
import { getMemberPagePath } from '@/lib/utils/post'
import {
  getMemberAvatar,
  getMemberJoinedAtText,
  getMemberQuote,
  getMemberVerificationLabel,
  isFeaturedMember
} from '@/lib/utils/member'

const PAGE_SIZE = 20

function MemberRow({ member }) {
  const quote = getMemberQuote(member)
  const joined = getMemberJoinedAtText(member)
  const verified = getMemberVerificationLabel(member)

  return (
    <Link
      href={getMemberPagePath(member)}
      className='group flex items-center gap-4 sm:gap-5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 sm:px-5 py-4 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline'
    >
      <img
        src={getMemberAvatar(member)}
        alt={member.title || 'Member avatar'}
        className='h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-full object-cover ring-1 ring-white/10'
      />

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-1'>
          <h2 className='truncate text-sm sm:text-base font-semibold text-white group-hover:text-[#ffd09a] transition'>
            {member.title}
          </h2>
          {isFeaturedMember(member) && (
            <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-200'>
              Featured
            </span>
          )}
          {verified && (
            <span className='rounded-full border border-sky-400/25 bg-sky-400/10 px-2 py-0.5 text-[10px] text-sky-100'>
              {verified}
            </span>
          )}
        </div>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500'>
          {member.role && <span>{member.role}</span>}
          {joined && <span>Joined {joined}</span>}
          {quote && (
            <span className='text-neutral-600 hidden sm:inline truncate max-w-[200px]'>&ldquo;{quote}&rdquo;</span>
          )}
        </div>
        <p className='mt-1 text-xs sm:text-sm text-neutral-500 line-clamp-1'>
          {member.bio || member.summary || ''}
        </p>
      </div>

      <div className='flex-shrink-0 text-white/30 group-hover:text-white/60 transition'>
        <span className='text-sm'>&rarr;</span>
      </div>
    </Link>
  )
}

export default function MemberDirectoryPage({
  members = [],
  siteInfo,
  pageTitle,
  pageDescription
}) {
  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const visibleMembers = members.slice(0, showCount)
  const hasMore = showCount < members.length

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
        {siteInfo?.link && (
          <a
            className='mt-3 inline-flex text-sm text-neutral-500 underline-offset-4 hover:text-white hover:underline'
            href={siteInfo.link}
          >
            Back to site
          </a>
        )}

        {/* 成员计数 */}
        <p className='mt-8 text-xs text-neutral-500'>
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </p>

        <div className='mt-4 flex flex-col gap-2 sm:gap-3'>
          {visibleMembers.map(member => (
            <MemberRow key={member.id || member.slug} member={member} />
          ))}

          {members.length === 0 && (
            <div className='rounded-lg border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center text-neutral-500'>
              No published members yet. Add Notion pages with `type = Member` and a `slug`.
            </div>
          )}
        </div>

        {hasMore && (
          <div className='mt-8 text-center'>
            <button
              onClick={() => setShowCount(prev => prev + PAGE_SIZE)}
              className='rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300'
            >
              Load more ({members.length - showCount} remaining)
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
