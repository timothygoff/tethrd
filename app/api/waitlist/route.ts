import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, source = "landing-page" } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_WAITLIST_TABLE_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Email: email,
              "Submitted At": new Date().toISOString().slice(0, 10),
              Source: source,
            },
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
