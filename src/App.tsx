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
    <main style={{maxWidth:960, margin:"0 auto", padding:24}}>
      <header>
        <h1>{home?.data?.title}</h1>
        <p>{home?.data?.intro}</p>
        {home?.data?.hero && <img src={home.data.hero} alt="" style={{maxWidth:"100%",borderRadius:12}}/>}
      </header>

      <section style={{marginTop:32}}>
        <h2>Projects</h2>
        <div style={{display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))"}}>
          {projectCards.map((p) => (
            <article key={p.slug} style={{border:"1px solid #eee",padding:16,borderRadius:8}}>
              {p.thumbnail && <img src={p.thumbnail} alt="" style={{width:"100%",borderRadius:8,marginBottom:8}} />}
              <h3 style={{margin:"8px 0"}}>{p.title}</h3>
              <p style={{opacity:.8}}>{p.summary}</p>
              <small style={{opacity:.6}}>{p.tech}</small>
            </article>
          ))}
        </div>
      </section>

      <footer style={{marginTop:48,opacity:.6}}>
        © {new Date().getFullYear()} Your Name
      </footer>
    </main>
  );
}
