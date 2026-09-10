import { unstable_cache } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/actions/auth";
import { db } from "@/lib/db";
import { issues, stories, users } from "@/lib/db/schema";

const storiesCached = unstable_cache(
  async () =>
    db
      .select({
        id: stories.id,
        title: stories.title,
        slug: stories.slug,
        body: stories.body,
        status: stories.status,
        createdAt: stories.createdAt,
        authorName: users.name,
        authorEmail: users.email,
      })
      .from(stories)
      .innerJoin(users, eq(stories.authorId, users.id))
      .orderBy(desc(stories.createdAt))
      .limit(80),
  ["admin-stories"],
  { revalidate: 30, tags: ["admin-stories"] },
);

const issuesCached = unstable_cache(
  async () =>
    db
      .select({
        id: issues.id,
        title: issues.title,
        kind: issues.kind,
        location: issues.location,
        body: issues.body,
        status: issues.status,
        visibility: issues.visibility,
        createdAt: issues.createdAt,
        authorName: users.name,
        authorEmail: users.email,
      })
      .from(issues)
      .innerJoin(users, eq(issues.authorId, users.id))
      .orderBy(desc(issues.createdAt))
      .limit(80),
  ["admin-issues"],
  { revalidate: 30, tags: ["admin-issues"] },
);

export async function listAllStoriesAdmin() {
  await requireAdmin();
  return storiesCached();
}

export async function listAllIssuesAdmin() {
  await requireAdmin();
  return issuesCached();
}

export async function getAdminOverview() {
  await requireAdmin();
  const [stories, issues] = await Promise.all([storiesCached(), issuesCached()]);
  return { stories, issues };
}
