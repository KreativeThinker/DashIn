"use client";

import * as React from "react";
import { Label, Legend, Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/config/api";

export function CustomPieChart({
  endpoint = "",
  keyName = "",
  limit = null,
  centerText = "Insights",
}) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/${endpoint}`)
      .then((response) => response.json())
      .then((data) => {
        // Map items to ensure a valid category name
        const formattedData = data
          .filter((item) => item[keyName]) // Remove null/undefined values
          .map((item) => ({
            ...item,
            category: item[keyName],
          }));

        // Calculate total insights from the formatted data
        const totalInsights = formattedData.reduce((acc, curr) => acc + curr.count, 0);

        // If no limit is provided, just add the "Others" category if needed
        if (!limit) {
          const otherCount = Math.max(1000 - totalInsights, 0);
          const updatedData =
            otherCount > 0
              ? [...formattedData, { category: "Others", count: otherCount }]
              : formattedData;
          setChartData(updatedData);
        } else {
          // If limit is provided, take top (limit - 1) items and group the rest into "Others"
          const topItems = formattedData.slice(0, limit);
          const remainingItems = formattedData.slice(limit);
          const remainingCount = remainingItems.reduce((acc, curr) => acc + curr.count, 0);

          let finalData;
          if (remainingCount > 0) {
            // Take top (limit - 1) items and then add the Others entry to make up the limit
            finalData = [
              ...formattedData.slice(0, limit),
              { category: "Others", count: remainingCount },
            ];
          } else {
            finalData = topItems;
          }
          setChartData(finalData);
        }
      })
      .catch((error) => console.error("Failed to fetch data", error));
  }, [endpoint, limit]);

  // Generate a unique color for each category
  const categoryColors = React.useMemo(() => {
    const uniqueCategories = [...new Set(chartData.map((item) => item.category))];
    return uniqueCategories.reduce((acc, category, index) => {
      acc[category] = `hsl(${index * 50}, 70%, 50%)`; // Unique color per category
      return acc;
    }, {});
  }, [chartData]);

  // Compute total insights
  const totalInsights = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <ChartContainer config={{}} className="mx-auto flex h-full items-center">
      <PieChart width={400} height={250}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={chartData} dataKey="count" nameKey="category" innerRadius={60} strokeWidth={5}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || "#8884d8"} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalInsights.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {centerText}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <Legend layout="radial" verticalAlign="middle" />
      </PieChart>
    </ChartContainer>
  );
}
