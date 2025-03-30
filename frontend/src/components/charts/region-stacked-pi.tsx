"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import API_BASE_URL from "@/config/api";

interface SectorData {
  name: string;
  value: number;
  fill: string;
}
interface PestleData {
  name: string;
  value: number;
  fill: string;
}
interface TopicData {
  name: string;
  value: number;
  fill: string;
}

export function SectorPestleTopicChart() {
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [pestleData, setPestleData] = useState<PestleData[]>([]);
  const [topicData, setTopicData] = useState<TopicData[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard/sector-pestle-topic`)
      .then((res) => res.json())
      .then((data) => {
        // Assume API returns { groupings, sector_counts, pestle_counts }
        const { groupings, sector_counts, pestle_counts } = data;
        setSectorData(processSectorData(sector_counts));
        setPestleData(processPestleData(pestle_counts));
        setTopicData(processTopicData(groupings));
      })
      .catch((err) => console.error("Failed to fetch data", err));
  }, []);

  function processSectorData(sectorCounts: any[]): SectorData[] {
    return sectorCounts.map((item) => ({
      name: item.sector || "Uncategorized",
      value: item.count,
      fill: getColor(item.sector || "Uncategorized"),
    }));
  }

  function processPestleData(pestleCounts: any[]): PestleData[] {
    return pestleCounts.map((item) => ({
      name: `${item.sector || "Uncategorized"} > ${item.pestle || "Uncategorized"}`,
      value: item.count,
      fill: getColor(item.pestle || "Uncategorized"),
    }));
  }

  function processTopicData(groupings: any[]): TopicData[] {
    // For each (sector, pestle) group, aggregate topics with count < 5 as "Minors"
    const grouped: Record<string, { topics: TopicData[]; minors: number }> = {};

    groupings.forEach(({ sector, pestle, topic, count }) => {
      const s = sector || "Uncategorized";
      const p = pestle || "Uncategorized";
      const t = topic || "Uncategorized";
      const key = `${s} > ${p}`;
      if (!grouped[key]) grouped[key] = { topics: [], minors: 0 };
      if (count < 20) {
        grouped[key].minors += count;
      } else {
        grouped[key].topics.push({
          name: t,
          value: count,
          fill: getColor(t),
        });
      }
    });

    // Flatten grouped data: each (sector, pestle) produces a "Minors" entry (if any)
    const output: TopicData[] = [];
    Object.entries(grouped).forEach(([key, { topics, minors }]) => {
      if (minors > 0) {
        output.push({
          name: `${key} > Minors`,
          value: minors,
          fill: getColor("Minors"),
        });
      }
      output.push(...topics);
    });
    return output;
  }

  const colorCache = new Map<string, string>(); // Cache to store colors for labels
  let index = 0;

  function getColor(label: string): string {
    const hue = (index * 60) % 360; // Increment hue by 30 degrees each time
    const color = `hsl(${hue}, 70%, 50%)`;
    colorCache.set(label, color);
    index++; // Move to the next hue
    return colorCache.get(label)!;
  }

  return (
    <Card className="col-span-2 row-span-2 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sector-Pestle-Topic Breakdown</CardTitle>
        <CardDescription>Categorized data visualization</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={{}} className="mx-auto aspect-square">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent labelKey="value" nameKey="name" indicator="line" />}
            />
            {/* Outer ring: Sectors */}
            <Pie data={sectorData} dataKey="value" outerRadius={100} fillOpacity={1} label />
            {/* Middle ring: Pestles */}
            <Pie
              data={pestleData}
              dataKey="value"
              innerRadius={110}
              outerRadius={150}
              fillOpacity={1}
              label
            />
            {/* Inner ring: Topics (or minors) */}
            <Pie
              data={topicData}
              dataKey="value"
              innerRadius={160}
              outerRadius={200}
              fillOpacity={1}
              label
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          <TrendingUp className="h-4 w-4" /> Data breakdown from API
        </div>
      </CardFooter>
    </Card>
  );
}
