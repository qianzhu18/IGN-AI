import { Reveal } from "@/src/components/motion/Reveal";
import { RecordCard } from "@/src/components/cards/RecordCard";
import { CTAButton } from "@/src/components/ui/CTAButton";
import { getFeaturedRecords } from "@/lib/records";

export async function FieldNotesSection() {
  const records = await getFeaturedRecords();

  return (
    <section id="field-notes" className="relative z-10 border-t border-white/8">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 lg:py-[120px]">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-eyebrow">Field Notes</p>
              <h2 className="section-title mt-6 max-w-[13ch]">
                社区现场，
                <br />
                沉淀成记录。
              </h2>
              <p className="section-body mt-6">
                把活动、项目、思考和成员故事沉淀成可以被继续阅读和传播的内容资产。
              </p>
            </div>
            <CTAButton href="/records" variant="secondary">
              查看现场记录
            </CTAButton>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {records.map((record, index) => (
            <Reveal key={record.slug} delay={index * 0.06}>
              <RecordCard record={record} featured={index === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
