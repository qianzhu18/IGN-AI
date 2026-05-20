import Link from 'next/link'
import { getMemberPagePath } from '@/lib/utils/post'
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
    <main className='min-h-screen bg-neutral-950 px-6 py-16 text-neutral-100'>
      <div className='mx-auto max-w-4xl'>
        <Link
          href='/members'
          className='mb-8 inline-flex text-sm text-neutral-400 underline-offset-4 hover:text-white hover:underline'
        >
          Back to members
        </Link>

        <section className='rounded-xl border border-white/10 bg-white/5 p-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-start'>
            <img
              src={getAvatar(member)}
              alt={member?.title || 'Member avatar'}
              className='h-28 w-28 rounded-full object-cover ring-1 ring-white/10'
            />
            <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center gap-3'>
                  <h1 className='text-3xl font-semibold text-white'>
                    {member?.title || 'Member'}
                  </h1>
                  {isFeaturedMember(member) && (
                    <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-200'>
                      Featured
                    </span>
                  )}
                  {verificationLabel && (
                    <span className='rounded-full border border-sky-400/25 bg-sky-400/10 px-2 py-0.5 text-xs text-sky-100'>
                      {verificationLabel}
                    </span>
                  )}
                </div>
              <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-neutral-300'>
                {member?.role && <p>{member.role}</p>}
                {joinedAtText && <p className='text-sm text-neutral-400'>Joined {joinedAtText}</p>}
              </div>
              <p className='mt-4 text-sm leading-7 text-neutral-300'>
                {member?.bio || member?.summary || siteInfo?.description || ''}
              </p>
              {quote && (
                <blockquote className='mt-5 border-l border-white/10 pl-4 text-sm italic leading-7 text-neutral-400'>
                  {quote}
                </blockquote>
              )}

              {socialLinks.length > 0 && (
                <div className='mt-6 flex flex-wrap gap-3'>
                  {socialLinks.map(([label, href]) => (
                    <a
                      key={`${label}-${href}`}
                      href={href}
                      target='_blank'
                      rel='noreferrer'
                      className='rounded-full border border-white/10 px-3 py-1.5 text-sm text-neutral-200 transition hover:border-white/25 hover:bg-white/10'
                    >
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className='mt-8 rounded-xl border border-white/10 bg-white/5 p-8'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-semibold text-white'>Related posts</h2>
              <p className='mt-2 text-sm text-neutral-400'>
                Articles currently linked to this member as author.
              </p>
            </div>
          </div>

          {authoredPosts.length === 0 ? (
            <p className='mt-6 text-sm text-neutral-400'>
              No authored posts linked yet.
            </p>
          ) : (
            <div className='mt-6 space-y-4'>
              {authoredPosts.map(post => (
                <article
                  key={post.id || post.slug}
                  className='rounded-lg border border-white/10 bg-black/10 p-4 transition hover:border-white/20 hover:bg-black/20'
                >
                  <div className='flex flex-wrap items-center gap-3 text-xs text-neutral-400'>
                    {post.publishDay && <span>{post.publishDay}</span>}
                    {Array.isArray(post.authors) && post.authors.length > 0 && (
                      <div className='flex flex-wrap items-center gap-2'>
                        <span>Authors</span>
                        {post.authors.map(author => (
                          <Link
                            key={author.id || author.slug || author.title}
                            href={getMemberPagePath(author)}
                            className='text-neutral-300 underline-offset-4 hover:text-white hover:underline'
                          >
                            {author.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    href={post.href || '/'}
                    className='mt-3 block text-lg font-medium text-white underline-offset-4 hover:underline'
                  >
                    {post.title}
                  </Link>
                  {post.summary && (
                    <p className='mt-2 text-sm leading-6 text-neutral-300'>
                      {post.summary}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
