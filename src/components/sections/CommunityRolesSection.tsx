import { Reveal } from "@/components/motion/Reveal";

const roles = [
  {
    title: "AI Builders",
    description: "做 Agent、产品原型和自动化流程的人。",
  },
  {
    title: "Product Explorers",
    description: "从用户、场景和痛点出发，探索 AI 产品机会的人。",
  },
  {
    title: "Storytellers",
    description: "用文章、视频和社区记录传播高质量信号的人。",
  },
  {
    title: "Local Connectors",
    description: "连接长沙高校、开发者、创业者和线下空间的人。",
  },
];

export function CommunityRolesSection() {
  return (
    <section id="community-roles" className="relative z-10 border-t border-white/8">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 lg:py-[96px]">
        <div className="section-grid-start">
          <div className="section-copy">
            <Reveal>
              <p className="section-eyebrow">Community Roles</p>
              <h2 className="section-title mt-6 max-w-[11ch]">
                这里有谁？
              </h2>
              <p className="section-body mt-6">
                IGNAI 聚集了一群关注 AI、产品、表达和行动的人。第一版先展示角色画像，等有真实授权后再升级成成员墙。
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role, index) => (
              <Reveal key={role.title} delay={index * 0.06}>
                <div className="info-card min-h-[160px]">
                  <p className="card-eyebrow">0{index + 1}</p>
                  <h3 className="card-title">{role.title}</h3>
                  <p className="card-body">{role.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
