export type RecordType = 'recap' | 'story' | 'resource' | 'project'

export type RecordDateStatus = 'confirmed' | 'approximate' | 'unknown'

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
  timelineDate?: string
  timelineEndDate?: string
  dateStatus: RecordDateStatus
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

// Public claims are taken from 活动记录/. Unknown dates stay unknown instead of
// being placed into the timeline with an inferred date.
export const records: RecordItem[] = [
  {
    slug: 'sanrenxing-ai-community-bridge',
    title: '三人行必有 AI 长沙站：让正在做的项目被真正看见',
    type: 'recap',
    dateText: '2026 年 5 月 30 日',
    timelineDate: '2026-05-30',
    dateStatus: 'confirmed',
    location: '湖南省科学技术馆 B 馆',
    cover: '/images/activity-records/sanrenxing-ai-changsha-2026.webp',
    excerpt: 'IGNAI 作为合作社区参与长沙赛区，把 AI Demo、智能体、工作流和行业解决方案带到能获得真实提问与反馈的现场。',
    outcomes: ['合作社区', '项目路演', '长沙赛区'],
    tags: ['三人行必有 AI', 'Google Cloud', '长沙'],
    content: [
      {
        heading: '带着还不完美的项目来',
        body: '长沙赛区面向可以运行、可以演示，也能说清楚所解决问题的 AI 项目。AI Demo、已上线产品、智能体、工作流、行业解决方案，以及教育、企业服务、内容与开发者工具方向的实践，都可以来到现场。',
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
        body: '活动于 2026 年 5 月 30 日 13:30 至 18:00，在湖南省科学技术馆 B 馆实验教育中心一楼报告厅举行，由 Google Cloud 独家赞助。现场围绕“我 + AI + X”展开项目展示与交流。',
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
        body: 'IGNAI 以合作社区身份参与长沙赛区。我们的工作不是替项目包装一个完美故事，而是让认真做项目的人走出群聊，在真实现场遇见反馈、同行者和下一步机会。'
      }
    ]
  },
  {
    slug: '2050-cross-city-showcase',
    title: '2050 青年团聚：从 7 个人出发，到 70 多个人参与',
    type: 'project',
    dateText: '2026 年 4 月 24 日至 26 日',
    timelineDate: '2026-04-24',
    timelineEndDate: '2026-04-26',
    dateStatus: 'confirmed',
    location: '杭州 · 2050 大会',
    cover: '/images/activity-records/2050-youth-gathering.webp',
    excerpt: '最初同行的只有 7 个人，后来有 70 多位伙伴参与。原本在线上或比赛里认识的人，在杭州 2050 大会真正聚到了一起。',
    outcomes: ['7 人出发', '70+ 人参与', '跨城团聚'],
    tags: ['2050 大会', '青年团聚', '社区见面'],
    content: [
      {
        heading: '先从 7 个人出发',
        body: '这是一次跨省的社区团聚。最初确定同行的只有 7 个人，很多伙伴此前只在线上或比赛里见过名字。这次大家终于在同一个城市、同一个现场见面。'
      },
      {
        heading: '把一次出发变成更多人的相见',
        body: '活动从 2026 年 4 月 24 日持续到 26 日。大家共同争取到了前往云深处科技探索的机会，后来参与这次团聚的人数来到 70 多人。这里记录的是实际参与，不使用报名数代替到场结果。'
      },
      {
        heading: '青年团聚，不是一次打卡',
        body: '2050 让许多原本分散的关系变得具体。对 IGNAI 来说，青年团聚的意义不是把人聚到一张合影里，而是让原本可能只见一次的人，在共同经历后还愿意继续彼此点燃。'
      }
    ],
    links: [{ label: '2050 青年团聚页面', href: 'https://2050.org.cn/#/nest/579' }]
  },
  {
    slug: 'openclaw-sharing-record',
    title: '马栏山 AI 智能体论坛：把 OpenClaw 项目带到台上',
    type: 'recap',
    dateText: '2026 年 3 月 22 日',
    timelineDate: '2026-03-22',
    dateStatus: 'confirmed',
    location: '马栏山视频文创园创意中心 B 座',
    cover: '/images/activity-records/openclaw-sharing.webp',
    excerpt: '在云上栏山与 W3 Labs 举办的 AI 智能体企业级应用论坛上，IGNAI 受邀分享一个基于 OpenClaw 的项目。',
    outcomes: ['受邀分享', 'OpenClaw 项目', '企业级场景'],
    tags: ['OpenClaw', '马栏山', '项目分享'],
    content: [
      {
        heading: '一场有明确主题的项目分享',
        body: '2026 年 3 月 22 日 15:00，云上栏山与 W3 Labs 在长沙马栏山视频文创园创意中心 B 座 3 层举办 AI 智能体企业级应用论坛，讨论“龙虾”在企业级场景中的落地。IGNAI 受邀参加并分享项目。',
        media: [
          {
            src: '/images/activity-records/stories/openclaw-forum-invite.webp',
            alt: '马栏山 AI 智能体企业级应用论坛邀请海报',
            caption: '论坛邀请海报明确记录了时间、地点与议题。'
          }
        ]
      },
      {
        heading: '把正在做的东西讲清楚',
        body: '社区成员在台上介绍了一个基于 OpenClaw 的项目。它不再只停留在日常开发与群聊讨论里，而是在公开现场接受提问、交流具体做法。',
        media: [
          {
            src: '/images/activity-records/stories/openclaw-stage.webp',
            alt: 'OpenClaw 项目现场分享',
            caption: '现场分享环节，屏幕展示 ClawNet 项目。'
          }
        ]
      }
    ]
  },
  {
    slug: 'early-activity-relationship-carrier',
    title: '2026 年 1 月的两次见面：从青藤元交流到 TRAE Solo 黑客松',
    type: 'story',
    dateText: '2026 年 1 月',
    timelineDate: '2026-01-01',
    dateStatus: 'approximate',
    location: '长沙',
    cover: '/images/activity-records/early-activity-relationship-carrier.webp',
    excerpt: '一次交流谈 AI 工程化、商业落地与教育，一次 Solo 黑客松让伙伴继续共同做事。活动结束后，关系没有随着现场一起散去。',
    outcomes: ['AI 工程化交流', 'TRAE Solo 黑客松', '活动后继续相聚'],
    tags: ['2026 年 1 月', '长沙见面', '社区关系'],
    content: [
      {
        heading: '一月上旬，先在青藤元见面',
        body: '留下的公开记录提到，大家围绕 AI 工程化与商业落地交流，也体验了 AI 眼镜和 3D 打印联动；晚上的茶馆局又把话题延伸到教育与 AI。现有截图能确认月份与讨论内容，但不能把发帖时间直接当成准确的活动日期。',
        media: [
          {
            src: '/images/activity-records/stories/early-dinner.webp',
            alt: '一月活动结束后的聚餐交流',
            caption: '活动结束后，讨论仍在继续。'
          }
        ]
      },
      {
        heading: '随后参加 TRAE Solo 黑客松',
        body: '另一条同期记录写下，伙伴参加了字节跳动 TRAE 相关的 Solo 黑客松。社区成员拿到了约一半奖项，群成员也在这一阶段突破三位数。比数字更重要的是，原本在不同活动中认识的人开始一次次共同出现。',
        media: [
          {
            src: '/images/activity-records/stories/early-aigc-meetup.webp',
            alt: '一月活动现场参与者合影',
            caption: '同期活动现场的参与者合影。'
          }
        ]
      },
      {
        heading: '活动是入口，关系才是长期内容',
        body: '许多活动散场后，参与者很快就失去联系。IGNAI 想承接的是热情退去之后仍愿意继续交流、继续见面的人。社区不是为某一场活动临时拼出来的名单，而是一群人心照不宣地愿意再聚一次。'
      }
    ],
    links: [{ label: '为什么会有 IGNAI', href: '/about' }]
  },
  {
    slug: 'geekathon-community-launch-node',
    title: '2025 长沙 AI 极客松：社区成立前的第一次共同对外行动',
    type: 'story',
    dateText: '2025 年 11 月 15 日至 16 日',
    timelineDate: '2025-11-15',
    timelineEndDate: '2025-11-16',
    dateStatus: 'confirmed',
    location: '潇影大厦 16 楼潇湘电影青创基地',
    cover: '/images/activity-records/geekathon-community-launch.webp',
    excerpt: 'IGNAI 尚未正式成立时，一群伙伴以志愿者身份参与两天一夜的 AI 极客松。活动结束后，更多人鼓励大家把这件事继续做下去。',
    outcomes: ['两天一夜共创', '全流程志愿参与', '社区成立节点'],
    tags: ['AI 极客松', '长沙', '社区起点'],
    content: [
      {
        heading: '2025 年 11 月 15 日，故事从现场开始',
        body: '“AI 极客松项目共创实战大会”于 2025 年 11 月 15 日至 16 日，在长沙市雨花区潇影大厦 16 楼潇湘电影青创基地举行，主题是“一年想法，两天交付，一路孵化”。',
        media: [
          {
            src: '/images/activity-records/stories/geekathon-first-huddle.webp',
            alt: 'AI 极客松现场合影',
            caption: '两天一夜共创现场。'
          }
        ]
      },
      {
        heading: '不是旁观，而是全流程参与',
        body: '当时 IGNAI 还没有正式成立。伙伴以志愿者身份参与活动全流程，在现场解决问题，也认识了导师、学生和更多认真做 AI 项目的人。现有材料没有可靠记录实际到场人数与 Demo 数，因此不在这里补写。',
        media: [
          {
            src: '/images/activity-records/stories/geekathon-audience.webp',
            alt: 'AI 极客松活动现场',
            caption: 'AI 极客松活动现场。'
          }
        ]
      },
      {
        heading: '活动结束后，社区才真正开始',
        body: '这是这群伙伴第一次共同对外建立影响，也第一次集中认识许多新朋友。活动之后，大家不断鼓励我们把连接继续做下去，IGNAI 因而从一群熟人变成一个有名字的社区。',
        media: [
          {
            src: '/images/activity-records/stories/geekathon-group.webp',
            alt: 'AI 极客松活动结束后的合影',
            caption: '活动结束后的合影。'
          }
        ]
      }
    ]
  },
  {
    slug: 'lev0-minicamp-award-record',
    title: 'LEV0 miniCamp 黑客松：一份参赛与三等奖记录',
    type: 'recap',
    dateText: '资料发布于 2026 年 6 月 6 日 · 活动日期待补',
    dateStatus: 'unknown',
    cover: '/images/activity-records/lev0-minicamp-hackathon-award.webp',
    excerpt: '现有招募材料与奖项图片可以确认社区参与了 LEV0 miniCamp 黑客松，并留下三等奖记录；准确活动日期与项目细节仍待补齐。',
    outcomes: ['参与黑客松', '三等奖记录', '细节待补'],
    tags: ['LEV0', 'miniCamp', '黑客松'],
    content: [
      {
        heading: '先写下已经可以确认的部分',
        body: 'LEV0 于 2026 年 6 月 6 日发布 miniCamp 黑客松招募材料。社区参加了相关活动，现有奖项图片记录了 LEV0 miniCamp 1Day Hackathon 三等奖。资料发布时间不等于活动发生时间，所以这条记录暂不进入按日期排列的时间线。',
        media: [
          {
            src: '/images/activity-records/stories/lev0-award.webp',
            alt: 'LEV0 miniCamp 1Day Hackathon 三等奖记录',
            caption: '现有材料中的三等奖记录。'
          }
        ]
      },
      {
        heading: '缺失的细节不会用想象补上',
        body: '参赛项目名、成员分工、技术方案与准确活动日期仍需从当事人或完整记录中补充。信息齐备后，这里会更新为完整复盘。'
      }
    ]
  },
  {
    slug: 'guanchai-ai-product-manager-camp',
    title: '观猹 x IGNAI：一场持续 7 天的 AI 产品经理共学营',
    type: 'recap',
    dateText: '开营日期待补 · 7 天线上共学',
    dateStatus: 'unknown',
    location: '线上',
    cover: '/images/activity-records/guanchai-ai-pm-camp.webp',
    excerpt: 'IGNAI 与观猹共同发起 7 天线上共学，每晚 20:00 直播并完成作业打卡，围绕产品能力、岗位理解和实践项目持续交流。',
    outcomes: ['7 天共学', '每晚 20:00 直播', '作业打卡'],
    tags: ['观猹', 'AI 产品经理', '线上共学'],
    content: [
      {
        heading: '从会用 AI，到理解产品',
        body: '共学营关心的不只是又多会了一个工具，而是用户为什么愿意使用、功能怎样解决真实问题、一个想法怎样走向可以被验证的产品。',
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
        heading: '连续 7 天，一起学也一起做',
        body: '共学营连续 7 天进行，每晚 20:00 线上直播并配合作业打卡。参与者跟随一线嘉宾拆解 AI 产品、理解岗位能力，并通过实践项目把讨论落到具体工作中。',
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
        heading: '直播结束后，资料和讨论继续留下',
        body: '社群继续整理课程笔记、直播重点与优秀作业，也让参与者讨论产品、工具、项目、比赛、实习和行业机会。现有材料没有明确开营日期，因此日期暂不补写。'
      }
    ]
  },
  {
    slug: 'huamao-badge-generator-booth',
    title: '智能打印吧唧：社区成立后的第一次对外参展',
    type: 'project',
    dateText: '活动日期待补',
    dateStatus: 'unknown',
    cover: '/images/activity-records/huamao-badge-generator-booth.webp',
    excerpt: '社区做了一个“智能打印吧唧”项目，并把它带到花猫社区的现场摆摊、参展。这不是 IGNAI 主办的活动，而是一次真实的参与。',
    outcomes: ['智能打印吧唧', '现场摆摊', '社区首次参展'],
    tags: ['花猫社区', 'AI 互动', '项目展示'],
    content: [
      {
        heading: '先做一个可以被体验的项目',
        body: '社区伙伴一起做了“智能打印吧唧”，并把它带到现场。路过的人可以看到、体验，也可以直接和开发者聊它是怎样做出来的。',
        media: [
          {
            src: '/images/activity-records/stories/huamao-badge-booth.webp',
            alt: '智能打印吧唧项目在活动现场',
            caption: '“智能打印吧唧”项目在活动现场。'
          }
        ]
      },
      {
        heading: '角色边界也要写清楚',
        body: '这次活动不是由 IGNAI 组织，我们以参与者身份摆摊和参展。它仍然值得记录，因为这是社区有了正式身份之后，第一次带着共同完成的项目出现在别人的现场。',
        media: [
          {
            src: '/images/activity-records/stories/huamao-community-group.webp',
            alt: '花猫社区活动现场合影',
            caption: '花猫社区活动现场合影。'
          },
          {
            src: '/images/activity-records/stories/huamao-event-stage.webp',
            alt: '花猫社区活动现场',
            caption: '活动现场。'
          }
        ]
      }
    ]
  },
  {
    slug: 'guanchai-changli-ai-garden',
    title: '观猹长理分园：为长沙理工同学建一个 AI 交流入口',
    type: 'story',
    dateText: '成立日期待补',
    dateStatus: 'unknown',
    location: '长沙理工大学',
    cover: '/images/activity-records/guanchai-changli-ai-garden.webp',
    excerpt: 'IGNAI 与观猹一起，为长沙理工大学的同学建立围绕 AI 工具、项目、比赛与真实体验的长期交流入口。',
    outcomes: ['高校社区入口', '工具与项目交流', '长期连接'],
    tags: ['观猹', '长沙理工大学', '高校社群'],
    content: [
      {
        heading: '不是再建一个通知群',
        body: '有人正在研究 Agent、工作流和编程工具，有人刚刚开始对 AI 好奇。这个入口不提供标准答案，也不以老师讲课为中心，而是先让愿意实践和交流的人彼此认识。'
      },
      {
        heading: '不同阶段的人都可以出现',
        body: '群里的讨论可以从工具使用开始，也可以继续聊产品、项目、比赛、实习和新的行业机会。目标不是追完一阵热点，而是让好奇心有机会进入长期关系。'
      },
      {
        heading: '先确认事实，再补成立时间',
        body: '现有材料可以确认双方共同发起了这个高校交流入口，但没有给出准确成立日期，因此不把它伪装成一次有明确日期的活动。'
      }
    ]
  }
]
