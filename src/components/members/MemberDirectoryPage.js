import Link from 'next/link'
import {
  getMemberJoinedAtText,
  getMemberQuote,
  getMemberVerificationLabel,
  isFeaturedMember
} from '@/lib/utils/member'

function getAvatar(member) {
  return (
    member?.avatar ||
    member?.pageIcon ||
    member?.pageCoverThumbnail ||
    member?.pageCover ||
    '/avatar.svg'
  )
}

function getMemberHref(member) {
  const slug = member?.slug || member?.href || member?.id || ''
  const path = String(slug).replace(/^\/+/, '')
  if (path.startsWith('members/')) {
    return `/${path}`
  }
  return `/members/${path.split('/').filter(Boolean).pop()}`
}

export default function MemberDirectoryPage({
  members = [],
  siteInfo,
  pageTitle,
  pageDescription
}) {
  return (
    <main className='min-h-screen bg-neutral-950 px-6 py-16 text-neutral-100'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-10 max-w-3xl'>
          <p className='mb-3 text-sm uppercase tracking-[0.18em] text-neutral-400'>
            Community Directory
          </p>
          <h1 className='text-4xl font-semibold text-white'>{pageTitle}</h1>
          <p className='mt-4 text-base leading-7 text-neutral-300'>
            {pageDescription}
          </p>
          {siteInfo?.link && (
            <a
              className='mt-4 inline-flex text-sm text-neutral-400 underline-offset-4 hover:text-white hover:underline'
              href={siteInfo.link}
            >
              Back to site
            </a>
          )}
        </div>

        {members.length === 0 ? (
          <div className='rounded-lg border border-white/10 bg-white/5 p-8 text-neutral-300'>
            No published members yet. Add Notion pages with `type = Member` and
            a `slug`.
          </div>
        ) : (
          <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {members.map(member => (
              <Link
                key={member.id || member.slug}
                href={getMemberHref(member)}
                className='group flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/[0.08]'
              >
                <div className='flex items-start gap-4'>
                  <img
                    src={getAvatar(member)}
                    alt={member.title || 'Member avatar'}
                    className='h-16 w-16 rounded-full object-cover ring-1 ring-white/10'
                  />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <h2 className='truncate text-xl font-medium text-white'>
                        {member.title}
                      </h2>
                      {isFeaturedMember(member) && (
                        <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-200'>
                          Featured
                        </span>
                      )}
                      {getMemberVerificationLabel(member) && (
                        <span className='rounded-full border border-sky-400/25 bg-sky-400/10 px-2 py-0.5 text-xs text-sky-100'>
                          {getMemberVerificationLabel(member)}
                        </span>
                      )}
                    </div>
                    <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-400'>
                      {member.role && <p>{member.role}</p>}
                      {getMemberJoinedAtText(member) && (
                        <p>Joined {getMemberJoinedAtText(member)}</p>
                      )}
                    </div>
                  </div>
                </div>
                <p className='mt-4 line-clamp-4 text-sm leading-6 text-neutral-300'>
                  {member.bio || member.summary || 'No bio yet.'}
                </p>
                {getMemberQuote(member) && (
                  <p className='mt-4 line-clamp-2 text-sm italic text-neutral-400'>
                    &ldquo;{getMemberQuote(member)}&rdquo;
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
