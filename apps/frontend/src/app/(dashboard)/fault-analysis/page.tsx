"use client";

import { DataTable } from "@/components/tables/forklift-and-battery-data-table";
import { forklifts } from "../forklifts-data";
import { batteryData } from "../battery-data";
import { WorldMap } from "@/components/world-map";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

import { markers } from "./markers";

export default function Page() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-0 py-4 md:gap-0 md:py-6 flex-1'>
        {/* Left: One long column (spans 2 columns on large screens) */}
        <div className='lg:col-span-2 flex flex-col h-full'>
          <DataTable
            forkliftData={forklifts}
            batteryData={batteryData}
            showTabsList={true}
          />
        </div>
        {/* Right: Two stacked rows */}
        <div className='flex flex-col lg:col-span-2 gap-4 h-full'>
          <div className='flex-1'>
            <h1 className='font-semibold text-muted-foreground mb-2'>
              Device Locations
            </h1>
            <WorldMap center={[10.3157, 123.9496]} zoom={3} markers={markers} />
          </div>
          <div className='flex-1 px-4 lg:pr-6 lg:pl-0'>
            <h1 className='font-semibold text-muted-foreground mb-2'>
              Battery Predictions
            </h1>
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}
