import { getSql } from "@/lib/db";
import { DEMO_GIGS } from "@/lib/demo-data";

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

export type MemberRow = {
  user_id: string;
  email: string;
  role: "admin" | "member";
};

async function userEmail(userId: string): Promise<string> {
  const sql = await getSql();
  const rows = await sql<{ email: string }>`select email from "user" where id = ${userId}`;
  return (rows[0]?.email ?? "").trim().toLowerCase();
}

export async function ensureMember(userId: string): Promise<MemberRow | null> {
  const sql = await getSql();
  const existing = await sql<MemberRow>`
    select user_id, email, role from members where user_id = ${userId}
  `;
  if (existing[0]) return existing[0];

  const email = await userEmail(userId);
  const count = await sql<{ n: number }>`select count(*)::int as n from members`;
  const memberCount = count[0]?.n ?? 0;

  if (memberCount === 0) {
    const rows = await sql<MemberRow>`
      insert into members (user_id, email, role)
      values (${userId}, ${email || `user-${userId}@jovalus.local`}, 'admin')
      returning user_id, email, role
    `;
    await seedGigsIfEmpty(userId);
    return rows[0] ?? null;
  }

  if (!email) return null;
  const invite = await sql<{ email: string }>`select email from invites where email = ${email}`;
  if (!invite[0]) return null;

  const rows = await sql<MemberRow>`
    insert into members (user_id, email, role)
    values (${userId}, ${email}, 'member')
    on conflict (user_id) do update set email = excluded.email
    returning user_id, email, role
  `;
  await sql`delete from invites where email = ${email}`;
  return rows[0] ?? null;
}

export async function requireMember(userId: string): Promise<MemberRow> {
  const member = await ensureMember(userId);
  if (!member) throw new ForbiddenError();
  return member;
}

export async function requireAdmin(userId: string): Promise<MemberRow> {
  const member = await requireMember(userId);
  if (member.role !== "admin") throw new ForbiddenError();
  return member;
}

async function seedGigsIfEmpty(userId: string) {
  const sql = await getSql();
  const existing = await sql<{ n: number }>`select count(*)::int as n from gigs`;
  if ((existing[0]?.n ?? 0) > 0) return;
  for (const gig of DEMO_GIGS) {
    await sql`
      insert into gigs (
        id, title, type, date, start_time, end_time, venue, city, address,
        contact_name, contact_phone, fee, deposit, status, notes, setlist, created_by
      ) values (
        ${gig.id}, ${gig.title}, ${gig.type}, ${gig.date}::date, ${gig.startTime},
        ${gig.endTime}, ${gig.venue}, ${gig.city}, ${gig.address}, ${gig.contactName},
        ${gig.contactPhone}, ${gig.fee}, ${gig.deposit}, ${gig.status}, ${gig.notes},
        ${gig.setlist}, ${userId}
      )
      on conflict (id) do nothing
    `;
  }
}
