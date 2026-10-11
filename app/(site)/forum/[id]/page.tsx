import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ForumCommentForm } from "@/components/ForumCommentForm";
import { ForumDeleteButton } from "@/components/ForumDeleteButton";
import { ForumVote } from "@/components/ForumVote";
import { PageBand } from "@/components/PageBand";
import { getForumTopic } from "@/lib/actions/forum";
import { formatDateTime } from "@/lib/dates";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();
  const topic = await getForumTopic(id, session?.user?.id);
  return { title: topic?.title ?? "Forum" };
}

function Body({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((para, i) =>
        para.trim() ? (
          <p key={i} className="forum-body">
            {para}
          </p>
        ) : null,
      )}
    </>
  );
}

export default async function ForumTopicPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";
  const topic = await getForumTopic(id, userId);
  if (!topic) notFound();

  return (
    <>
      <PageBand
        kicker="Forum"
        title={topic.title}
        lead={`${topic.authorName} · ${formatDateTime(topic.createdAt)}`}
      />
      <section className="tight">
        <div className="wrap narrow">
          <article className="screen-card">
            <Body text={topic.body} />
            <div className="forum-foot">
              <div className="meta">
                {topic.authorName} · {formatDateTime(topic.createdAt)}
              </div>
              <div className="forum-actions">
                <ForumVote
                  targetType="topic"
                  targetId={topic.id}
                  topicId={topic.id}
                  likes={topic.likes}
                  dislikes={topic.dislikes}
                  myVote={topic.myVote}
                  loggedIn={Boolean(userId)}
                  loginHint
                />
                {isAdmin ? <ForumDeleteButton kind="topic" id={topic.id} /> : null}
              </div>
            </div>
          </article>

          <h2 className="forum-comments-title">
            Komentari ({topic.commentCount})
          </h2>

          {topic.comments.length === 0 ? (
            <p>Još nema komentara.</p>
          ) : (
            <ul className="forum-comments">
              {topic.comments.map((comment) => (
                <li key={comment.id} className="forum-comment">
                  <div className="meta">
                    {comment.authorName} · {formatDateTime(comment.createdAt)}
                  </div>
                  <Body text={comment.body} />
                  <div className="forum-actions">
                    <ForumVote
                      targetType="comment"
                      targetId={comment.id}
                      topicId={topic.id}
                      likes={comment.likes}
                      dislikes={comment.dislikes}
                      myVote={comment.myVote}
                      loggedIn={Boolean(userId)}
                      loginHint
                    />
                    {isAdmin ? (
                      <ForumDeleteButton kind="comment" id={comment.id} topicId={topic.id} />
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {session?.user ? (
            <ForumCommentForm topicId={topic.id} />
          ) : (
            <p className="screen-card" style={{ marginTop: 28 }}>
              Da komentarišete ili glasate,{" "}
              <Link href={`/prijava?callbackUrl=/forum/${topic.id}`}>prijavite se</Link>.
            </p>
          )}

          <p style={{ marginTop: 18 }}>
            <Link href="/forum">← Sve teme</Link>
          </p>
        </div>
      </section>
    </>
  );
}
