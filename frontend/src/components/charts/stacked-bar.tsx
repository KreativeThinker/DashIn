"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import API_BASE_URL from "@/config/api";

interface LineBarProps {
  keyName: string;
  country: string;
}

export function LineBar({ keyName, country }: LineBarProps) {
  const [data, setData] = useState<{ [key: string]: any; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!keyName || !country) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/rankings/${keyName}?country=${country}&limit=5`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [keyName, country]);

  // Get the max count to calculate relative widths
  const maxCount = Math.max(...data.map((item) => item.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{keyName} Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {/* Bar Chart */}
        <div className="flex gap-0.5">
          <TooltipProvider>
            {data.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className="h-1 cursor-pointer rounded"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      backgroundColor: `hsl(${index * 50}, 80%, 50%)`, // Generates different colors
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {item[keyName]}: {item.count}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: `hsl(${index * 50}, 80%, 50%)` }}
              />
              {item[keyName]}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
