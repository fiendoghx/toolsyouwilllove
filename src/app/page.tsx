import Image from "next/image";
import Link from "next/link";

import projects from "@/data/projects.json";

type Project = {
  title: string;
  description: string;
  tag: string;
  href: string;
  color: string;
};

export default function Home() {
  const year = new Date().getFullYear();
  const projectList = projects as Project[];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center gap-4 border-b border-zinc-200 pb-8">
          <Image
            src="/favicon.ico"
            alt="Diogenes.tywl logo"
            width={48}
            height={48}
            className="rounded-xl border border-zinc-200 bg-white"
            priority
          />
          <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            Diogenes.tywl
          </h1>
        </header>

        <main className="flex-1 py-10 sm:py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectList.map((project) => (
              <Link key={project.href} href={project.href} className="block">
                <article className="h-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
                  <div
                    className="h-44 w-full border-b border-black/5"
                    style={{ background: project.color }}
                    aria-hidden="true"
                  />
                  <div className="space-y-3 p-6">
                    <p className="text-xs font-medium tracking-[0.18em] text-zinc-500">
                      {project.tag}
                    </p>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-zinc-950">
                      {project.title}
                    </h2>
                    <p className="text-sm leading-6 text-zinc-600">
                      {project.description}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </main>

        <footer className="flex flex-col gap-2 border-t border-zinc-200 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Diogenes.tywl</span>
          <span>Made by fiendo</span>
        </footer>
      </div>
    </div>
  );
}
