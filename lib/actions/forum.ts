"use server";

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireUser, type ActionState } from "@/lib/actions/auth";
import { db } from "@/lib/db";
import { forumComments, forumTopics, forumVotes, users } from "@/lib/db/schema";

const topicSchema = z.object({
  title: z.string().trim().min(4, "Naslov je prekratak").max(160),
  body: z.string().trim().min(10, "Tekst je prekratak").max(8000),
});

const commentSchema = z.object({
  topicId: z.string().uuid(),
  body: z.string().trim().min(2, "Komentar je prekratak").max(4000),
});

const voteSchema = z.object({
  targetType: z.enum(["topic", "comment"]),
  targetId: z.string().uuid(),
  topicId: z.string().uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
});

export type ForumVoteCounts = { likes: number; dislikes: number };

export type ForumTopicListItem = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
  commentCount: number;
  likes: number;
  dislikes: number;
  myVote: 1 | -1 | null;
};

export type ForumCommentItem = {
  id: string;
  body: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
  likes: number;
  dislikes: number;
  myVote: 1 | -1 | null;
};

export type ForumTopicDetail = ForumTopicListItem & {
  comments: ForumCommentItem[];
};

async function voteMap(
  targetType: "topic" | "comment",
  ids: string[],
  userId?: string,
): Promise<Map<string, ForumVoteCounts & { myVote: 1 | -1 | null }>> {
  const map = new Map<string, ForumVoteCounts & { myVote: 1 | -1 | null }>();
  for (const id of ids) {
    map.set(id, { likes: 0, dislikes: 0, myVote: null });
  }
  if (ids.length === 0) return map;

  const rows = await db
    .select({
      targetId: forumVotes.targetId,
      value: forumVotes.value,
      count: sql<number>`count(*)::int`,
    })
    .from(forumVotes)
    .where(and(eq(forumVotes.targetType, targetType), inArray(forumVotes.targetId, ids)))
    .groupBy(forumVotes.targetId, forumVotes.value);

  for (const row of rows) {
    const entry = map.get(row.targetId);
    if (!entry) continue;
    if (row.value === 1) entry.likes = Number(row.count);
    if (row.value === -1) entry.dislikes = Number(row.count);
  }

  if (userId) {
    const mine = await db
      .select({
        targetId: forumVotes.targetId,
        value: forumVotes.value,
      })
      .from(forumVotes)
      .where(
        and(
          eq(forumVotes.userId, userId),
          eq(forumVotes.targetType, targetType),
          inArray(forumVotes.targetId, ids),
        ),
      );
    for (const row of mine) {
      const entry = map.get(row.targetId);
      if (entry) entry.myVote = row.value === 1 ? 1 : -1;
    }
  }

  return map;
}

export async function listForumTopics(userId?: string): Promise<ForumTopicListItem[]> {
  const topics = await db
    .select({
      id: forumTopics.id,
      title: forumTopics.title,
      body: forumTopics.body,
      createdAt: forumTopics.createdAt,
      authorId: forumTopics.authorId,
      authorName: users.name,
    })
    .from(forumTopics)
    .innerJoin(users, eq(forumTopics.authorId, users.id))
    .orderBy(desc(forumTopics.createdAt));

  const ids = topics.map((t) => t.id);
  const [votes, commentRows] = await Promise.all([
    voteMap("topic", ids, userId),
    ids.length === 0
      ? Promise.resolve([] as { topicId: string; count: number }[])
      : db
          .select({
            topicId: forumComments.topicId,
            count: sql<number>`count(*)::int`,
          })
          .from(forumComments)
          .where(inArray(forumComments.topicId, ids))
          .groupBy(forumComments.topicId),
  ]);

  const commentCounts = new Map(commentRows.map((r) => [r.topicId, Number(r.count)]));

  return topics.map((t) => {
    const v = votes.get(t.id) ?? { likes: 0, dislikes: 0, myVote: null };
    return {
      ...t,
      authorName: t.authorName?.trim() || "Član",
      commentCount: commentCounts.get(t.id) ?? 0,
      likes: v.likes,
      dislikes: v.dislikes,
      myVote: v.myVote,
    };
  });
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getForumTopic(
  id: string,
  userId?: string,
): Promise<ForumTopicDetail | null> {
  if (!UUID_RE.test(id)) return null;

  const [topic] = await db
    .select({
      id: forumTopics.id,
      title: forumTopics.title,
      body: forumTopics.body,
      createdAt: forumTopics.createdAt,
      authorId: forumTopics.authorId,
      authorName: users.name,
    })
    .from(forumTopics)
    .innerJoin(users, eq(forumTopics.authorId, users.id))
    .where(eq(forumTopics.id, id))
    .limit(1);

  if (!topic) return null;

  const comments = await db
    .select({
      id: forumComments.id,
      body: forumComments.body,
      createdAt: forumComments.createdAt,
      authorId: forumComments.authorId,
      authorName: users.name,
    })
    .from(forumComments)
    .innerJoin(users, eq(forumComments.authorId, users.id))
    .where(eq(forumComments.topicId, id))
    .orderBy(forumComments.createdAt);

  const commentIds = comments.map((c) => c.id);
  const [topicVotes, commentVotes] = await Promise.all([
    voteMap("topic", [topic.id], userId),
    voteMap("comment", commentIds, userId),
  ]);
  const tv = topicVotes.get(topic.id) ?? { likes: 0, dislikes: 0, myVote: null };

  return {
    ...topic,
    authorName: topic.authorName?.trim() || "Član",
    commentCount: comments.length,
    likes: tv.likes,
    dislikes: tv.dislikes,
    myVote: tv.myVote,
    comments: comments.map((c) => {
      const v = commentVotes.get(c.id) ?? { likes: 0, dislikes: 0, myVote: null };
      return {
        ...c,
        authorName: c.authorName?.trim() || "Član",
        likes: v.likes,
        dislikes: v.dislikes,
        myVote: v.myVote,
      };
    }),
  };
}

export async function createForumTopic(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false, error: "Samo prijavljeni članovi mogu otvoriti temu." };
  }

  const parsed = topicSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const [row] = await db
    .insert(forumTopics)
    .values({
      title: parsed.data.title,
      body: parsed.data.body,
      authorId: user.id,
    })
    .returning({ id: forumTopics.id });

  revalidatePath("/forum");
  redirect(`/forum/${row.id}`);
}

export async function createForumComment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false, error: "Samo prijavljeni članovi mogu komentarisati." };
  }

  const parsed = commentSchema.safeParse({
    topicId: formData.get("topicId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const [topic] = await db
    .select({ id: forumTopics.id })
    .from(forumTopics)
    .where(eq(forumTopics.id, parsed.data.topicId))
    .limit(1);
  if (!topic) return { ok: false, error: "Tema ne postoji." };

  await db.insert(forumComments).values({
    topicId: parsed.data.topicId,
    authorId: user.id,
    body: parsed.data.body,
  });

  revalidatePath("/forum");
  revalidatePath(`/forum/${parsed.data.topicId}`);
  return { ok: true, message: "Komentar objavljen." };
}

export async function voteForum(formData: FormData): Promise<void> {
  const user = await requireUser();
  const rawValue = Number(formData.get("value"));
  const parsed = voteSchema.safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    topicId: formData.get("topicId"),
    value: rawValue === 1 ? 1 : rawValue === -1 ? -1 : rawValue,
  });
  if (!parsed.success) return;

  const [existing] = await db
    .select({ id: forumVotes.id, value: forumVotes.value })
    .from(forumVotes)
    .where(
      and(
        eq(forumVotes.userId, user.id),
        eq(forumVotes.targetType, parsed.data.targetType),
        eq(forumVotes.targetId, parsed.data.targetId),
      ),
    )
    .limit(1);

  if (existing) {
    if (existing.value === parsed.data.value) {
      await db.delete(forumVotes).where(eq(forumVotes.id, existing.id));
    } else {
      await db.update(forumVotes).set({ value: parsed.data.value }).where(eq(forumVotes.id, existing.id));
    }
  } else {
    await db.insert(forumVotes).values({
      userId: user.id,
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      value: parsed.data.value,
    });
  }

  revalidatePath("/forum");
  revalidatePath(`/forum/${parsed.data.topicId}`);
}

async function deleteVotes(targetType: "topic" | "comment", ids: string[]) {
  if (ids.length === 0) return;
  await db
    .delete(forumVotes)
    .where(and(eq(forumVotes.targetType, targetType), inArray(forumVotes.targetId, ids)));
}

export async function deleteForumTopic(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!UUID_RE.test(id)) return;

  const comments = await db
    .select({ id: forumComments.id })
    .from(forumComments)
    .where(eq(forumComments.topicId, id));

  await deleteVotes(
    "comment",
    comments.map((c) => c.id),
  );
  await deleteVotes("topic", [id]);
  await db.delete(forumTopics).where(eq(forumTopics.id, id));

  revalidatePath("/forum");
  redirect("/forum");
}

export async function deleteForumComment(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const topicId = String(formData.get("topicId") || "");
  if (!UUID_RE.test(id)) return;

  await deleteVotes("comment", [id]);
  await db.delete(forumComments).where(eq(forumComments.id, id));

  revalidatePath("/forum");
  if (UUID_RE.test(topicId)) revalidatePath(`/forum/${topicId}`);
}
