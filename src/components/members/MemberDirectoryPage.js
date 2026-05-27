import Link from 'next/link'
import { getMemberPagePath } from '@/lib/utils/post'
import {
  getMemberAvatar,
  getMemberJoinedAtText,
  getMemberQuote,
  getMemberVerificationLabel,
  isFeaturedMember
} from '@/lib/utils/member'

export default function MemberDirectoryPage({
  members = [],
  siteInfo,
  pageTitle,
  pageDescription
}) {
  return (
    <main className='min-h-screen bg-[#07080C] px-6 py-20 text-neutral-100'>
      <div className='mx-auto max-w-3xl'>
        <p className='mb-3 text-xs font-medium tracking-wider uppercase text-[#F0CB8A]/72'>
          Community Directory
        </p>
        <h1 className='text-3xl font-bold text-white'>{pageTitle}</h1>
        <p className='mt-3 text-base leading-7 text-neutral-400'>
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

        <div className='mt-12 flex flex-col gap-3'>
          {members.map(member => {
            const quote = getMemberQuote(member)
            const joined = getMemberJoinedAtText(member)
            const verified = getMemberVerificationLabel(member)

            return (
              <Link
                key={member.id || member.slug}
                href={getMemberPagePath(member)}
                className='group flex items-center gap-5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline'
              >
                <img
                  src={getMemberAvatar(member)}
                  alt={member.title || 'Member avatar'}
                  className='h-12 w-12 flex-shrink-0 rounded-full object-cover ring-1 ring-white/10'
                />

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h2 className='truncate text-base font-semibold text-white group-hover:text-[#ffd09a] transition'>
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
                      <span className='text-neutral-600 truncate max-w-[200px]'>&ldquo;{quote}&rdquo;</span>
                    )}
                  </div>
                  <p className='mt-1 text-sm text-neutral-500 truncate'>
                    {member.bio || member.summary || ''}
                  </p>
                </div>

                <div className='flex-shrink-0 text-white/30 group-hover:text-white/60 transition'>
                  <span className='text-sm'>&rarr;</span>
                </div>
              </Link>
            )
          })}

          {members.length === 0 && (
            <div className='rounded-lg border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center text-neutral-500'>
              No published members yet. Add Notion pages with `type = Member` and a `slug`.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
