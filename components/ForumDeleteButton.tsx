"use client";

import { useState } from "react";
import { deleteForumComment, deleteForumTopic } from "@/lib/actions/forum";

type TopicProps = {
  kind: "topic";
  id: string;
};

type CommentProps = {
  kind: "comment";
  id: string;
  topicId: string;
};

export function ForumDeleteButton(props: TopicProps | CommentProps) {
  const [ask, setAsk] = useState(false);
  const isTopic = props.kind === "topic";

  if (!ask) {
    return (
      <button type="button" className="btn ghost" onClick={() => setAsk(true)}>
        {isTopic ? "Obriši temu" : "Obriši"}
      </button>
    );
  }

  return (
    <form
      action={isTopic ? deleteForumTopic : deleteForumComment}
      className="forum-delete-confirm"
    >
      <input type="hidden" name="id" value={props.id} />
      {!isTopic ? <input type="hidden" name="topicId" value={props.topicId} /> : null}
      <span>
        {isTopic ? "Obrisati ovu temu i sve komentare?" : "Obrisati ovaj komentar?"}
      </span>
      <button type="submit" className="btn primary">
        Da, obriši
      </button>
      <button type="button" className="btn ghost" onClick={() => setAsk(false)}>
        Odustani
      </button>
    </form>
  );
}
