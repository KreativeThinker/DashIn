"use client";

import { useState, useMemo, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import * as d3 from "d3";
import { Button } from "../ui/button";
import API_BASE_URL from "@/config/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LineBar } from "./stacked-bar";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const colorScale = d3
  .scaleThreshold()
  .domain([0, 6, 10, 20, 30, 40, 50, 60])
  .range(["#030712", "#D926D9", "#4426D9", "#269DD9", "#26D980", "#62D926", "#D9BB26", "#D92626"]);

export default function MapView() {
  const [tooltip, setTooltip] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE_URL}/rankings/country`)
      .then((response) => response.json())
      .then((data) => setCountryData(data))
      .catch((error) => console.error("Failed to fetch countryData", error));
  }, []);

  const countryCounts = useMemo(() => {
    const counts = {};
    countryData.forEach(({ country, count }) => {
      counts[country] = count;
    });
    return counts;
  }, [countryData]);

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 4));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 1));

  const Legend = () => {
    const legendItems = [
      { value: 0, color: "#030712" },
      { value: 1, color: "#D926D9" },
      { value: 5, color: "#4426D9" },
      { value: 10, color: "#269DD9" },
      { value: 20, color: "#26D980" },
      { value: 30, color: "#62D926" },
      { value: 40, color: "#D9BB26" },
      { value: 50, color: "#D92626" },
    ];

    return (
      <div className="bg-accent absolute bottom-4 left-4 rounded-md p-3 shadow-md">
        <p className="text-accent-foreground mb-2 text-sm">Country Ranking Scale</p>
        <div className="hidden gap-2 lg:flex">
          {legendItems.map(({ value, color }) => (
            <div key={value} className="flex flex-col items-center">
              <div className="h-6 w-6 rounded" style={{ backgroundColor: color }}></div>
              <span className="text-accent-foreground text-xs">{value}+</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-4">
      <Card>
        {selected ? (
          <>
            <CardHeader>
              <CardTitle>{selected}</CardTitle>
            </CardHeader>
            <CardContent className="flex h-full flex-col justify-center gap-4 align-middle">
              <LineBar keyName="sector" country={selected} />
              <LineBar keyName="pestle" country={selected} />
              <LineBar keyName="topic" country={selected} />
              <LineBar keyName="end_year" country={selected} />
            </CardContent>
          </>
        ) : (
          <CardContent className="flex h-full flex-col justify-center gap-4 align-middle">
            <div className="text-secondary-foreground rounded border-4 border-dashed py-10 text-center">
              Select a country to view stats
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="relative col-span-3 aspect-video w-full p-0">
        <ComposableMap projection="geoMercator" style={{ width: "100%", height: "100%" }}>
          <ZoomableGroup zoom={zoom}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const country = geo.properties.name;
                  const count = countryCounts[country] || 0;
                  const fillColor = count ? colorScale(count) : "#030712";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#333"
                      strokeWidth={1}
                      onMouseEnter={() => setTooltip({ country, count })}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => setSelected(country)}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#FFA500", outline: "none" },
                        pressed: { fill: "#FF4500", outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {tooltip && (
          <div className="bg-accent text-accent-foreground pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded border px-2 py-1 text-sm">
            {tooltip.country}: {tooltip.count} insights
          </div>
        )}

        <div className="absolute right-4 bottom-4 flex gap-2">
          <Button onClick={zoomOut} variant="secondary" size="icon">
            -
          </Button>
          <Button onClick={zoomIn} variant="secondary" size="icon">
            +
          </Button>
        </div>
        <Legend />
      </Card>
    </div>
  );
}
