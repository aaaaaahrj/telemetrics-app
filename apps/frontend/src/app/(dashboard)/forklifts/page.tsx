"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  forkliftSchema,
  DataTable,
} from "@/components/tables/forklifts-data-table";

export default function Page() {
  const [forkliftData, setForkliftData] = useState<
    z.infer<typeof forkliftSchema>[]
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
        const list = data.result?.data || [];
        setForkliftData(
          list
            .map((item: any) => {
              const mapped = {
                vin: item.vin,
                crd_no: item.crd_no,
                truck_no: item.truck_no,
                truck_type: item.truck_type,
                company: item.company,
                work_hour: item.work_hour,
                first_conn: item.first_conn,
                last_conn: item.last_conn,
              };
              try {
                return forkliftSchema.parse(mapped);
              } catch (e) {
                console.error("Zod error:", e, mapped);
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
        <DataTable data={forkliftData} />
      </div>
    </div>
  );
}
