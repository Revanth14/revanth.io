const GITHUB_USERNAME = "revanth14";
const HASHNODE_HOST = "revanthch.hashnode.dev";

type HashnodePost = {
  title: string;
  url: string;
  publishedAt: string;
};

async function getHashnodePosts(): Promise<HashnodePost[]> {
  try {
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          publication(host: "${HASHNODE_HOST}") {
            posts(first: 5) {
              edges {
                node {
                  title
                  url
                  publishedAt
                }
              }
            }
          }
        }`,
      }),
      next: { revalidate: 3600 },
    });

    const data = await res.json();
    const edges = data?.data?.publication?.posts?.edges;
    if (!edges) return [];

    return edges.map((edge: { node: HashnodePost }) => edge.node);
  } catch {
    return [];
  }
}

export default async function Home() {
  const posts = await getHashnodePosts();

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="sidebar-sticky">
          <img src="/dp.jpg" alt="Revanth" className="dp" />
          <p>Hi, I'm</p>
          <h1>Revanth</h1>
          <p className="sub">Software Engineer</p>
       
          <nav className="social">
            <a href="mailto:hello@revanth.io">hello@revanth.io</a>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/revanthch14"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/revanth_14"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
          </nav>
        </div>
      </aside>

      <main>
        <section>
          <h2>About</h2>
          <p className="about">
  Software engineer specializing in building enterprise-grade applications, data engineering, cloud infrastructure with hands-on experience building cloud-native applications, data pipelines, and scalable platforms across AWS and Azure.
</p>

<p className="about">
  Currently building <strong>IndexQube</strong> -  A stateless L7 proxy written in Go that sits between Claude Code and Anthropic's API. 
</p>

<p className="about">
  Outside of work, I write about Software engineering, AI Agents, Data Analytics, System design, and things I learn along the way. I believing in learning in public and building in the open.
</p>
        </section>

        <section>
          <h2>Writing</h2>
          <ul>
            {posts.length > 0 ? (
              posts.map((post) => (
                <li key={post.url}>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {post.title}
                  </a>{" "}
                  <span className="date">
                    {new Date(post.publishedAt).getFullYear()}
                  </span>
                </li>
              ))
            ) : (
              <li className="muted-text">No articles yet.</li>
            )}
          </ul>
          {posts.length > 0 && (
            <a
              href={`https://${HASHNODE_HOST}`}
              target="_blank"
              rel="noopener noreferrer"
              className="show-more"
            >
              show more &rarr;
            </a>
          )}
        </section>
        

        <section>
          <h2>Projects</h2>
          <ul>
            <li>
              <a
                href="https://www.indexqube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                IndexQube
              </a>{" "}
              — index calculation, multi-provider validation, audit-ready
              lineage
            </li>
          </ul>
        </section>

        

        <section>
          <h2>Experience</h2>
          <ul>
            <li>
              <strong>Gurus Infotech</strong> Senior Software Engineer{" "}
              <span className="date">2025 — Present</span>
            </li>
            <li>
              <strong>Infosys Ltd</strong> Software Engineer{" "}
              <span className="date">2018 — 2023</span>
            </li>
          </ul>
        </section>
        <section>
          <h2>GitHub</h2>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`}
              alt={`${GITHUB_USERNAME}'s GitHub contribution chart`}
              className="graph-img"
            />
          </a>
        </section>

        <footer>
          <p>&copy; 2025 Revanth</p>
        </footer>
      </main>
    </div>
  );
}
