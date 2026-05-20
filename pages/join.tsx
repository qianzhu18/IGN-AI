import Head from "next/head";

import { PageShell } from "@/src/components/layout/PageShell";
import { JoinApplicationForm } from "@/src/components/forms/JoinApplicationForm";
import { JoinContactCard } from "@/src/components/forms/JoinContactCard";
import { getJoinExperienceMode } from "@/lib/join";
import { siteLinks } from "@/src/content/links";

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
        <title>Join IGNAI</title>
        <meta
          name="description"
          content="提交加入意向和成员资料草稿，和 IGNAI 社区建立第一层连接。"
        />
        <style>{`
          .join-surface-card-strong {
            border-radius: 1rem;
            border: 1px solid rgba(255,255,255,0.1);
            background-color: rgba(8,12,18,0.74);
            backdrop-filter: blur(20px);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 22px 58px rgba(0,0,0,0.28);
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
            border-radius: 1rem;
            border: 1px solid rgba(255,255,255,0.1);
            background-color: rgba(255,255,255,0.04);
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: #ffffff;
            outline: none;
            transition: border-color 0.2s;
          }
          .join-field::placeholder {
            color: rgba(255,255,255,0.32);
          }
          .join-field:focus {
            border-color: rgba(255,184,121,0.36);
          }
          .join-textarea {
            margin-top: 0.75rem;
            width: 100%;
            resize: none;
            border-radius: 1rem;
            border: 1px solid rgba(255,255,255,0.1);
            background-color: rgba(255,255,255,0.04);
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            line-height: 1.75;
            color: #ffffff;
            outline: none;
            transition: border-color 0.2s;
          }
          .join-textarea::placeholder {
            color: rgba(255,255,255,0.32);
          }
          .join-textarea:focus {
            border-color: rgba(255,184,121,0.36);
          }
        `}</style>
      </Head>
      <PageShell>
        <section className="relative z-10 flex min-h-screen items-start justify-center px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="w-full max-w-[60vw] 2xl:max-w-[900px]">
            <div className="border-b border-white/10 pb-10">
              <p className="join-card-eyebrow">Join IGNAI</p>
              <h1 className="mt-5 text-[2.4rem] font-semibold leading-[1.1] text-white sm:text-[3.2rem]">
                先建立连接，
                <br />
                再慢慢成为成员。
              </h1>
              <p className="mt-5 text-base leading-8 text-white/60 sm:text-lg">
                提交加入意向和成员资料草稿，和 IGNAI 社区建立第一层连接。
              </p>
            </div>

            <div className="mt-12 space-y-6">
              <JoinApplicationForm
                experienceMode={experienceMode}
                contactEmailHref={siteLinks.contactEmailHref}
                externalFormUrl={externalFormUrl}
              />
              <JoinContactCard />
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}

export function getServerSideProps() {
  return {
    props: {
      experienceMode: getJoinExperienceMode(),
      externalFormUrl: process.env.NEXT_PUBLIC_JOIN_FORM_URL?.trim() || "",
    },
  };
}
