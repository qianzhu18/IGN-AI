import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getMemberPagePath } from '@/lib/utils/post'
import { getPublishedMembers, getMemberQuote, sortMembers } from '@/lib/utils/member'
import { Reveal } from '../Reveal'

const roleCards = [
  { title: 'AI Builders', description: '做 Agent、产品原型和自动化流程的人。' },
  { title: 'Product Explorers', description: '从用户、场景和痛点出发，探索 AI 产品机会的人。' },
  { title: 'Storytellers', description: '用文章、视频和社区记录传播高质量信号的人。' },
  { title: 'Local Connectors', description: '连接长沙高校、开发者、创业者和线下空间的人。' }
]

const GOLDEN_ANGLE = 137.508 * (Math.PI / 180)
const SCATTER_C = 26

function getAvatar(member) {
  return (
    member?.avatar ||
    member?.pageIcon ||
    member?.pageCoverThumbnail ||
    member?.pageCover ||
    '/avatar.svg'
  )
}

function usePhyllotaxis(members) {
  return useMemo(
    () =>
      members.map((_, i) => {
        const r = SCATTER_C * Math.sqrt(i + 1)
        const theta = i * GOLDEN_ANGLE
        return { x: Math.round(r * Math.cos(theta)), y: Math.round(r * Math.sin(theta)) }
      }),
    [members]
  )
}

function AvatarRing({ members }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const positions = usePhyllotaxis(members)

  const maxR = members.length > 0 ? SCATTER_C * Math.sqrt(members.length) : 120
  const containerSize = Math.max(400, Math.min(660, (maxR + 40) * 2))

  const hoveredMember = hoveredIndex !== null ? members[hoveredIndex] : null
  const hoveredPos = hoveredIndex !== null ? positions[hoveredIndex] : null

  return (
    <div
      className='avatar-scatter-container'
      style={{ width: containerSize, height: containerSize }}
    >
      {members.map((member, i) => {
        const pos = positions[i]
        const isHovered = hoveredIndex === i

        return (
          <motion.div
            key={member.id || member.slug || i}
            className='avatar-scatter-item'
            style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
            animate={{ scale: isHovered ? 1.85 : 1, zIndex: isHovered ? 40 : 2 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              href={getMemberPagePath(member)}
              className='block no-underline'
            >
              <img
                src={getAvatar(member)}
                alt={member.title}
                className={`avatar-scatter-img${isHovered ? ' avatar-scatter-img--hovered' : ''}`}
                draggable={false}
              />
            </Link>
          </motion.div>
        )
      })}

      <AnimatePresence>
        {hoveredMember && hoveredPos && (
          <motion.div
            className='avatar-scatter-card'
            style={{
              left: `calc(50% + ${hoveredPos.x}px)`,
              top: `calc(50% + ${hoveredPos.y}px)`,
            }}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <p className='avatar-scatter-card-name'>{hoveredMember.title}</p>
            {hoveredMember.role && (
              <p className='avatar-scatter-card-role'>{hoveredMember.role}</p>
            )}
            {(hoveredMember.bio || hoveredMember.summary) && (
              <p className='avatar-scatter-card-bio'>
                {hoveredMember.bio || hoveredMember.summary}
              </p>
            )}
            {getMemberQuote(hoveredMember) && (
              <p className='avatar-scatter-card-quote'>
                &ldquo;{getMemberQuote(hoveredMember)}&rdquo;
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CompactMemberGrid({ members }) {
  return (
    <div className='mx-auto grid max-w-4xl gap-4 md:grid-cols-3'>
      {members.map((member, index) => (
        <Reveal key={member.id || member.slug || index} delay={index * 0.08}>
          <Link
            href={getMemberPagePath(member)}
            className='block rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left no-underline transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]'
          >
            <div className='flex items-center gap-4'>
              <img
                src={getAvatar(member)}
                alt={member.title}
                className='h-14 w-14 rounded-full object-cover ring-1 ring-white/10'
              />
              <div className='min-w-0'>
                <p className='truncate text-base font-semibold text-white'>
                  {member.title}
                </p>
                {member.role && (
                  <p className='truncate text-sm text-neutral-400'>{member.role}</p>
                )}
              </div>
            </div>
            {(member.bio || member.summary) && (
              <p className='mt-4 line-clamp-3 text-sm leading-6 text-neutral-400'>
                {member.bio || member.summary}
              </p>
            )}
            {getMemberQuote(member) && (
              <p className='mt-4 text-sm italic leading-6 text-[#F0CB8A]/78'>
                &ldquo;{getMemberQuote(member)}&rdquo;
              </p>
            )}
          </Link>
        </Reveal>
      ))}
    </div>
  )
}

export function CommunityRolesSection({ allMembers = [] }) {
  const displayMembers = sortMembers(getPublishedMembers(allMembers)).slice(0, 100)
  const hasMembers = displayMembers.length > 0
  const useCompactLayout = displayMembers.length > 0 && displayMembers.length <= 3

  return (
    <section id='community-roles' className='ignai-home-section'>
      <div className='ignai-section-divider' />
      <div className='ignai-section-atmosphere' />
      <div className='ignai-home-container'>
        <Reveal className='text-center mb-16'>
          <p className='section-eyebrow'>Community Members</p>
          <h2 className='section-title mt-6'>这里有谁？</h2>
          <p className='section-body mt-6 max-w-lg mx-auto'>
            {hasMembers
              ? 'IGNAI 聚集了一群关注 AI、产品、表达和行动的人。'
              : 'IGNAI 聚集了一群关注 AI、产品、表达和行动的人。第一版先展示角色画像，等有真实授权后再升级成成员墙。'}
          </p>
        </Reveal>

        {useCompactLayout ? (
          <CompactMemberGrid members={displayMembers} />
        ) : hasMembers ? (
          <Reveal>
            <AvatarRing members={displayMembers} />
          </Reveal>
        ) : (
          <div className='flex flex-wrap justify-center gap-4 max-w-2xl mx-auto'>
            {roleCards.map((role, index) => (
              <Reveal key={role.title} delay={index * 0.08}>
                <div className='rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/70 hover:text-white hover:border-white/25 transition-all duration-300'>
                  {role.title}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {hasMembers && (
          <Reveal className='text-center mt-12'>
            <Link href='/members' className='text-sm text-neutral-400 hover:text-white transition no-underline'>
              View all members &rarr;
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
