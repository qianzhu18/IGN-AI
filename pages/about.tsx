import Head from 'next/head'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import SmartLink from '@/components/SmartLink'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const values = [
  {
    icon: (
      <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    ),
    title: '先行动',
    desc: '不要等想清楚一切再开始。从小项目、小分享、小连接开始。'
  },
  {
    icon: (
      <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <path d='M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    ),
    title: '先表达',
    desc: '把想法说出来，让它有机会被看见、被讨论、被连接。'
  },
  {
    icon: (
      <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' /><circle cx='9' cy='7' r='4' /><path d='M23 21v-2a4 4 0 00-3-3.87' /><path d='M16 3.13a4 4 0 010 7.75' />
      </svg>
    ),
    title: '先连接',
    desc: '让群聊关系走向真实协作，让线上认识走向线下见面。'
  },
  {
    icon: (
      <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <circle cx='12' cy='12' r='10' /><path d='M12 6v6l4 2' strokeLinecap='round' />
      </svg>
    ),
    title: '持续做',
    desc: '社区不是一次活动，是持续的学习、实践、分享和彼此点燃。'
  }
]

const stats = [
  { num: '7 人', label: '2050 最初同行者' },
  { num: '70+', label: '后来参与青年团聚' },
  { num: '极客松', label: '第一次对外建立影响' },
  { num: 'Just for fun', label: '愿意再聚的理由' }
]

export default function AboutPage() {
  const heroRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -40])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, shouldReduceMotion ? 1 : 0.4])

  return (
    <>
      <Head>
        <title>关于 IGNAI</title>
        <meta name='description' content='IGNAI 是一个从长沙出发的青年 AI 社区。我们让活动之后的人继续相遇，让想法有下一次行动。' />
      </Head>

      <main className='ignai-about-page min-h-screen overflow-hidden'>

        {/* Hero */}
        <section ref={heroRef} className='relative pt-32 pb-20 sm:pt-40 sm:pb-28'>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-0 left-1/2 h-[360px] w-[720px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(255,122,24,0.08)_0%,transparent_68%)]' />
          </div>

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className='relative mx-auto max-w-3xl px-5 sm:px-8 text-center'
          >
            <motion.div
              initial='hidden'
              animate='visible'
              variants={stagger}
            >
              <motion.p
                variants={fadeUp}
                className='ignai-about-eyebrow text-xs font-medium tracking-wider uppercase mb-6'
              >
                About IGNAI
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className='text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight'
              >
                <span className='ignai-about-hero-line ignai-about-hero-line--primary'>
                  为什么会有
                </span>
                <br />
                <span className='ignai-about-hero-line ignai-about-hero-line--accent'>
                  IGNAI？
                </span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className='ignai-about-copy mt-6 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto'
              >
                很多人是在活动中认识的。可一场活动结束之后，热情往往很快散开。
                IGNAI 从这个瞬间开始：让愿意再聚的人，有一个继续出现的理由。
              </motion.p>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className='ignai-about-stats relative py-16 border-y border-white/[0.06]'>
          <div className='mx-auto max-w-4xl px-5 sm:px-8'>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
              className='grid grid-cols-2 sm:grid-cols-4 gap-8'
            >
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className='text-center'
                >
                  <p className='ignai-about-stat-num text-3xl sm:text-4xl font-bold'>
                    {s.num}
                  </p>
                  <p className='ignai-about-stat-label mt-2 text-sm'>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className='relative py-20 sm:py-28'>
          <div className='mx-auto max-w-4xl px-5 sm:px-8'>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
              className='grid gap-16 lg:grid-cols-2 lg:gap-20 items-start'
            >
              <div>
                <motion.p variants={fadeUp} className='ignai-about-eyebrow text-xs font-medium tracking-wider uppercase mb-4'>
                  Mission
                </motion.p>
                <motion.h2 variants={fadeUp} className='ignai-about-title text-3xl sm:text-4xl font-bold leading-tight'>
                  我们在做什么
                </motion.h2>
                <motion.p variants={fadeUp} className='ignai-about-copy mt-6 leading-relaxed'>
                  IGNAI 聚集学生、开发者、产品人与创作者。我们在活动里认识彼此，也把一次见面之后还值得继续聊的工具、项目和想法留下来。
                </motion.p>
                <motion.p variants={fadeUp} className='ignai-about-copy mt-4 leading-relaxed'>
                  我们不把每次活动做成一次性相遇，也不要求每个人都带着成熟项目来。对 AI 有好奇、愿意参与真实现场，就已经足够成为开始。
                </motion.p>
              </div>

              <div className='relative'>
                <motion.div
                  variants={fadeUp}
                  className='ignai-about-panel rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7'
                >
                  <div className='space-y-6'>
                    {[
                      { q: '谁会在这里？', a: '学生、开发者、产品人与创作者。有人刚接触 AI，有人已经在做产品，也有人只是想认识同频的人。' },
                      { q: '这里会发生什么？', a: '一起去活动、做小项目、参加分享和跨城见面。活动结束后，关系和讨论还能继续。' },
                      { q: '怎么进入？', a: '从一次活动或一段具体交流开始。带着你正在做的事、一个问题，或者单纯的好奇来都可以。' }
                    ].map((item) => (
                      <div key={item.q} className='ignai-about-panel-row border-b border-white/[0.06] pb-4 last:border-0 last:pb-0'>
                        <p className='ignai-about-panel-question text-sm font-medium mb-1.5'>{item.q}</p>
                        <p className='ignai-about-panel-answer text-sm leading-relaxed'>{item.a}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className='relative py-20 sm:py-28 border-t border-white/[0.06]'>
          <div className='relative mx-auto max-w-4xl px-5 sm:px-8'>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className='ignai-about-eyebrow text-xs font-medium tracking-wider uppercase mb-4 text-center'>
                Values
              </motion.p>
              <motion.h2 variants={fadeUp} className='ignai-about-title text-3xl sm:text-4xl font-bold text-center mb-12'>
                我们相信什么
              </motion.h2>

              <div className='grid gap-4 sm:grid-cols-2'>
                {values.map((v) => (
                  <motion.div
                    key={v.title}
                    variants={fadeUp}
                    className='ignai-about-value-card group rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 transition-colors duration-200 hover:border-white/[0.15] hover:bg-white/[0.04]'
                  >
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='ignai-about-value-icon flex h-9 w-9 items-center justify-center rounded-lg border border-[#FF7A18]/20 bg-[#FF7A18]/10 text-[#FF7A18]'>
                        {v.icon}
                      </div>
                      <h3 className='ignai-about-value-title text-base font-semibold'>{v.title}</h3>
                    </div>
                    <p className='ignai-about-value-desc text-sm leading-relaxed'>{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className='relative py-20 sm:py-28 border-t border-white/[0.06]'>
          <div className='mx-auto max-w-2xl px-5 sm:px-8 text-center'>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className='ignai-about-title text-3xl sm:text-4xl font-bold'>
                Ignite before AGI.
              </motion.h2>
              <motion.p variants={fadeUp} className='ignai-about-copy mt-4'>
                如果你也不想让一次活动变成一次性见面，来认识我们。带着好奇、项目或一个还没想清楚的问题都可以。
              </motion.p>
              <motion.div variants={fadeUp} className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
                <SmartLink href='/join' className='ignai-cta-primary'>
                  加入社区
                </SmartLink>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
