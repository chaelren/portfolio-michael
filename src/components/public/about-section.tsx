interface AboutProps {
  about: {
    title: string;
    description: string;
    imageUrl: string | null;
  };
}

export default function AboutSection({ about }: AboutProps) {
  const paragraphs = about.description.split("\n").filter((p) => p.trim());

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{about.title}</span>
        </h2>

        <div className={`flex flex-col ${about.imageUrl ? "md:flex-row" : ""} items-center gap-10`}>
          {about.imageUrl && (
            <div className="shrink-0">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
                <img src={about.imageUrl} alt="About me" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}