type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div>
      <p className="section-eyebrow">{eyebrow}</p>
      <h1 className="display-title mt-6 max-w-[12ch]">{title}</h1>
      <p className="section-body mt-6">{description}</p>
    </div>
  );
}
