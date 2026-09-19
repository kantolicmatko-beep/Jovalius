import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { DocKind, Gig, GigDocument, GigStatus, GigType } from "@/lib/types";
import {
  EMPTY_WEDDING_FORM,
  formFromGig,
  mergeWeddingForm,
  type WeddingFormData,
} from "@/lib/wedding-form";
import { requireAdmin, requireMember, ensureMember } from "@/lib/server/access";

type GigRow = {
  id: string;
  title: string;
  type: GigType;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  city: string;
  address: string;
  contact_name: string;
  contact_phone: string;
  fee: number | null;
  deposit: number | null;
  status: GigStatus;
  notes: string;
  setlist: string;
  created_at_ms: number;
};

function mapGig(row: GigRow): Gig {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    venue: row.venue,
    city: row.city,
    address: row.address,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    fee: row.fee,
    deposit: row.deposit,
    status: row.status,
    notes: row.notes,
    setlist: row.setlist,
    createdAt: Number(row.created_at_ms),
  };
}

const GIG_SELECT = `
  id, title, type, date::text as date, start_time, end_time, venue, city, address,
  contact_name, contact_phone, fee, deposit, status, notes, setlist,
  (extract(epoch from created_at) * 1000)::bigint as created_at_ms
`;

export const bootstrapSession = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const member = await ensureMember(context.userId);
    if (!member) return { ok: false as const };
    return { ok: true as const, role: member.role, email: member.email };
  });

export const listMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const members = await sql<{ user_id: string; email: string; role: "admin" | "member" }>`
      select user_id, email, role from members order by created_at
    `;
    const invites = await sql<{ email: string }>`
      select email from invites order by created_at
    `;
    return { members, invites: invites.map((i) => i.email) };
  });

export const inviteMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((email: string) => email.trim().toLowerCase())
  .handler(async ({ context, data: email }) => {
    await requireAdmin(context.userId);
    if (!email.includes("@")) throw new Error("Upiši valjanu e-mail adresu.");
    const sql = await getSql();
    const already = await sql<{ user_id: string }>`select user_id from members where email = ${email}`;
    if (already[0]) throw new Error("Ova adresa je već član benda.");
    await sql`
      insert into invites (email, invited_by) values (${email}, ${context.userId})
      on conflict (email) do nothing
    `;
    return { email };
  });

export const revokeInvite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((email: string) => email.trim().toLowerCase())
  .handler(async ({ context, data: email }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from invites where email = ${email}`;
    return { ok: true };
  });

export const removeMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((userId: string) => userId)
  .handler(async ({ context, data: userId }) => {
    await requireAdmin(context.userId);
    if (userId === context.userId) throw new Error("Ne možeš ukloniti samog sebe.");
    const sql = await getSql();
    const admins = await sql<{ n: number }>`select count(*)::int as n from members where role = 'admin'`;
    const target = await sql<{ role: string }>`select role from members where user_id = ${userId}`;
    if (target[0]?.role === "admin" && (admins[0]?.n ?? 0) <= 1) {
      throw new Error("Mora ostati barem jedan admin.");
    }
    await sql`delete from members where user_id = ${userId}`;
    return { ok: true };
  });

export const listGigs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    const rows = await sql.query<GigRow>(
      `select ${GIG_SELECT} from gigs order by date, start_time`,
    );
    return rows.map(mapGig);
  });

export const getGig = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    const rows = await sql.query<GigRow>(`select ${GIG_SELECT} from gigs where id = $1`, [id]);
    return rows[0] ? mapGig(rows[0]) : null;
  });

export type GigWrite = Omit<Gig, "createdAt">;

export const upsertGig = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((gig: GigWrite) => gig)
  .handler(async ({ context, data: gig }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    await sql`
      insert into gigs (
        id, title, type, date, start_time, end_time, venue, city, address,
        contact_name, contact_phone, fee, deposit, status, notes, setlist, created_by
      ) values (
        ${gig.id}, ${gig.title}, ${gig.type}, ${gig.date}::date, ${gig.startTime},
        ${gig.endTime}, ${gig.venue}, ${gig.city}, ${gig.address}, ${gig.contactName},
        ${gig.contactPhone}, ${gig.fee}, ${gig.deposit}, ${gig.status}, ${gig.notes},
        ${gig.setlist}, ${context.userId}
      )
      on conflict (id) do update set
        title = excluded.title,
        type = excluded.type,
        date = excluded.date,
        start_time = excluded.start_time,
        end_time = excluded.end_time,
        venue = excluded.venue,
        city = excluded.city,
        address = excluded.address,
        contact_name = excluded.contact_name,
        contact_phone = excluded.contact_phone,
        fee = excluded.fee,
        deposit = excluded.deposit,
        status = excluded.status,
        notes = excluded.notes,
        setlist = excluded.setlist
    `;
    return gig;
  });

export const deleteGig = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    await sql`delete from gigs where id = ${id}`;
    return { ok: true };
  });

export const listDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((gigId: string) => gigId)
  .handler(async ({ context, data: gigId }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      gig_id: string;
      name: string;
      kind: DocKind;
      mime_type: string;
      size: number;
      created_at_ms: number;
    }>`
      select id, gig_id, name, kind, mime_type, size,
        (extract(epoch from created_at) * 1000)::bigint as created_at_ms
      from documents where gig_id = ${gigId}
      order by created_at desc
    `;
    return rows.map(
      (row): GigDocument => ({
        id: row.id,
        gigId: row.gig_id,
        name: row.name,
        kind: row.kind,
        mimeType: row.mime_type,
        size: row.size,
        createdAt: Number(row.created_at_ms),
      }),
    );
  });

export const addDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      gigId: string;
      name: string;
      kind: DocKind;
      mimeType: string;
      size: number;
      contentBase64: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await requireMember(context.userId);
    const id = crypto.randomUUID();
    const sql = await getSql();
    await sql`
      insert into documents (id, gig_id, name, kind, mime_type, size, content_base64, created_by)
      values (
        ${id}, ${data.gigId}, ${data.name}, ${data.kind}, ${data.mimeType},
        ${data.size}, ${data.contentBase64}, ${context.userId}
      )
    `;
    const doc: GigDocument = {
      id,
      gigId: data.gigId,
      name: data.name,
      kind: data.kind,
      mimeType: data.mimeType,
      size: data.size,
      createdAt: Date.now(),
    };
    return doc;
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    await sql`delete from documents where id = ${id}`;
    return { ok: true };
  });

export const getDocumentContent = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    const rows = await sql<{ name: string; mime_type: string; content_base64: string }>`
      select name, mime_type, content_base64 from documents where id = ${id}
    `;
    return rows[0] ?? null;
  });

export const getWeddingForm = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((gigId: string) => gigId)
  .handler(async ({ context, data: gigId }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    const gigs = await sql.query<GigRow>(`select ${GIG_SELECT} from gigs where id = $1`, [gigId]);
    const gig = gigs[0] ? mapGig(gigs[0]) : null;
    if (!gig) return null;
    const stored = await sql<{ data: string }>`select data from wedding_forms where gig_id = ${gigId}`;
    let parsed: Partial<WeddingFormData> | null = null;
    if (stored[0]?.data) {
      try {
        parsed = JSON.parse(stored[0].data) as Partial<WeddingFormData>;
      } catch {
        parsed = null;
      }
    }
    return mergeWeddingForm(parsed, formFromGig(gig));
  });

export const saveWeddingForm = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { gigId: string; data: WeddingFormData }) => input)
  .handler(async ({ context, data: input }) => {
    await requireMember(context.userId);
    const sql = await getSql();
    const json = JSON.stringify({ ...EMPTY_WEDDING_FORM, ...input.data });
    await sql`
      insert into wedding_forms (gig_id, data, updated_by)
      values (${input.gigId}, ${json}, ${context.userId})
      on conflict (gig_id) do update set
        data = excluded.data,
        updated_at = now(),
        updated_by = excluded.updated_by
    `;
    return { ok: true };
  });
