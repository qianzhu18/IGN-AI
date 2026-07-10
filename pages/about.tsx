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
  { num: '300+', label: '核心社群成员' },
  { num: '2000+', label: '累计触达' },
  { num: '20+', label: '线下 AI 活动' },
  { num: '2025', label: '正式起跑' }
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
        <meta name='description' content='IGNAI 是一个 base 长沙、连接本地、面向全球的 AI 社区。了解我们的使命、价值观和社区文化。' />
      </Head>

      <main className='ignai-about-page min-h-screen overflow-hidden'>

        {/* Hero */}
        <section ref={heroRef} className='relative pt-32 pb-20 sm:pt-40 sm:pb-28'>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(255,122,24,0.12)_0%,transparent_70%)]' />
            <div className='absolute top-20 right-0 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(93,169,255,0.06)_0%,transparent_70%)]' />
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
                <span className='ignai-about-hero-line ignai-about-hero-line--primary bg-clip-text text-transparent'>
                  从长沙出发，
                </span>
                <br />
                <span className='ignai-about-hero-line ignai-about-hero-line--accent bg-clip-text text-transparent'>
                  连接真实行动者。
                </span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className='ignai-about-copy mt-6 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto'
              >
                IGNAI 是一个 base 长沙，连接学生、开发者、内容创作者与 AI 活动资源的青年社区。
                我们相信，在 AGI 到来之前，最值得做的事是点燃一群真实行动的人。
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
                  <p className='ignai-about-stat-num text-3xl sm:text-4xl font-bold bg-clip-text text-transparent'>
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
                <motion.p variants={fadeUp} className='ignai-about-eyebrow ignai-about-eyebrow--signal text-xs font-medium tracking-wider uppercase mb-4'>
                  Mission
                </motion.p>
                <motion.h2 variants={fadeUp} className='ignai-about-title text-3xl sm:text-4xl font-bold leading-tight'>
                  我们在做什么
                </motion.h2>
                <motion.p variants={fadeUp} className='ignai-about-copy mt-6 leading-relaxed'>
                  IGNAI 聚集了一批关注 AI、产品、内容和创业的人。我们通过线下活动、社群承接、项目展示和内容复盘，让一次性活动参与变成持续连接。
                </motion.p>
                <motion.p variants={fadeUp} className='ignai-about-copy mt-4 leading-relaxed'>
                  不是围观群，不是知识付费，而是一个用真实活动、真实项目和真实关系持续积累信任的本地 AI 社区。
                </motion.p>
              </div>

              <div className='relative'>
                <motion.div
                  variants={fadeUp}
                  className='ignai-about-panel rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm'
                >
                  <div className='space-y-6'>
                    {[
                      { q: '谁在参与？', a: '开发者、产品经理、设计师、学生、创业者——任何对 AI 和真实行动感兴趣的人。' },
                      { q: '做什么？', a: '线下交流、主题工作坊、项目协作、内容共创、成员互助。' },
                      { q: '怎么加入？', a: '提交加入意向，参加一次线下活动，就是社区的一员。' }
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
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(255,122,24,0.05)_0%,transparent_70%)]' />
          </div>

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
                社区价值观
              </motion.h2>

              <div className='grid gap-4 sm:grid-cols-2'>
                {values.map((v) => (
                  <motion.div
                    key={v.title}
                    variants={fadeUp}
                    className='ignai-about-value-card group rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04]'
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
              <motion.h2 variants={fadeUp} className='text-3xl sm:text-4xl font-bold'>
                <span className='bg-gradient-to-r from-[#FF7A18] to-[#ffd09a] bg-clip-text text-transparent'>
                  Ignite before AGI.
                </span>
              </motion.h2>
              <motion.p variants={fadeUp} className='ignai-about-copy mt-4'>
                如果你也想在 AI 时代做点什么，而不是只是看——欢迎加入。
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
