import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getMemberPagePath } from '@/lib/utils/post'
import {
  getPublishedMembers,
  getMemberAvatar,
  getMemberQuote,
  isFeaturedMember,
  sortMembers
} from '@/lib/utils/member'
import { Reveal } from '../Reveal'

const roleCards = [
  { title: 'AI Builders', description: '做 Agent、产品原型和自动化流程的人。' },
  { title: 'Product Explorers', description: '从用户、场景和痛点出发，探索 AI 产品机会的人。' },
  { title: 'Storytellers', description: '用文章、视频和社区记录传播高质量信号的人。' },
  { title: 'Local Connectors', description: '连接长沙高校、开发者、创业者和线下空间的人。' }
]

const GOLDEN_ANGLE = 137.508 * (Math.PI / 180)

/* ── 工具 hooks ────────────────────────────────────────────── */

function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 600, height: 600 })
  useEffect(() => {
    if (!ref.current) return
    const obs = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect
      const h = Math.min(width, 660)
      setSize({ width, height: h })
    })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return size
}

/* ── 散点布局计算 ──────────────────────────────────────────── */

function computePositions(count, radius) {
  const positions = []
  for (let i = 0; i < count; i++) {
    const r = radius * Math.sqrt(i + 1)
    const theta = i * GOLDEN_ANGLE
    positions.push({
      x: r * Math.cos(theta),
      y: r * Math.sin(theta)
    })
  }
  return positions
}

/* ── 头像散点组件 ──────────────────────────────────────────── */

function AvatarShowcase({ members }) {
  const containerRef = useRef(null)
  const containerSize = useContainerSize(containerRef)
  const [activeIndex, setActiveIndex] = useState(null)
  const [tappedOnce, setTappedOnce] = useState(false)

  // 根据容器大小自适应
  const isNarrow = containerSize.width < 480
  const maxDisplay = isNarrow ? 28 : 56
  const displayMembers = members.slice(0, maxDisplay)

  // 散点半径：容器宽度的 38%
  const scatterRadius = Math.max(16, containerSize.width * 0.038)
  const positions = useMemo(
    () => computePositions(displayMembers.length, scatterRadius),
    [displayMembers.length, scatterRadius]
  )

  // 头像尺寸：基础 38px，featured 更大
  const baseAvatar = isNarrow ? 32 : 38
  const featuredAvatar = isNarrow ? 42 : 52

  // 计算容器需要的逻辑半径（用于定位）
  const maxR = displayMembers.length > 0
    ? scatterRadius * Math.sqrt(displayMembers.length)
    : 100
  const logicalSize = (maxR + featuredAvatar + 16) * 2

  // 缩放因子：让逻辑坐标系映射到实际容器
  const scale = containerSize.width > 0
    ? Math.min(1, containerSize.width / logicalSize)
    : 1

  const activeMember = activeIndex !== null ? displayMembers[activeIndex] : null
  const activePos = activeIndex !== null ? positions[activeIndex] : null

  // 移动端：tap 预览，再次 tap 进入详情
  const handleTap = useCallback((i, e) => {
    if (tappedOnce && activeIndex === i) {
      // 第二次 tap → 导航
      window.location.href = getMemberPagePath(displayMembers[i])
      return
    }
    setActiveIndex(i)
    setTappedOnce(true)
    // 3 秒后重置
    setTimeout(() => setTappedOnce(false), 3000)
  }, [tappedOnce, activeIndex, displayMembers])

  // 桌面端：hover 预览
  const handleMouseEnter = useCallback((i) => {
    setActiveIndex(i)
    setTappedOnce(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null)
    setTappedOnce(false)
  }, [])

  // 点击容器空白处关闭预览
  const handleContainerClick = useCallback((e) => {
    if (e.target === containerRef.current || e.target.closest('.avatar-scatter-container') === containerRef.current && !e.target.closest('.avatar-scatter-item')) {
      setActiveIndex(null)
      setTappedOnce(false)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className='avatar-scatter-container'
      style={{ height: Math.max(320, Math.min(660, containerSize.width * 0.85)) }}
      onClick={handleContainerClick}
    >
      {/* 散点头像 */}
      {displayMembers.map((member, i) => {
        const pos = positions[i]
        const isFeatured = isFeaturedMember(member)
        const isActive = activeIndex === i
        const avatarSize = isFeatured ? featuredAvatar : baseAvatar

        return (
          <div
            key={member.id || member.slug || i}
            className={`avatar-scatter-item${isFeatured ? ' avatar-scatter-item--featured' : ''}`}
            style={{
              left: `calc(50% + ${pos.x * scale}px)`,
              top: `calc(50% + ${pos.y * scale}px)`,
              width: avatarSize,
              height: avatarSize,
              transform: `translate(-50%, -50%) scale(${isActive ? 1.55 : 1})`,
              zIndex: isActive ? 50 : isFeatured ? 5 : 2
            }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => { e.stopPropagation(); handleTap(i, e) }}
          >
            <Link
              href={getMemberPagePath(member)}
              prefetch={false}
              className='block no-underline'
              onClick={(e) => {
                if (!isNarrow) return
                if (isNarrow && tappedOnce && activeIndex === i) {
                  // 允许导航
                } else {
                  e.preventDefault()
                }
              }}
            >
              <img
                src={getMemberAvatar(member)}
                alt={member.title}
                className={`avatar-scatter-img${isActive ? ' avatar-scatter-img--active' : ''}${isFeatured ? ' avatar-scatter-img--featured' : ''}`}
                style={{ width: avatarSize, height: avatarSize }}
                draggable={false}
              />
            </Link>
          </div>
        )
      })}

      {/* 移动端截断提示 */}
      {isNarrow && members.length > maxDisplay && (
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/40 pointer-events-none'>
          +{members.length - maxDisplay} more
        </div>
      )}

      {/* 预览卡片 */}
      <AnimatePresence>
        {activeMember && activePos && (
          <motion.div
            className='avatar-preview-card'
            style={{
              left: `calc(50% + ${activePos.x * scale}px)`,
              top: `calc(50% + ${activePos.y * scale}px)`,
            }}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div className='avatar-preview-card-inner'>
              <div className='flex items-center gap-3 mb-2'>
                <img
                  src={getMemberAvatar(activeMember)}
                  alt=''
                  className='h-8 w-8 rounded-full object-cover ring-1 ring-white/10'
                />
                <div className='min-w-0'>
                  <p className='text-sm font-semibold text-white truncate'>{activeMember.title}</p>
                  {activeMember.role && (
                    <p className='text-[11px] text-[#FF7A18] truncate'>{activeMember.role}</p>
                  )}
                </div>
              </div>
              {(activeMember.bio || activeMember.summary) && (
                <p className='text-xs leading-5 text-white/60 line-clamp-2 mb-1.5'>
                  {activeMember.bio || activeMember.summary}
                </p>
              )}
              {getMemberQuote(activeMember) && (
                <p className='text-[11px] italic text-white/36 line-clamp-1'>
                  &ldquo;{getMemberQuote(activeMember)}&rdquo;
                </p>
              )}
              {isNarrow && tappedOnce && (
                <p className='text-[10px] text-white/30 mt-2 text-center'>
                  再次点击查看详情
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── 紧凑网格（≤3 人时） ─────────────────────────────────── */

function CompactMemberGrid({ members }) {
  return (
    <div className='mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {members.map((member, index) => (
        <Reveal key={member.id || member.slug || index} delay={index * 0.08}>
          <Link
            href={getMemberPagePath(member)}
            prefetch={false}
            className='block rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left no-underline transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]'
          >
            <div className='flex items-center gap-4'>
              <img
                src={getMemberAvatar(member)}
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

/* ── 主组件 ────────────────────────────────────────────────── */

export function CommunityRolesSection({ allMembers = [] }) {
  const publishedMembers = sortMembers(getPublishedMembers(allMembers))
  const displayMembers = publishedMembers.slice(0, 96)
  const hasMembers = displayMembers.length > 0
  const useCompactLayout = displayMembers.length > 0 && displayMembers.length <= 3

  return (
    <section id='community-roles' className='ignai-home-section'>
      <div className='ignai-section-divider' />
      <div className='ignai-section-atmosphere' />
      <div className='ignai-home-container'>
        <Reveal className='text-center mb-12'>
          <p className='section-eyebrow'>Community Members</p>
          <h2 className='section-title mt-6'>这里有谁？</h2>
          <p className='section-body mt-6 max-w-lg mx-auto'>
            {hasMembers
              ? `IGNAI 聚集了 ${publishedMembers.length} 位关注 AI、产品、表达和行动的人。`
              : 'IGNAI 聚集了一群关注 AI、产品、表达和行动的人。'}
          </p>
        </Reveal>

        {useCompactLayout ? (
          <CompactMemberGrid members={displayMembers} />
        ) : hasMembers ? (
          <Reveal>
            <AvatarShowcase members={displayMembers} />
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
