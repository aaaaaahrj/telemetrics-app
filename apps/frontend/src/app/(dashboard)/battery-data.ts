// battery-data.ts
export interface BatteryData {
  id: string;
  info: string;
  device_status: string;
  battery_type: string;
  total_work_hour: number;
  last_on: Date;
  release_date: Date;
}

export const batteryData: BatteryData[] = [
  {
    id: "b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6",
    info: "Battery A - 48V 500Ah",
    device_status: "Active",
    battery_type: "Lithium-Ion",
    total_work_hour: 1200,
    last_on: new Date("2025-06-20T08:30:00.000Z"),
    release_date: new Date("2024-01-15T00:00:00.000Z"),
  },
  {
    id: "b7e8f9a0-b1c2-d3e4-f5a6-b7c8d9e0f1a2",
    info: "Battery B - 36V 400Ah",
    device_status: "Inactive",
    battery_type: "Lead-Acid",
    total_work_hour: 800,
    last_on: new Date("2025-06-18T14:45:30.000Z"),
    release_date: new Date("2023-12-10T00:00:00.000Z"),
  },
  {
    id: "b3f4e5d6-c7b8-a9c0-d1e2-f3a4b5c6d7e8",
    info: "Battery C - 24V 300Ah",
    device_status: "Faulty",
    battery_type: "AGM",
    total_work_hour: 500,
    last_on: new Date("2025-06-15T09:15:45.000Z"),
    release_date: new Date("2023-10-05T00:00:00.000Z"),
  },
  {
    id: "b9a0b1c2-d3e4-f5a6-b7c8-d9e0f1a2b3c4",
    info: "Battery D - 80V 600Ah",
    device_status: "Active",
    battery_type: "Lithium-Ion",
    total_work_hour: 1500,
    last_on: new Date("2025-06-25T11:00:00.000Z"),
    release_date: new Date("2024-03-22T00:00:00.000Z"),
  },
  {
    id: "b6d5c4b3-a2f1-e0d9-c8b7-a46e5d4c3b2a",
    info: "Battery E - 48V 700Ah",
    device_status: "Active",
    battery_type: "Lithium-Ion",
    total_work_hour: 2000,
    last_on: new Date("2025-06-26T16:20:00.000Z"),
    release_date: new Date("2024-05-01T00:00:00.000Z"),
  },
];
