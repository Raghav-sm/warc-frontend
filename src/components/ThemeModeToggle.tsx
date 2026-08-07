import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme === "dark" ? "dark" : "light";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Select Mode:</span>
      {mounted ? (
        <Tabs
          value={activeTheme}
          onValueChange={(value) => {
            if (value === "light" || value === "dark") setTheme(value);
          }}
          className="gap-0"
        >
          <TabsList className="h-8 w-auto">
            <TabsTrigger value="light" className="px-2.5 text-xs">
              Light
            </TabsTrigger>
            <TabsTrigger value="dark" className="px-2.5 text-xs">
              Dark
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        <div aria-hidden className="h-8 w-[7.25rem] rounded-lg bg-muted" />
      )}
    </div>
  );
}
