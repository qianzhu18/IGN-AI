import Link from "next/link";
import { ExternalLink, FilePenLine, QrCode, Sparkles } from "lucide-react";

type ContentAdminPanelProps = {
  type: "events" | "records";
};

export function ContentAdminPanel({ type }: ContentAdminPanelProps) {
  const copy =
    type === "events"
      ? {
          eyebrow: "Manage events",
          title: "活动发布和报名，都从这里改。",
          body:
            "活动内容的发布入口在 Studio。每条活动都可以单独设置标题、时间、地点、封面、详情正文、报名链接，以及报名二维码。",
          bullets: [
            "发布新活动：进入 Studio -> 近期活动",
            "活动报名：给该活动填写飞书多维表格链接",
            "如果你要放二维码：上传到该活动的报名二维码字段",
          ],
        }
      : {
          eyebrow: "Manage records",
          title: "活动记录和现场复盘，也从这里编辑。",
          body:
            "现场记录的编辑入口同样在 Studio。你可以继续新增活动复盘、成员故事、工具清单和项目记录。",
          bullets: [
            "发布新记录：进入 Studio -> 现场记录",
            "可编辑标题、摘要、封面、正文和相关链接",
            "首页与列表页会按排序字段自动展示",
          ],
        };

  return (
    <section className="surface-card p-5 sm:p-6">
      <p className="card-eyebrow">{copy.eyebrow}</p>
      <h2 className="mt-4 text-[1.35rem] font-semibold text-white">{copy.title}</h2>
      <p className="mt-3 text-sm leading-7 text-white/60">{copy.body}</p>

      <div className="mt-5 grid gap-3">
        {copy.bullets.map((item, index) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            {index === 0 ? (
              <FilePenLine className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#ffd09a]" />
            ) : index === 1 ? (
              <ExternalLink className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#9aceff]" />
            ) : (
              <QrCode className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#ffd09a]" />
            )}
            <p className="text-sm leading-7 text-white/68">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/studio"
          className="button-shine inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-6 py-3 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] transition duration-300 hover:-translate-y-0.5"
        >
          <span>打开内容后台</span>
          <Sparkles className="h-4 w-4" />
        </Link>
        <Link
          href="/manage/join"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-white/70 transition hover:border-white/18 hover:text-white"
        >
          <span>查看申请池</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
