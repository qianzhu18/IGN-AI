import Head from "next/head";

import { JoinApplicationForm } from "@/src/components/forms/JoinApplicationForm";
import { JoinContactCard } from "@/src/components/forms/JoinContactCard";
import { getJoinExperienceMode } from "@/lib/join";

type JoinPageProps = {
  experienceMode: "database" | "local" | "external" | "email";
  externalFormUrl: string;
};

export default function JoinPage({
  experienceMode,
  externalFormUrl,
}: JoinPageProps) {
  return (
    <>
      <Head>
        <style>{`
          .join-surface-card-strong {
            width: 100%;
            border-radius: 0.875rem;
            border: 1px solid rgba(255,255,255,0.1);
            background-color: rgba(8,12,18,0.86);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.035);
          }
          .join-info-panel,
          .join-member-draft,
          .join-avatar-panel,
          .join-generated-link {
            border-color: rgba(255,255,255,0.1);
          }
          .join-page-shell {
            width: min(100%, 760px);
            margin-inline: auto;
          }
          .join-page-kicker {
            width: min(100%, 620px);
            margin-inline: auto;
            text-align: center;
          }
          .join-card-eyebrow {
            font-size: 0.7rem;
            font-weight: 500;
            text-transform: uppercase;
            color: rgba(240,203,138,0.78);
            letter-spacing: 0;
          }
          .join-field {
            margin-top: 0.75rem;
            width: 100%;
            border-radius: 0.875rem;
            border: 1px solid rgba(255,255,255,0.1);
            background-color: rgba(255,255,255,0.04);
            padding: 0.85rem 1rem;
            font-size: 0.875rem;
            color: #ffffff;
            outline: none;
            transition: border-color 0.2s, background-color 0.2s;
          }
          .join-field::placeholder {
            color: rgba(255,255,255,0.32);
          }
          .join-field:focus {
            border-color: rgba(255,184,121,0.36);
            background-color: rgba(255,255,255,0.06);
          }
          .join-textarea {
            margin-top: 0.75rem;
            width: 100%;
            resize: none;
            border-radius: 0.875rem;
            border: 1px solid rgba(255,255,255,0.1);
            background-color: rgba(255,255,255,0.04);
            padding: 0.85rem 1rem;
            font-size: 0.875rem;
            line-height: 1.75;
            color: #ffffff;
            outline: none;
            transition: border-color 0.2s, background-color 0.2s;
          }
          .join-textarea::placeholder {
            color: rgba(255,255,255,0.32);
          }
          .join-textarea:focus {
            border-color: rgba(255,184,121,0.36);
            background-color: rgba(255,255,255,0.06);
          }
          html.light .join-page-kicker {
            border-color: rgba(130, 84, 48, 0.14);
          }
          html.light .join-page-kicker h1 {
            color: #21130b;
          }
          html.light .join-page-kicker p:not(.join-card-eyebrow) {
            color: rgba(49, 35, 24, 0.68);
          }
          html.light .join-card-eyebrow {
            color: #c65d1f;
          }
          html.light .join-surface-card-strong {
            border-color: rgba(120, 76, 42, 0.18);
            background-color: rgba(255, 252, 247, 0.92);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.76);
            color: #21130b;
          }
          html.light .join-surface-card-strong h2,
          html.light .join-surface-card-strong h3,
          html.light .join-surface-card-strong p,
          html.light .join-surface-card-strong span,
          html.light .join-surface-card-strong summary,
          html.light .join-surface-card-strong legend {
            color: rgba(49, 35, 24, 0.72);
          }
          html.light .join-surface-card-strong h2,
          html.light .join-surface-card-strong h3,
          html.light .join-surface-card-strong .join-card-title {
            color: #21130b;
          }
          html.light .join-surface-card-strong .join-card-eyebrow {
            color: #b9652a;
          }
          html.light .join-info-panel,
          html.light .join-member-draft,
          html.light .join-avatar-panel,
          html.light .join-generated-link {
            border-color: rgba(120, 76, 42, 0.16);
            background: transparent;
            box-shadow: none;
          }
          html.light .join-note-panel,
          html.light .join-qr-frame {
            border-color: rgba(120, 76, 42, 0.16);
            background: rgba(255, 255, 255, 0.54);
          }
          html.light .join-step-list {
            border-color: rgba(120, 76, 42, 0.16);
          }
          html.light .join-step-list > div {
            border-color: rgba(120, 76, 42, 0.14);
          }
          html.light .join-interest-pill,
          html.light .join-secondary-button {
            border-color: rgba(120, 76, 42, 0.18);
            background-color: rgba(255, 255, 255, 0.7);
            color: rgba(49, 35, 24, 0.72);
          }
          html.light .join-interest-pill:hover,
          html.light .join-secondary-button:hover {
            border-color: rgba(198, 93, 31, 0.32);
            color: #21130b;
          }
          html.light .join-field,
          html.light .join-textarea {
            border-color: rgba(120, 76, 42, 0.18);
            background-color: rgba(255, 255, 255, 0.78);
            color: #21130b;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.72);
          }
          html.light .join-field::placeholder,
          html.light .join-textarea::placeholder {
            color: rgba(49, 35, 24, 0.42);
          }
          html.light .join-field:focus,
          html.light .join-textarea:focus {
            border-color: rgba(198, 93, 31, 0.44);
            background-color: #fffaf4;
          }
        `}</style>
      </Head>
      <section className="relative z-10 px-5 py-16 sm:px-6 lg:py-24">
        <div className="join-page-shell">
          <div className="join-page-kicker border-b border-white/10 pb-9">
            <p className="join-card-eyebrow">Join IGNAI</p>
            <h1 className="mt-5 text-[2.4rem] font-semibold leading-[1.1] text-white sm:text-[3.2rem]">
              先建立连接，
              <br />
              再慢慢成为成员。
            </h1>
            <p className="mt-5 text-base leading-8 text-white/60 sm:text-lg">
              提交加入意向和成员资料草稿，和 IGNAI 社区建立第一层连接。也可以先用微信扫码联系社区管理者。
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[680px] sm:mt-12">
            <JoinApplicationForm
              experienceMode={experienceMode}
              externalFormUrl={externalFormUrl}
            />
            <div className="mt-6">
              <JoinContactCard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function getServerSideProps() {
  return {
    props: {
      experienceMode: getJoinExperienceMode(),
      externalFormUrl: process.env.NEXT_PUBLIC_JOIN_FORM_URL?.trim() || "",
      pageTitle: "加入社区 | IGNAI",
      pageDescription: "提交加入意向和成员资料草稿，和 IGNAI 社区建立第一层连接。",
    },
  };
}
