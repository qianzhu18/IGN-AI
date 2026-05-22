import Head from "next/head";

import { JoinApplicationForm } from "@/src/components/forms/JoinApplicationForm";
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
            width: 100%;
            border-radius: 1rem;
            border: 1px solid rgba(255,255,255,0.1);
            background-color: rgba(8,12,18,0.74);
            backdrop-filter: blur(20px);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 22px 58px rgba(0,0,0,0.28);
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
              提交加入意向和成员资料草稿，和 IGNAI 社区建立第一层连接。
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[680px] sm:mt-12">
            <JoinApplicationForm
              experienceMode={experienceMode}
              contactEmailHref={siteLinks.contactEmailHref}
              externalFormUrl={externalFormUrl}
            />
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
    },
  };
}
