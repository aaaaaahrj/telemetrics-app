"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import {
  batterySchema,
  DataTable,
} from "@/components/tables/battery-data-table";

export default function Page() {
  const [batteryData, setBatteryData] = useState<
    z.infer<typeof batterySchema>[]
  >([]);

  useEffect(() => {
    fetch("/api/forklift-battery-data-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: 1,
        pageSize: 100,
        key: "",
        type: "",
        order: "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data); // <--- ADD THIS LINE
        const list = data.result?.data || [];
        console.log("Battery list:", list); // <--- AND THIS LINE
        setBatteryData(
          list
            .map((item: any) => {
              const mapped = {
                vin: item.vin,
                b_battery_no: item.battery_no,
                b_battery_type: item.battery_type,
                b_work_hour: item.work_hour,
                b_last_conn: item.last_conn,
                b_company: item.company,
                b_online: item.online,
                b_release_date: item.release_date,
              };
              try {
                return batterySchema.parse(mapped);
              } catch (e) {
                console.error("Zod error:", e, mapped); // <--- AND THIS LINE
                return null;
              }
            })
            .filter(Boolean)
        );
      });
  }, []);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2 pt-6'>
        <DataTable data={batteryData} />
      </div>
    </div>
  );
}
