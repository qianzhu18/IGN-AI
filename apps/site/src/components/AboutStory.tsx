'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

export type AboutStoryData = {
  blockType?: 'aboutStory'
  cta?: { copy?: string | null; href?: string | null; label?: string | null; title?: string | null } | null
  faq?: Array<{ a?: string | null; id?: string | null; q?: string | null }> | null
  hero?: { copy?: string | null; eyebrow?: string | null; line1?: string | null; line2?: string | null } | null
  mission?: {
    eyebrow?: string | null
    paragraphs?: Array<{ id?: string | null; text?: string | null }> | null
    title?: string | null
  } | null
  stats?: Array<{ id?: string | null; label?: string | null; num?: string | null }> | null
  values?: Array<{ desc?: string | null; id?: string | null; title?: string | null }> | null
  valuesTitle?: string | null
}

type NormalizedAboutStory = {
  blockType: 'aboutStory'
  cta: { copy: string; href: string; label: string; title: string }
  faq: Array<{ a: string; id?: string | null; q: string }>
  hero: { copy: string; eyebrow: string; line1: string; line2: string }
  mission: {
    eyebrow: string
    paragraphs: Array<{ id?: string | null; text: string }>
    title: string
  }
  stats: Array<{ id?: string | null; label: string; num: string }>
  values: Array<{ desc: string; id?: string | null; title: string }>
  valuesTitle: string
}

export const defaultAboutStory = {
  blockType: 'aboutStory',
  cta: {
    copy: '如果你也不想让一次活动变成一次性见面，来认识我们。带着好奇、项目或一个还没想清楚的问题都可以。',
    href: '/join',
    label: '加入社区',
    title: 'Ignite before AGI.',
  },
  faq: [
    {
      a: '学生、开发者、产品人与创作者。有人刚接触 AI，有人已经在做产品，也有人只是想认识同频的人。',
      q: '谁会在这里？',
    },
    {
      a: '一起去活动、做小项目、参加分享和跨城见面。活动结束后，关系和讨论还能继续。',
      q: '这里会发生什么？',
    },
    {
      a: '从一次活动或一段具体交流开始。带着你正在做的事、一个问题，或者单纯的好奇来都可以。',
      q: '怎么进入？',
    },
  ],
  hero: {
    copy: '很多人是在活动中认识的。可一场活动结束之后，热情往往很快散开。IGNAI 从这个瞬间开始：让愿意再聚的人，有一个继续出现的理由。',
    eyebrow: 'About IGNAI',
    line1: '为什么会有',
    line2: 'IGNAI？',
  },
  mission: {
    eyebrow: 'Mission',
    paragraphs: [
      { text: 'IGNAI 聚集学生、开发者、产品人与创作者。我们在活动里认识彼此，也把一次见面之后还值得继续聊的工具、项目和想法留下来。' },
      { text: '我们不把每次活动做成一次性相遇，也不要求每个人都带着成熟项目来。对 AI 有好奇、愿意参与真实现场，就已经足够成为开始。' },
    ],
    title: '我们在做什么',
  },
  stats: [
    { label: '2050 最初同行者', num: '7 人' },
    { label: '后来参与青年团聚', num: '70+' },
    { label: '第一次对外建立影响', num: '极客松' },
    { label: '愿意再聚的理由', num: 'Just for fun' },
  ],
  values: [
    { desc: '不要等想清楚一切再开始。从小项目、小分享、小连接开始。', title: '先行动' },
    { desc: '把想法说出来，让它有机会被看见、被讨论、被连接。', title: '先表达' },
    { desc: '让群聊关系走向真实协作，让线上认识走向线下见面。', title: '先连接' },
    { desc: '社区不是一次活动，是持续的学习、实践、分享和彼此点燃。', title: '持续做' },
  ],
  valuesTitle: '我们相信什么',
} satisfies AboutStoryData

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

function nonEmpty<T>(items: T[] | null | undefined, fallback: T[]): T[] {
  return Array.isArray(items) && items.length ? items : fallback
}

function text(value: string | null | undefined, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export function normalizeAboutStory(story?: AboutStoryData | null): NormalizedAboutStory {
  const fallback = defaultAboutStory
  const missionParagraphs = nonEmpty(story?.mission?.paragraphs, fallback.mission.paragraphs)

  return {
    blockType: 'aboutStory',
    cta: {
      copy: text(story?.cta?.copy, fallback.cta.copy),
      href: text(story?.cta?.href, fallback.cta.href),
      label: text(story?.cta?.label, fallback.cta.label),
      title: text(story?.cta?.title, fallback.cta.title),
    },
    faq: nonEmpty(story?.faq, fallback.faq).map((item, index) => ({
      a: text(item.a, fallback.faq[index]?.a || fallback.faq[0].a),
      id: item.id,
      q: text(item.q, fallback.faq[index]?.q || fallback.faq[0].q),
    })),
    hero: {
      copy: text(story?.hero?.copy, fallback.hero.copy),
      eyebrow: text(story?.hero?.eyebrow, fallback.hero.eyebrow),
      line1: text(story?.hero?.line1, fallback.hero.line1),
      line2: text(story?.hero?.line2, fallback.hero.line2),
    },
    mission: {
      eyebrow: text(story?.mission?.eyebrow, fallback.mission.eyebrow),
      paragraphs: missionParagraphs.map((paragraph, index) => ({
        id: paragraph.id,
        text: text(paragraph.text, fallback.mission.paragraphs[index]?.text || fallback.mission.paragraphs[0].text),
      })),
      title: text(story?.mission?.title, fallback.mission.title),
    },
    stats: nonEmpty(story?.stats, fallback.stats).map((stat, index) => ({
      id: stat.id,
      label: text(stat.label, fallback.stats[index]?.label || fallback.stats[0].label),
      num: text(stat.num, fallback.stats[index]?.num || fallback.stats[0].num),
    })),
    values: nonEmpty(story?.values, fallback.values).map((value, index) => ({
      desc: text(value.desc, fallback.values[index]?.desc || fallback.values[0].desc),
      id: value.id,
      title: text(value.title, fallback.values[index]?.title || fallback.values[0].title),
    })),
    valuesTitle: story?.valuesTitle || fallback.valuesTitle,
  }
}

export function AboutStorySection({ story }: { story?: AboutStoryData | null }) {
  const about = normalizeAboutStory(story)
  const shouldReduceMotion = useReducedMotion()
  const motionProps = shouldReduceMotion ? {} : { initial: 'hidden' as const, whileInView: 'visible' as const }

  return (
    <main className="about-story">
      <section className="about-story__hero">
        <motion.div
          animate={{ opacity: 1, y: shouldReduceMotion ? 0 : -8 }}
          className="about-story__glow"
          initial={{ opacity: 0, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          animate="visible"
          className="about-story__hero-inner"
          initial="hidden"
          variants={stagger}
        >
          <motion.p className="about-story__eyebrow" variants={fadeUp}>
            {about.hero.eyebrow}
          </motion.p>
          <motion.h1 className="about-story__headline" variants={fadeUp}>
            <span>{about.hero.line1}</span>
            <span className="about-story__headline-accent">{about.hero.line2}</span>
          </motion.h1>
          <motion.p className="about-story__lead" variants={fadeUp}>
            {about.hero.copy}
          </motion.p>
        </motion.div>
      </section>

      <section className="about-story__stats">
        <motion.div className="about-story__stats-grid" viewport={{ once: true, margin: '-96px' }} variants={stagger} {...motionProps}>
          {about.stats.map((stat, index) => (
            <motion.div className="about-story__stat" key={stat.id || `${stat.num}-${index}`} variants={fadeUp}>
              <p>{stat.num}</p>
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="about-story__mission">
        <motion.div className="about-story__mission-grid" viewport={{ once: true, margin: '-96px' }} variants={stagger} {...motionProps}>
          <div>
            <motion.p className="about-story__eyebrow" variants={fadeUp}>
              {about.mission.eyebrow}
            </motion.p>
            <motion.h2 className="about-story__section-title" variants={fadeUp}>
              {about.mission.title}
            </motion.h2>
            {about.mission.paragraphs.map((paragraph, index) => (
              <motion.p className="about-story__copy" key={paragraph.id || index} variants={fadeUp}>
                {paragraph.text}
              </motion.p>
            ))}
          </div>
          <motion.div className="about-story__panel" variants={fadeUp}>
            {about.faq.map((item, index) => (
              <div className="about-story__qa" key={item.id || `${item.q}-${index}`}>
                <p>{item.q}</p>
                <span>{item.a}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="about-story__values">
        <motion.div className="about-story__values-inner" viewport={{ once: true, margin: '-96px' }} variants={stagger} {...motionProps}>
          <motion.p className="about-story__eyebrow about-story__eyebrow--center" variants={fadeUp}>
            Values
          </motion.p>
          <motion.h2 className="about-story__section-title about-story__section-title--center" variants={fadeUp}>
            {about.valuesTitle}
          </motion.h2>
          <div className="about-story__value-grid">
            {about.values.map((value, index) => (
              <motion.article className="about-story__value-card" key={value.id || `${value.title}-${index}`} variants={fadeUp}>
                <div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{value.title}</h3>
                </div>
                <p>{value.desc}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="about-story__cta">
        <motion.div animate="visible" className="about-story__cta-inner" initial="hidden" variants={stagger}>
          <motion.h2 className="about-story__section-title about-story__section-title--center" variants={fadeUp}>
            {about.cta.title}
          </motion.h2>
          <motion.p className="about-story__lead" variants={fadeUp}>
            {about.cta.copy}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link className="primary-action" href={about.cta.href || '/join'}>
              {about.cta.label} <span aria-hidden="true">↗</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
