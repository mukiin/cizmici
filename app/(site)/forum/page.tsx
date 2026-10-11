import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { ForumDeleteButton } from "@/components/ForumDeleteButton";
import { ForumTopicForm } from "@/components/ForumTopicForm";
import { ForumVote } from "@/components/ForumVote";
import { PageBand } from "@/components/PageBand";
import { listForumTopics } from "@/lib/actions/forum";
import { formatDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Forum" };
export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";
  const topics = await listForumTopics(userId);

  return (
    <>
      <PageBand
        kicker="Razgovor zajednice"
        title="Forum"
        lead="Otvorite temu, komentarišite i glasajte. Pišu samo prijavljeni članovi; uz svaku objavu stoje ime i vrijeme."
      />
      <section className="tight">
        <div className="wrap">
          {session?.user ? (
            <ForumTopicForm />
          ) : (
            <p className="screen-card" style={{ marginBottom: 28 }}>
              Da otvorite temu, komentarišete ili glasate,{" "}
              <Link href="/prijava?callbackUrl=/forum">prijavite se</Link>.
            </p>
          )}

          {topics.length === 0 ? (
            <p>Još nema tema. Budite prvi.</p>
          ) : (
            <div className="forum-list">
              {topics.map((topic) => (
                <article key={topic.id} className="forum-row">
                  <div className="forum-row-main">
                    <h2>
                      <Link href={`/forum/${topic.id}`}>{topic.title}</Link>
                    </h2>
                    <p className="forum-excerpt">
                      {topic.body.slice(0, 180)}
                      {topic.body.length > 180 ? "…" : ""}
                    </p>
                    <div className="meta">
                      {topic.authorName} · {formatDateTime(topic.createdAt)} · {topic.commentCount}{" "}
                      {topic.commentCount === 1 ? "komentar" : "komentara"}
                    </div>
                    {isAdmin ? (
                      <div className="forum-admin">
                        <ForumDeleteButton kind="topic" id={topic.id} />
                      </div>
                    ) : null}
                  </div>
                  <ForumVote
                    targetType="topic"
                    targetId={topic.id}
                    topicId={topic.id}
                    likes={topic.likes}
                    dislikes={topic.dislikes}
                    myVote={topic.myVote}
                    loggedIn={Boolean(userId)}
                  />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
