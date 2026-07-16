export type RecordType = 'recap' | 'story' | 'resource' | 'project'

export type RecordMedia = {
  src: string
  alt: string
  caption: string
  orientation?: 'portrait'
}

export type RecordItem = {
  slug: string
  title: string
  type: RecordType
  dateText: string
  location?: string
  cover: string
  excerpt: string
  outcomes?: string[]
  tags: string[]
  content: Array<{ heading: string; body: string; media?: RecordMedia[] }>
  links?: Array<{ label: string; href: string }>
}

export const recordTypeLabel: Record<RecordType, string> = {
  recap: '活动现场',
  story: '社区故事',
  resource: '社区观察',
  project: '项目与见面'
}

// Every public claim here is traceable to 活动记录/. Records with only a poster
// or an image stay in the source archive until their role and outcome are clear.
export const records: RecordItem[] = [
  {
    slug: '2050-cross-city-showcase',
    title: '2050 青年团聚：从 7 个人出发，到 70 多个人参与',
    type: 'project',
    dateText: '2050 科技展',
    location: '跨省青年团聚',
    cover: '/images/activity-records/2050-youth-gathering.webp',
    excerpt: '这是一场跨省社区团建。最初同行的只有 7 个人，后来有 70 多位伙伴参与；原本在线上或比赛中认识的人，在 2050 科技展真正聚到了一起。',
    outcomes: ['7 人出发', '70+ 人参与', '青年团聚'],
    tags: ['2050 科技展', '跨省见面', '社区团建'],
    content: [
      {
        heading: '从线上相识，到一起出发',
        body: '社区里不少伙伴原本是在网上或比赛中认识的。这次出发让大家有机会在同一个现场相见，也让原本分散的关系变得具体。'
      },
      {
        heading: '一次被激活的团聚',
        body: '大家一起争取到了去云深处科技探索的机会，也在 2050 科技展完成了许多次见面。参与者从最初的 7 人，慢慢来到 70 多人。'
      },
      {
        heading: '彼此点燃和激活',
        body: '对 IGNAI 来说，这不是一次打卡式出行。它兑现了“青年团聚”的想法：年轻人最重要的连接，是愿意把彼此点燃和激活。'
      }
    ],
    links: [{ label: '了解 IGNAI', href: '/about' }]
  },
  {
    slug: 'geekathon-community-launch-node',
    title: '极客松之后，我们开始成为一个社区',
    type: 'story',
    dateText: '社区正式运营的起点',
    cover: '/images/activity-records/geekathon-community-launch.webp',
    excerpt: '极客松是这群伙伴第一次对外建立影响力、也第一次触达许多新朋友的现场。活动之后，大家鼓励我们把这件事继续做下去。',
    outcomes: ['第一次对外影响', '认识新朋友', '社区正式成立'],
    tags: ['极客松', '社区起点', 'Just for fun'],
    content: [
      {
        heading: '最早的可记录现场',
        body: '在极客松发生时，IGNAI 还没有正式成立。但这是这群小伙伴第一次一起对外做事，也成为后来社区正式运营的起点。',
        media: [
          {
            src: '/images/activity-records/stories/geekathon-first-huddle.webp',
            alt: '极客松现场合影',
            caption: '极客松现场合影。'
          }
        ]
      },
      {
        heading: '从熟人，到更多新人',
        body: '在此之前，大家只是一批彼此认识的熟人。极客松让我们触达了许多新人，也让更多人看见：这里可以有一个愿意一起折腾 AI 的组织。',
        media: [
          {
            src: '/images/activity-records/stories/geekathon-audience.webp',
            alt: '极客松活动现场',
            caption: '极客松活动现场。'
          }
        ]
      },
      {
        heading: '不是重运营，而是继续相聚',
        body: '活动之后，社区正式成立。这群“just for fun”的同学有了组织，但依然主要靠线下活动汇聚，不把关系做成冷冰冰的运营指标。',
        media: [
          {
            src: '/images/activity-records/stories/geekathon-group.webp',
            alt: '极客松活动结束后的合影',
            caption: '活动结束后的合影。'
          }
        ]
      }
    ]
  },
  {
    slug: 'early-activity-relationship-carrier',
    title: '活动结束之后，关系才刚开始',
    type: 'story',
    dateText: '社区早期',
    cover: '/images/activity-records/early-activity-relationship-carrier.webp',
    excerpt: '很多同学是在活动中结识的。活动散场后，我们更愿意承接那份还没退去的热情，让愿意再聚的人有下一次出现的理由。',
    outcomes: ['活动中相识', '承接关系', '下一次再聚'],
    tags: ['社区起点', '线下见面', 'Just for fun'],
    content: [
      {
        heading: '热闹散场之后',
        body: '很多活动结束后，参与者很快就散了。我们想承接的，正是热情退去之后仍然愿意继续交流、继续相遇的人。',
        media: [
          {
            src: '/images/activity-records/stories/early-dinner.webp',
            alt: '早期活动结束后的聚餐交流',
            caption: '活动结束后，大家仍在继续交流。'
          }
        ]
      },
      {
        heading: '不只办一场活动',
        body: '不少场域完成活动就结束了。IGNAI 更在意活动的长尾：让在现场认识的人，之后还能聊工具、聊项目、聊生活，也能继续一起去下一场。',
        media: [
          {
            src: '/images/activity-records/stories/early-aigc-meetup.webp',
            alt: '早期活动参与者合影',
            caption: '早期活动现场的参与者合影。'
          }
        ]
      },
      {
        heading: '关系不是临时拼出来的',
        body: '社区里的核心伙伴是在一次次活动中慢慢熟悉的。我们不是为了某个活动临时拼凑，而是每次结束后，仍有人心照不宣地愿意下一次再聚。'
      }
    ],
    links: [{ label: '为什么会有 IGNAI', href: '/about' }]
  },
  {
    slug: 'sanrenxing-ai-community-bridge',
    title: '三人行必有 AI：把项目带到长沙，让它被真正看见',
    type: 'recap',
    dateText: '2026 年 5 月 30 日',
    location: '湖南省科学技术馆',
    cover: '/images/activity-records/sanrenxing-ai-changsha-2026.webp',
    excerpt: 'IGNAI 作为合作社区参与“三人行必有 AI”长沙赛区。活动把 AI Demo、智能体、行业解决方案与能给出反馈的人带到同一个现场。',
    outcomes: ['长沙赛区', '合作社区', '项目路演与交流'],
    tags: ['黑客松', 'Google Cloud', '长沙'],
    content: [
      {
        heading: '带着还不完美的项目来',
        body: '这场黑客松欢迎能运行、能演示、能说清楚问题的 AI Demo、智能体、工作流与行业解决方案。重点不是等到完美，而是让项目走出群聊，接受真实的提问和反馈。',
        media: [
          {
            src: '/images/activity-records/stories/sanrenxing-venue.webp',
            alt: '三人行必有 AI 长沙赛区活动现场',
            caption: '“三人行必有 AI”长沙赛区活动现场。'
          }
        ]
      },
      {
        heading: '长沙赛区的一个下午',
        body: '活动于 2026 年 5 月 30 日 13:30 至 18:00 在湖南省科学技术馆 B 馆实验教育中心一楼报告厅举行，由 Google Cloud 独家赞助。',
        media: [
          {
            src: '/images/activity-records/stories/sanrenxing-group.webp',
            alt: '三人行必有 AI 长沙赛区合影',
            caption: '长沙赛区现场合影。'
          },
          {
            src: '/images/activity-records/stories/sanrenxing-attendees.webp',
            alt: '三人行必有 AI 长沙赛区参与者',
            caption: '来到长沙赛区的参与者。'
          }
        ]
      },
      {
        heading: 'IGNAI 的角色',
        body: 'IGNAI 以合作社区身份参与长沙赛区。对我们而言，合作的意义是把对项目、产品和 AI 实践真正感兴趣的人，带到可以继续交流的现场。'
      }
    ]
  },
  {
    slug: 'guanchai-ai-product-manager-camp',
    title: '和观猹一起，办一次 AI 产品经理共学营',
    type: 'recap',
    dateText: '7 天线上共学',
    location: '线上',
    cover: '/images/activity-records/guanchai-ai-pm-camp.webp',
    excerpt: 'IGNAI 与观猹发起 AI 产品经理共学营。连续 7 天，每晚线上直播、作业打卡，一起拆解 AI 产品、岗位能力和实践项目。',
    outcomes: ['7 天共学', '晚间直播', '作业打卡'],
    tags: ['产品思维', 'AI 产品经理', '线上共学'],
    content: [
      {
        heading: '不只研究工具',
        body: '越常使用 AI，越会遇到产品问题：用户为什么愿意用，一个功能怎样解决真实问题，一个想法怎样成为产品。产品思维因此成了技术、运营、设计、内容和独立项目都绕不开的能力。',
        media: [
          {
            src: '/images/activity-records/stories/guanchai-camp-poster.webp',
            alt: '观猹与 IGNAI AI 产品经理共学营海报',
            caption: '观猹 x IGNAI AI 产品经理共学营。',
            orientation: 'portrait'
          }
        ]
      },
      {
        heading: '一起学，也一起做',
        body: '共学营以 7 天为期，每晚 20:00 线上直播并配合作业打卡。参与者和一线嘉宾一起拆解 AI 产品、理解岗位能力、完成实践项目。',
        media: [
          {
            src: '/images/activity-records/stories/guanchai-camp-program.webp',
            alt: 'AI 产品经理共学营课程安排',
            caption: '共学营课程与嘉宾信息。',
            orientation: 'portrait'
          }
        ]
      },
      {
        heading: '进群就是开始',
        body: '无法每天准时听直播也没关系。社群会整理直播重点、课程笔记和优秀作业，让大家继续讨论产品、工具、项目、实习和 AI 行业的新机会。'
      }
    ]
  },
  {
    slug: 'huamao-badge-generator-booth',
    title: '智能打印吧唧：我们第一次以参与者身份去摆摊',
    type: 'project',
    dateText: '社区成立后',
    cover: '/images/activity-records/huamao-badge-generator-booth.webp',
    excerpt: '社区做了一个“智能打印吧唧”项目，并带着它去摆摊、参展。这不是一场由我们组织的活动，而是社区有了名字之后，第一次作为参与者出现在现场。',
    outcomes: ['智能打印吧唧', '摆摊参展', '第一次参与活动'],
    tags: ['AI 互动', '项目展示', '社区现场'],
    content: [
      {
        heading: '先做一个能带去现场的东西',
        body: '“智能打印吧唧”是社区一起做的项目。我们把它带到现场，让路过的人能看见、体验，也能和我们聊聊它是怎么做出来的。',
        media: [
          {
            src: '/images/activity-records/stories/huamao-badge-booth.webp',
            alt: '智能打印吧唧项目在活动现场',
            caption: '“智能打印吧唧”项目在活动现场。'
          }
        ]
      },
      {
        heading: '不是主办，也值得记录',
        body: '这次没有组织一场活动，而是作为参与者去摆摊和参展。恰恰因为这样，它成了社区有了名字之后第一次真正走进别人的现场。',
        media: [
          {
            src: '/images/activity-records/stories/huamao-community-group.webp',
            alt: 'AI 花猫社区活动现场合影',
            caption: 'AI 花猫社区活动现场合影。'
          },
          {
            src: '/images/activity-records/stories/huamao-event-stage.webp',
            alt: 'AI 花猫社区活动现场',
            caption: '活动现场。'
          }
        ]
      }
    ]
  },
  {
    slug: 'guanchai-changli-ai-garden',
    title: '在长沙理工大学，先让愿意折腾 AI 的人彼此认识',
    type: 'story',
    dateText: '高校社区入口',
    location: '长沙理工大学',
    cover: '/images/activity-records/guanchai-changli-ai-garden.webp',
    excerpt: 'IGNAI 与观猹一起，为长沙理工大学的同学建立一个围绕 AI 工具、项目、比赛与真实体验的交流入口。这里不设标准答案，先让不同阶段的人找到彼此。',
    outcomes: ['高校社区入口', '工具与项目交流', '长期社群连接'],
    tags: ['长沙理工大学', '高校社群', '观猹'],
    content: [
      {
        heading: '不是再建一个信息群',
        body: '很多人都在使用 AI：有人研究 Agent、工作流和编程工具，有人因为一个新产品兴奋，也有人刚刚开始好奇。这个入口不是为了制造更多通知，而是让愿意交流和实践的人有一个可以出现的地方。'
      },
      {
        heading: '不同阶段的人，都可以进来',
        body: '有人刚接触 AI，有人已经做出自己的产品；有人在研究技术，有人在琢磨商业模式，也有人只是想更认真地理解正在发生的变化。大家可以分享工具、讨论产品、聊项目、比赛、实习和机会。'
      },
      {
        heading: '把好奇心留在长期关系里',
        body: '比起追一阵热点，我们更希望认识那些愿意长期思考和实践的人。先从一次交流开始，再把好奇心变成下一次共学、项目和见面。'
      }
    ]
  },
  {
    slug: 'openclaw-sharing-record',
    title: '受邀分享：把一个 OpenClaw 项目带到台上',
    type: 'recap',
    dateText: '受邀分享',
    cover: '/images/activity-records/openclaw-sharing.webp',
    excerpt: '一次受邀分享中，社区成员上台介绍了一个基于 OpenClaw 的项目。项目不只留在本地，也有机会在现场被讲清楚、被讨论。',
    outcomes: ['受邀分享', 'OpenClaw 项目', '现场交流'],
    tags: ['OpenClaw', '项目分享', '社区成员'],
    content: [
      {
        heading: '把正在做的事讲出来',
        body: '我们接受邀请，在现场分享了一个基于 OpenClaw 的项目。这是一次把项目从日常开发和讨论里带到台上的尝试。',
        media: [
          {
            src: '/images/activity-records/stories/openclaw-stage.webp',
            alt: 'OpenClaw 项目现场分享',
            caption: '现场分享环节，屏幕展示 ClawNet 项目。'
          }
        ]
      },
      {
        heading: '留一份真实的记录',
        body: '现有材料确认了受邀分享与项目主题；活动名称、时间、地点和项目细节仍在补充。我们先把已经发生的这一次交流如实留下。',
        media: [
          {
            src: '/images/activity-records/stories/openclaw-forum-invite.webp',
            alt: '长沙马栏山 AI 智能体企业级应用论坛邀请海报',
            caption: '长沙马栏山 AI 智能体企业级应用论坛邀请海报。'
          }
        ]
      }
    ]
  },
  {
    slug: 'lev0-minicamp-award-record',
    title: 'LEV0 miniCamp 黑客松：一次社区合作与获奖记录',
    type: 'recap',
    dateText: '2026 年 6 月',
    cover: '/images/activity-records/lev0-minicamp-hackathon-award.webp',
    excerpt: '社区参与 LEV0 miniCamp 黑客松合作，并留下了获奖记录。项目名称、成员分工与技术方案仍在补充中。',
    outcomes: ['社区合作', '参与获奖', '待补项目详情'],
    tags: ['LEV0', 'miniCamp', '黑客松'],
    content: [
      {
        heading: '一份已确认的结果',
        body: '现有活动材料记录了社区参与 LEV0 miniCamp 黑客松，并有获奖结果。这是我们可以确认、也值得先留下的一件事。',
        media: [
          {
            src: '/images/activity-records/stories/lev0-award.webp',
            alt: 'LEV0 miniCamp 黑客松三等奖记录',
            caption: 'LEV0 miniCamp 1Day Hackathon 三等奖记录。'
          }
        ]
      },
      {
        heading: '把细节留给事实',
        body: '参赛项目名、成员分工和技术方案尚未整理完整，因此不会在这里补写。等信息齐备后，这条记录会再更新成一份完整的项目故事。'
      }
    ]
  }
]
