"use client";

import { Button } from "@/components/ui/button";

export function Header() {
  const sections = [
    { label: "Global", id: "global" },
    { label: "Insights", id: "insights" },
    { label: "Map View", id: "map" },
    // { label: "Country", id: "country" },
  ];

  return (
    <nav className="bg-background flex items-center justify-between border-b p-4">
      <h1 className="text-primary text-2xl font-bold">DashIn</h1>

      <div className="hidden gap-6 md:flex">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() =>
              document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-muted-foreground hover:text-primary transition-colors"
            variant="outline"
          >
            {section.label}
          </Button>
        ))}
      </div>

      {/* Command Bar */}
    </nav>
  );
}
