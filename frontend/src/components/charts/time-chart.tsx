"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { DatePicker } from "../date-picker";
import API_BASE_URL from "@/config/api";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface TimeChartProps {
  endpoint?: string;
  key?: string;
  searchParams?: { key: string; value: string }[];
  availableKeys?: { value: string; label: string }[];
}

export default function TimeChart({
  key: defaultKey = "sector",
  searchParams = [],
  availableKeys = [
    { value: "sector", label: "Sector" },
    { value: "pestle", label: "PESTLE" },
    { value: "topic", label: "Topic" },
    { value: "region", label: "Region" },
    { value: "country", label: "Country" },
    { value: "intensity", label: "Intensity" },
    { value: "relevance", label: "Relevance" },
  ],
}: TimeChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const [keyName, setKeyName] = useState(defaultKey);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch initial date range
  const fetchDateRange = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/utils/date-range`);
      const result = await response.json();
      setStartDate(new Date(result.min_date));
      setEndDate(new Date(result.max_date));
    } catch (error) {
      console.error("Error fetching date range:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate.toISOString().split("T")[0]);
      if (endDate) params.append("end_date", endDate.toISOString().split("T")[0]);

      // Add all search parameters passed
      searchParams.forEach(({ key, value }) => {
        params.append(key, value);
      });

      // Use the current keyName in the endpoint
      const response = await fetch(`${API_BASE_URL}/insights/${keyName}?${params.toString()}`);
      const result = await response.json();

      // Group data by week
      const groupedData = result.reduce((acc: any[], { week, [keyName]: keyValue, count }: any) => {
        let entry = acc.find((item) => item.week === week);
        if (!entry) {
          entry = { week };
          acc.push(entry);
        }
        const valueKey = keyValue || "Uncategorized";
        entry[valueKey] = (entry[valueKey] || 0) + count;
        return acc;
      }, []);

      setData(groupedData);

      // Extract unique values for the key
      const uniqueValues = Array.from(
        new Set(groupedData.flatMap((item) => Object.keys(item).filter((key) => key !== "week")))
      );
      setSelectedValues(new Set(uniqueValues));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDateRange();
  }, []);

  useEffect(() => {
    fetchData();
  }, [keyName]); // Refetch when keyName changes

  // Compute unique values and colors
  const uniqueValues = useMemo(() => {
    return Array.from(
      new Set(data.flatMap((item) => Object.keys(item).filter((key) => key !== "week")))
    );
  }, [data]);

  const valueColors = useMemo(() => {
    const colors: Record<string, string> = {};
    uniqueValues.forEach((val, index) => {
      colors[val] = `hsl(${index * 19}, 70%, 50%)`;
    });
    return colors;
  }, [uniqueValues]);

  // Ensure all data points have all keys
  const completeData = useMemo(() => {
    return data.map((item) => {
      const newItem = { ...item };
      uniqueValues.forEach((val) => {
        if (newItem[val] === undefined) newItem[val] = 0;
      });
      return newItem;
    });
  }, [data, uniqueValues]);

  const toggleValue = (val: string) => {
    setSelectedValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(val)) {
        newSet.delete(val);
      } else {
        newSet.add(val);
      }
      return newSet;
    });
  };

  const toggleAllValues = () => {
    setSelectedValues((prev) => {
      if (prev.size < uniqueValues.length) {
        return new Set(uniqueValues);
      }
      return new Set();
    });
  };

  const handleKeyChange = (value: string) => {
    setKeyName(value);
  };

  const filteredValues = useMemo(() => {
    return uniqueValues.filter((val) => val.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [uniqueValues, searchTerm]);

  return (
    <div className="flex grid-cols-4 flex-col gap-8 lg:grid">
      <Card className="col-span-3">
        <CardContent className="max-h-[60vh]">
          <div className="mb-4 flex w-full flex-col items-center gap-4 md:flex-row">
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
              <Select value={keyName} onValueChange={handleKeyChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Group By</SelectLabel>
                    {availableKeys.map((key) => (
                      <SelectItem key={key.value} value={key.value}>
                        {key.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                placeholderText="Start Date"
              />
              <DatePicker selected={endDate} onChange={setEndDate} placeholderText="End Date" />
              <Button
                onClick={fetchData}
                disabled={loading}
                variant="secondary"
                className="w-full border sm:w-auto"
              >
                {loading ? "Loading..." : "Apply"}
              </Button>
            </div>
          </div>

          <ChartContainer config={{}} className="h-full w-full pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completeData}>
                <XAxis
                  dataKey="week"
                  label={{ value: "Week", position: "insideBottom", offset: -5 }}
                />
                <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                {Array.from(selectedValues).map((val) => (
                  <Line
                    key={val}
                    type="monotone"
                    dataKey={val}
                    stroke={valueColors[val]}
                    name={val}
                    dot={{ fill: valueColors[val] }}
                    connectNulls={true}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <div className="relative mt-2">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search filters..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex max-h-[60vh] w-full flex-col gap-2 overflow-scroll px-4 sm:flex-row sm:flex-wrap sm:justify-center">
          {filteredValues.map((val) => (
            <Button
              key={val}
              variant={selectedValues.has(val) ? "outline" : "secondary"}
              onClick={() => toggleValue(val)}
              className="text-xs sm:text-sm"
              style={{
                borderColor: valueColors[val],
                color: selectedValues.has(val) ? valueColors[val] : undefined,
              }}
            >
              {val}
            </Button>
          ))}
          <Button variant="destructive" onClick={toggleAllValues} className="w-full sm:w-auto">
            {selectedValues.size === uniqueValues.length ? "Remove All" : "Select All"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
