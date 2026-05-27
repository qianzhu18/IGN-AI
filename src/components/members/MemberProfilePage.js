import Link from 'next/link'
import {
  getMemberAvatar,
  getMemberJoinedAtText,
  getMemberQuote,
  getMemberVerificationLabel,
  isFeaturedMember
} from '@/lib/utils/member'

function collectSocialLinks(member) {
  const candidates = [
    ['GitHub', member?.social_github || member?.socialGithub || member?.github],
    ['X', member?.social_x || member?.socialX || member?.x || member?.twitter],
    [
      'LinkedIn',
      member?.social_linkedin || member?.socialLinkedin || member?.linkedin
    ],
    ['Website', member?.website || member?.site || member?.link]
  ]

  return candidates.filter(([, href]) => typeof href === 'string' && href.trim())
}

export default function MemberProfilePage({ member, siteInfo, authoredPosts = [] }) {
  const socialLinks = collectSocialLinks(member)
  const verificationLabel = getMemberVerificationLabel(member)
  const joinedAtText = getMemberJoinedAtText(member)
  const quote = getMemberQuote(member)

  return (
    <main className='min-h-screen bg-[#07080C] px-4 sm:px-6 py-16 sm:py-20 text-neutral-100'>
      <div className='mx-auto max-w-3xl'>
        <Link
          href='/members'
          className='mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 -ml-3 text-sm text-neutral-500 hover:text-white hover:bg-white/[0.04] transition no-underline'
        >
          &larr; 返回成员列表
        </Link>

        <section className='mb-12'>
          <div className='flex flex-col gap-6 md:flex-row md:items-start'>
            <img
              src={getMemberAvatar(member)}
              alt={member?.title || 'Member avatar'}
              className='h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-1 ring-white/10'
            />
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-3 mb-2'>
                <h1 className='text-2xl font-bold text-white'>
                  {member?.title || 'Member'}
                </h1>
                {isFeaturedMember(member) && (
                  <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-200'>
                    Featured
                  </span>
                )}
                {verificationLabel && (
                  <span className='rounded-full border border-sky-400/25 bg-sky-400/10 px-2 py-0.5 text-[10px] text-sky-100'>
                    {verificationLabel}
                  </span>
                )}
              </div>
              <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-400 mb-4'>
                {member?.role && <span>{member.role}</span>}
                {joinedAtText && <span>Joined {joinedAtText}</span>}
              </div>
              <p className='text-sm leading-7 text-neutral-300'>
                {member?.bio || member?.summary || siteInfo?.description || ''}
              </p>
              {quote && (
                <blockquote className='mt-4 border-l border-white/10 pl-4 text-sm italic leading-7 text-neutral-400'>
                  {quote}
                </blockquote>
              )}

              {socialLinks.length > 0 && (
                <div className='mt-5 flex flex-wrap gap-2'>
                  {socialLinks.map(([label, href]) => (
                    <a
                      key={`${label}-${href}`}
                      href={href}
                      target='_blank'
                      rel='noreferrer'
                      className='rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-300 transition hover:border-white/25 hover:text-white'
                    >
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-lg font-semibold text-white mb-1'>相关文章</h2>
          <p className='text-xs text-neutral-500 mb-6'>
            以该成员为作者的文章。
          </p>

          {authoredPosts.length === 0 ? (
            <p className='text-sm text-neutral-500 py-8'>
              暂无关联文章。
            </p>
          ) : (
            <div className='flex flex-col gap-3'>
              {authoredPosts.map(post => (
                <Link
                  key={post.id || post.slug}
                  href={post.href || '/'}
                  className='group flex items-center gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline'
                >
                  <div className='flex-1 min-w-0'>
                    <div className='flex flex-wrap items-center gap-3 text-xs text-neutral-500 mb-1'>
                      {post.publishDay && <span>{post.publishDay}</span>}
                      {Array.isArray(post.authors) && post.authors.length > 0 && (
                        <span>
                          {post.authors.map(a => a.title).join(', ')}
                        </span>
                      )}
                    </div>
                    <h3 className='text-base font-medium text-white truncate group-hover:text-[#ffd09a] transition'>
                      {post.title}
                    </h3>
                    {post.summary && (
                      <p className='mt-1 text-sm text-neutral-500 truncate'>
                        {post.summary}
                      </p>
                    )}
                  </div>
                  <div className='flex-shrink-0 text-white/30 group-hover:text-white/60 transition'>
                    <span className='text-sm'>&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
