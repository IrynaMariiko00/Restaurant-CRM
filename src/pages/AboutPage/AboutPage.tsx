import { useTranslation } from "react-i18next";
import adamPhoto from "@/assets/about/adam.jpg";
import iraPhoto from "@/assets/about/ira-portrait.jpg";
import { GuestEntryNav } from "./GuestEntryNav";

const makers = [
  {
    nameKey: "about.adam_name" as const,
    roleKey: "about.adam_role" as const,
    bioKey: "about.adam_bio" as const,
    href: "https://github.com/AdamMudrak",
    photo: adamPhoto,
  },
  {
    nameKey: "about.ira_name" as const,
    roleKey: "about.ira_role" as const,
    bioKey: "about.ira_bio" as const,
    href: "https://github.com/IrynaMariiko00",
    photo: iraPhoto,
  },
];

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <main className="about-page">
      <div className="about-page__inner mx-auto w-full max-w-4xl">
        <header className="text-center">
          <p className="about-page__brand title title--accent mb-4 uppercase">
            Restaurant CRM
          </p>
          <h1 className="about-page__title title title--primary">
            {t("about.headline")}
          </h1>
          <p className="about-page__lead mx-auto mt-4 text-[var(--secondary-text)]">
            {t("about.lead")}
          </p>
        </header>

        <section className="about-page__makers mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-2 md:gap-8">
          {makers.map((maker) => (
            <article
              key={maker.nameKey}
              className="mx-auto flex w-full max-w-[20rem] flex-col items-center text-center"
            >
              <div className="about-page__portrait">
                <img src={maker.photo} alt={t(maker.nameKey)} />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent-text)]">
                {t(maker.roleKey)}
              </p>
              <h2 className="mt-2 text-[1.75rem] font-black leading-none tracking-tight text-[var(--primary-text)] md:text-[2.1rem]">
                {t(maker.nameKey)}
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--secondary-text)] md:text-base">
                {t(maker.bioKey)}
              </p>
              <a
                href={maker.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-semibold tracking-wide text-[var(--color-violet-blue)] underline-offset-4 hover:underline"
              >
                GitHub
              </a>
            </article>
          ))}
        </section>

        <div className="mt-auto pt-16 pb-4">
          <GuestEntryNav />
        </div>
      </div>
    </main>
  );
};
