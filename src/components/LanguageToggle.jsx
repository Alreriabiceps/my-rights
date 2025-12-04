"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
      <Button
        variant={currentLanguage === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="h-8 px-3 text-xs font-medium"
      >
        EN
      </Button>
      <Button
        variant={currentLanguage === "tl" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("tl")}
        className="h-8 px-3 text-xs font-medium"
      >
        TL
      </Button>
    </div>
  );
}
