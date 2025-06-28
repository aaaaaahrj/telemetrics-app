import { NextResponse } from "next/server";

const headers = {
  Cookie:
    "language=en; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjU2OTI0MTUsImlhdCI6MTc1MDE0MDQxNSwidWlkIjoiODZjOWU2NWRiMmE3NDllZmJhODM1OTU1ZGU1ZTQ2Y2MifQ.u6DlErQIXDUZ8-hHqiQzSvET61QJwKtG-91nAgcwmE8; uid=86c9e65db2a749efba835955de5e46cc; acw_tc=a3b5e99e17501721799371427e97c1d4cc5e617672f513bfdaf42dbfc5; cdn_sec_tc=a3b5e99e17501721799371427e97c1d4cc5e617672f513bfdaf42dbfc5",
  Accept: "application/json, text/plain, */*",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36 Edg/137.0.0.0",
};

export async function GET() {
  const [forkliftRes, batteryRes] = await Promise.all([
    fetch("https://mhe-jjsea.imowfms.com/api/realtime/forklift/count", {
      headers,
    }),
    fetch("https://mhe-jjsea.imowfms.com/api/realtime/battery/count", {
      headers,
    }),
  ]);

  if (!forkliftRes.ok || !batteryRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  const forkliftJson = await forkliftRes.json();
  const batteryJson = await batteryRes.json();

  const forklift = forkliftJson.result;
  const battery = batteryJson.result;

  return NextResponse.json({
    forklift: {
      total: forklift.forklift,
      online: forklift.forklift_online,
      offline: forklift.forklift_offline,
      idle: forklift.forklift_idle,
      error: forklift.forklift_error,
      dangerous: forklift.forklift_dangerous,
    },
    battery: {
      total: battery.battery,
      online: battery.battery_online,
      offline: battery.battery_offline,
      error: battery.battery_error,
      idle: battery.battery_idle,
      charge: battery.battery_charge,
      work: battery.battery_work,
    },
  });
}
