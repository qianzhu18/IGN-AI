import { Reveal } from "@/components/motion/Reveal";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { introKeywords } from "@/content/community";

export function IntroSection() {
  return (
    <SectionContainer id="what-is-ignai">
      <AnimatedHeading
        eyebrow="01 / What is IGNAI"
        title="A living AI community rooted in Changsha and connected to the world."
        description="先讲清楚我们是谁，再让品牌气质和社区温度慢慢展开。"
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
        <Reveal>
          <div className="surface-card-strong h-full p-8 sm:p-10">
            <p className="font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
              IGNAI 是一个 base 长沙、面向国际、立足本地技术连接与行动实践的
              AI 社群。
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#A1AAB8] sm:text-lg">
              它不是单纯的围观群，也不是一次性活动页，而是一个能持续承载表达、
              行动、连接与正反馈的品牌基座。
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="surface-card h-full p-8 sm:p-10">
            <p className="text-base leading-8 text-[#DDE4F0]/88 sm:text-lg">
              我们关注 AI、Agent、AGI、产品、内容、创业与新技术协作方式，也关
              注人在这个时代如何通过表达、行动、连接与持续产出获得成长。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {introKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-2 text-sm text-[#F5F7FB]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
}

