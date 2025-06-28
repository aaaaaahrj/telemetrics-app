import { NextResponse } from "next/server";

const headers = {
  Cookie:
    "language=en; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjU2OTI0MTUsImlhdCI6MTc1MDE0MDQxNSwidWlkIjoiODZjOWU2NWRiMmE3NDllZmJhODM1OTU1ZGU1ZTQ2Y2MifQ.u6DlErQIXDUZ8-hHqiQzSvET61QJwKtG-91nAgcwmE8; uid=86c9e65db2a749efba835955de5e46cc; acw_tc=a3b5e99e17501721799371427e97c1d4cc5e617672f513bfdaf42dbfc5; cdn_sec_tc=a3b5e99e17501721799371427e97c1d4cc5e617672f513bfdaf42dbfc5",
  Accept: "application/json, text/plain, */*",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36 Edg/137.0.0.0",
};

export async function POST(req: Request) {
  try {
    const { page, pageSize, key, type, order } = await req.json();
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      key: key ?? "",
      type: type ?? "",
      order: order ?? "",
    }).toString();

    const url = `https://mhe-jjsea.imowfms.com/api/battery/data/list?${params}`;
    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("External API error:", res.status, text);
      return NextResponse.json(
        { error: "External API error", status: res.status, text },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
