"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/LanguageContext";
import { FileText, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

export default function CaseSummary({ caseType, severity, timeline }) {
  const { t } = useLanguage();

  const getSeverityConfig = (severity) => {
    // Handle both string and object formats
    const severityRating = typeof severity === "string" 
      ? severity 
      : severity?.rating;
    
    switch (severityRating?.toLowerCase()) {
      case "high":
      case "critical":
        return {
          variant: "destructive",
          label: t("severityHigh"),
        };
      case "medium":
        return {
          variant: "default",
          label: t("severityMedium"),
        };
      case "low":
        return {
          variant: "secondary",
          label: t("severityLow"),
        };
      default:
        return {
          variant: "outline",
          label: severityRating || t("severityUnknown"),
        };
    }
  };

  const severityConfig = getSeverityConfig(severity);

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            {t("caseSummary")}
          </CardTitle>
          <Badge variant={severityConfig.variant} className="w-fit animate-bounce-in" style={{ animationDelay: "200ms" }}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {severityConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Case Type and Key Info Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Case Type */}
          <div className="animate-fade-in-up p-3 rounded-lg bg-secondary/30 border border-border/50" style={{ animationDelay: "100ms", animationFillMode: "forwards", opacity: 0 }}>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              {t("caseType")}
            </h4>
            <p className="text-base font-semibold">{caseType || t("notSpecified")}</p>
          </div>

          {/* Severity */}
          <div className="animate-fade-in-up p-3 rounded-lg bg-secondary/30 border border-border/50" style={{ animationDelay: "150ms", animationFillMode: "forwards", opacity: 0 }}>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              {t("severity") || "Severity"}
            </h4>
            <Badge variant={severityConfig.variant} className="text-xs">
              {severityConfig.label}
            </Badge>
          </div>

          {/* Timeline Count */}
          {timeline && timeline.length > 0 && (
            <div className="animate-fade-in-up p-3 rounded-lg bg-secondary/30 border border-border/50" style={{ animationDelay: "200ms", animationFillMode: "forwards", opacity: 0 }}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {t("timelineTitle")}
              </h4>
              <p className="text-base font-semibold">{timeline.length} {t("phases") || "phases"}</p>
            </div>
          )}
        </div>

        {/* Timeline - Compact Grid Layout */}
        {timeline && timeline.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "forwards", opacity: 0 }}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t("timelineTitle")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timeline.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors animate-slide-in-left"
                  style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: "forwards", opacity: 0 }}
                >
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index === 0
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                          : "bg-secondary text-muted-foreground border-2 border-border"
                      }`}
                    >
                      {index === 0 ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-6 bg-gradient-to-b from-primary/50 to-border mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h5 className="font-medium text-sm">{item.phase}</h5>
                      {item.duration && (
                        <Badge variant="outline" className="text-xs">
                          {item.duration}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
