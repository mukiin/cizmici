import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";

loadEnv({ path: ".env.local" });

const SEED_MEMBERS = [
  { email: "seed.forum.1@cizmici.invalid", name: "Hasan Čizmić" },
  { email: "seed.forum.2@cizmici.invalid", name: "Amela Kovačević" },
  { email: "seed.forum.3@cizmici.invalid", name: "Emir Husić" },
  { email: "seed.forum.4@cizmici.invalid", name: "Fatima Bajrić" },
] as const;

const TOPICS: {
  title: string;
  body: string;
  comments: string[];
}[] = [
  {
    title: "Put Čizmići–Ćapici: rupe poslije zime",
    body: "Na dionici prema Ćapicima opet su rupe poslije zime, naročito pred usponom. Ima li iko informaciju da li je Grad ili MZ najavio krpljenje, ili da skupimo tačne lokacije pa pošaljemo prijavu?",
    comments: [
      "Isto kod skretanja za gornje kuće — noću se jedva izbjegne. Mogu slikati pa staviti u galeriju.",
      "Prijavu možete poslati i preko stranice Prijave, da ostane zapis. Ja ću dodati svoju dionicu.",
      "Ako se krpi samo rupama, za mjesec dana je isto. Treba bar jedan pravi sloj na najgorem komadu.",
    ],
  },
  {
    title: "Dan MZ — ko dolazi iz dijaspore?",
    body: "August se bliži. Ko planira doći iz Njemačke, Austrije ili Slovenije za Dan MZ? Lako je dogovoriti se za kafu i da se djeca vide, umjesto da svako prođe samo pored kuće.",
    comments: [
      "Mi iz Stuttgarta dolazimo prvu sedmicu. Javite se ako se pravi zajednički ručak.",
      "Iz Ljubljane smo, stižemo petak uveče. Ako bude nešto u domu, javite ovdje.",
      "Bolje jedan konkretan sat i mjesto nego deset poruka po WhatsApp grupama.",
    ],
  },
  {
    title: "Vodovod ljeti: slab pritisak u gornjem dijelu",
    body: "Kad krene suša, u gornjem dijelu sela pritisak padne poslijepodne. Da li je to i ove godine isto, ili je nešto rađeno na mreži? Tražim iskustvo, ne nagađanje.",
    comments: [
      "Kod nas dolje je u redu, gore se čuje da ljudi pune cisterne uveče.",
      "Lani je pomoglo kad se nije zalijevalo u špicu. Ako svi otvore slavine u isto vrijeme, nema šanse.",
      "Ako ima više istih prijava, možemo ih skupiti i poslati kao jednu, da ne ide svako zasebno.",
    ],
  },
  {
    title: "Školski prevoz do Cazina — kašnjenja ujutro",
    body: "Komšije pitaju: da li kombi/autobus za Cazin i ove godine kasni na istim stajalištima? Djeca čekaju na kiši. Ako neko vozi redovno, neka kaže koja stajališta su najgora.",
    comments: [
      "Kod nas čeka 10–15 minuta. Zimi je to predugo, pogotovo malima.",
      "Ako vozač mijenja rutu zbog rupa, to se slaže s onom temom o putu. Jedno vuče drugo.",
      "Napišimo stajalište i okvirno vrijeme, bez imena djece. To admin može proslijediti ako zatreba.",
    ],
  },
  {
    title: "Divlja deponija iza puta prema šumi",
    body: "Iza puta prema šumi opet se ostavlja građevinski šut i kese. Nije to jedno dvorište — vidi se da dolaze i kola koja nisu iz sela. Ko je zadnji tamo prošao, je li gore ili isto?",
    comments: [
      "U nedjelju je još bilo tu. Jedna guma i daske pored.",
      "Ako se slika i označi približno mjesto, lakše je prijaviti. Bez optuživanja komšija na pamet.",
      "Čim se jednom očisti a ne zatvori prilaz, vraća se. Treba i prijava i da se vidi ko istovaruje.",
    ],
  },
];

async function ensureSeedMembers(
  db: typeof import("../lib/db").db,
  users: typeof import("../lib/db/schema").users,
) {
  const ids: string[] = [];
  for (const member of SEED_MEMBERS) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, member.email))
      .limit(1);
    if (existing) {
      ids.push(existing.id);
      continue;
    }
    const [created] = await db
      .insert(users)
      .values({
        email: member.email,
        name: member.name,
        role: "member",
      })
      .returning({ id: users.id });
    ids.push(created.id);
  }
  return ids;
}

async function main() {
  const { db } = await import("../lib/db");
  const { forumComments, forumTopics, users } = await import("../lib/db/schema");

  const existingUsers = await db.select({ id: users.id, role: users.role }).from(users);
  const existingIds = existingUsers.map((u) => u.id);
  const members =
    existingIds.length >= 3 ? [] : await ensureSeedMembers(db, users);
  const authors = [...existingIds, ...members];
  if (authors.length === 0) {
    throw new Error("Nema korisnika za seed foruma.");
  }

  let createdTopics = 0;
  let createdComments = 0;

  for (const [index, topic] of TOPICS.entries()) {
    const [already] = await db
      .select({ id: forumTopics.id })
      .from(forumTopics)
      .where(eq(forumTopics.title, topic.title))
      .limit(1);
    if (already) {
      console.log("Preskočeno (postoji):", topic.title);
      continue;
    }

    const authorId = authors[index % authors.length];
    const [row] = await db
      .insert(forumTopics)
      .values({
        title: topic.title,
        body: topic.body,
        authorId,
      })
      .returning({ id: forumTopics.id });

    createdTopics += 1;

    for (const [cIndex, body] of topic.comments.entries()) {
      await db.insert(forumComments).values({
        topicId: row.id,
        authorId: authors[(index + cIndex + 1) % authors.length],
        body,
      });
      createdComments += 1;
    }
  }

  console.log(`Forum seed: ${createdTopics} tema, ${createdComments} komentara.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
