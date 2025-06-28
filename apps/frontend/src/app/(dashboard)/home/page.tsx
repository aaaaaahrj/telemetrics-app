"use client";

import { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import CardDashboard from "@/components/card/card-dashboard";
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

  const [cardData, setCardData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard-cards")
      .then((res) => res.json())
      .then((data) => {
        console.log("dashboard-cards data:", data); // <-- Add this line
        setCardData([
          {
            title: "Total Forklifts",
            subtitle: "Number of forklifts currently in operation",
            current: data.forklift?.online ?? 0,
            total: data.forklift?.total ?? 0,
            segments: [
              {
                label: "Online",
                value: data.forklift?.online ?? 0,
                color: "#4ade80",
              },
              {
                label: "Offline",
                value: data.forklift?.offline ?? 0,
                color: "#f87171",
              },
            ],
          },
          {
            title: "Total Battery",
            subtitle: "Current battery status of forklifts",
            current: data.battery?.online ?? 0,
            total: data.battery?.total ?? 0,
            segments: [
              {
                label: "Online",
                value: data.battery?.online ?? 0,
                color: "#4ade80",
              },
              {
                label: "Offline",
                value: data.battery?.offline ?? 0,
                color: "#f87171",
              },
              {
                label: "Working",
                value: data.battery?.work ?? 0,
                color: "#fbbf24",
              },
              {
                label: "Charging",
                value: data.battery?.charge ?? 0,
                color: "#fde047",
              },
              {
                label: "Idle",
                value: data.battery?.idle ?? 0,
                color: "#B2BEB5",
              },
              {
                label: "Error",
                value: data.battery?.error ?? 0,
                color: "#f87171",
              },
            ],
          },
        ]);
      });
  }, []);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <CardDashboard data={cardData} />
          <div className='px-4 lg:px-6'>
            <ChartAreaInteractive />
          </div>
          <DataTable data={forkliftData} />
        </div>
      </div>
    </div>
  );
}
