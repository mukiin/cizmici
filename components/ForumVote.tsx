import Link from "next/link";
import { voteForum } from "@/lib/actions/forum";

type Props = {
  targetType: "topic" | "comment";
  targetId: string;
  topicId: string;
  likes: number;
  dislikes: number;
  myVote: 1 | -1 | null;
  loggedIn: boolean;
  loginHint?: boolean;
};

export function ForumVote({
  targetType,
  targetId,
  topicId,
  likes,
  dislikes,
  myVote,
  loggedIn,
  loginHint = false,
}: Props) {
  if (!loggedIn) {
    return (
      <div className="forum-votes">
        <span className="forum-vote-stat">Lajk {likes}</span>
        <span className="forum-vote-stat">Dislajk {dislikes}</span>
        {loginHint ? (
          <Link className="forum-vote-login" href={`/prijava?callbackUrl=/forum/${topicId}`}>
            Prijavite se da glasate
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <form action={voteForum} className="forum-votes">
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <input type="hidden" name="topicId" value={topicId} />
      <button
        type="submit"
        name="value"
        value="1"
        className={`forum-vote-btn${myVote === 1 ? " is-on" : ""}`}
        aria-pressed={myVote === 1}
      >
        Lajk {likes}
      </button>
      <button
        type="submit"
        name="value"
        value="-1"
        className={`forum-vote-btn down${myVote === -1 ? " is-on" : ""}`}
        aria-pressed={myVote === -1}
      >
        Dislajk {dislikes}
      </button>
    </form>
  );
}
