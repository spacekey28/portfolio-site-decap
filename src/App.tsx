import { useEffect, useState } from "react";
import { fetchMarkdown } from "./content";

type ProjectItem = { slug: string; path: string };

export default function App() {
  const [home, setHome] = useState<{data:any; html:string}|null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectCards, setProjectCards] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const h = await fetchMarkdown("/content/pages/home.md");
      setHome(h as any);

      const list: ProjectItem[] = await (await fetch("/projects.json")).json();
      setProjects(list);

      const loaded = await Promise.all(
        list.map(async (p) => {
          const md = await fetchMarkdown(p.path);
          return { slug: p.slug, ...md.data };
        })
      );
      setProjectCards(loaded);
    })();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Tailwind Test - This should show a blue background if Tailwind is working */}
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-6 text-center">
        🎉 Tailwind CSS is working! This div has a blue background.
      </div>
      
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {home?.data?.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {home?.data?.intro}
        </p>
        {home?.data?.hero && (
          <img 
            src={home.data.hero} 
            alt="" 
            className="max-w-full rounded-xl shadow-lg"
          />
        )}
      </header>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Projects
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projectCards.map((p) => (
            <article 
              key={p.slug} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              {p.thumbnail && (
                <img 
                  src={p.thumbnail} 
                  alt="" 
                  className="w-full rounded-lg mb-4 object-cover h-48"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {p.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {p.summary}
              </p>
              <small className="text-gray-500 dark:text-gray-400">
                {p.tech}
              </small>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Your Name
      </footer>
    </main>
  );
}
