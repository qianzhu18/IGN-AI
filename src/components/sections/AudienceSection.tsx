import { Reveal } from "@/components/motion/Reveal";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { audienceCards } from "@/content/community";

export function AudienceSection() {
  return (
    <SectionContainer id="who-is-here">
      <AnimatedHeading
        eyebrow="04 / Who is IGNAI for?"
        title="欢迎真正愿意上场的人。"
        description="开发者、产品人、创业者、创作者、学生与组织者，都可以在这里找到自己的接口。"
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {audienceCards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.06}>
            <div className="surface-card group h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
              <div className="h-1 w-16 rounded-full bg-[linear-gradient(90deg,rgba(255,122,24,0.95),rgba(109,124,255,0.75))]" />
              <h3 className="mt-6 font-display text-2xl text-white">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#A1AAB8]">{card.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}

