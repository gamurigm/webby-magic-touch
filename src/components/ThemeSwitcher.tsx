import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant={theme === "dark" ? "secondary" : "default"}
        size="icon"
        aria-label="Cambiar tema"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="transition-colors"
      >
        {theme === "dark" ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-900" />}
      </Button>
    </div>
  );
};
