"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [chartData, setChartData] = React.useState<
    { date: string; forklift: number; battery: number }[]
  >([]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Fetch the API data
  React.useEffect(() => {
    fetch("/api/weekonline")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.result)) {
          setChartData(
            data.result.map((item: any) => ({
              date: item.day,
              forklift: item.forklift_count,
              battery: item.battery_count,
            }))
          );
        }
      });
  }, []);

  // Filtering logic remains the same, but use the new keys
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(); // Use today as reference
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Update chartConfig for new keys
  const chartConfig = {
    forklift: {
      label: "Forklift Online",
      color: "#fbbf24",
    },
    battery: {
      label: "Battery Online",
      color: "#fbbf24",
    },
  };

  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <CardTitle>Daily Online Devices</CardTitle>
        <CardDescription>
          <span className='@[540px]/card:block hidden'>
            For the last 3 months
          </span>
          <span className='@[540px]/card:hidden'>Last 3 months</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--main-orange)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--main-orange)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--main-orange)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--main-orange)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='forklift'
              type='natural'
              fill='url(#fillDesktop)'
              stroke='var(--main-orange)'
              stackId='a'
            />
            <Area
              dataKey='battery'
              type='natural'
              fill='url(#fillMobile)'
              stroke='var(--main-orange)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
