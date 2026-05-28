import Link from 'next/link'
import {
  getMemberAvatar,
  getMemberJoinedAtText,
  getMemberQuote,
  getMemberVerificationLabel,
  isFeaturedMember
} from '@/lib/utils/member'

const SOCIAL_ICONS = {
  GitHub: (
    <svg className='h-3.5 w-3.5' viewBox='0 0 16 16' fill='currentColor'>
      <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
    </svg>
  ),
  X: (
    <svg className='h-3.5 w-3.5' viewBox='0 0 16 16' fill='currentColor'>
      <path d='M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z' />
    </svg>
  ),
  LinkedIn: (
    <svg className='h-3.5 w-3.5' viewBox='0 0 16 16' fill='currentColor'>
      <path d='M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z' />
    </svg>
  ),
  Website: (
    <svg className='h-3.5 w-3.5' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5'>
      <circle cx='8' cy='8' r='6.5' />
      <path d='M1.5 8h13M8 1.5c1.5 1.8 2.3 4 2.3 6.5s-.8 4.7-2.3 6.5M8 1.5c-1.5 1.8-2.3 4-2.3 6.5s.8 4.7 2.3 6.5' />
    </svg>
  )
}

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
            <div className='relative flex-shrink-0'>
              <img
                src={getMemberAvatar(member)}
                alt={member?.title || 'Member avatar'}
                className='h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-1 ring-white/10'
              />
              {isFeaturedMember(member) && (
                <div className='absolute inset-0 rounded-full bg-gradient-to-br from-[#FF7A18]/20 to-[#5DA9FF]/10 blur-xl -z-10' />
              )}
            </div>
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
                      className='inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-300 transition hover:border-white/25 hover:text-white'
                    >
                      {SOCIAL_ICONS[label]}
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
