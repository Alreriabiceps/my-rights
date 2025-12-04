"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  FileText, 
  Camera, 
  MessageSquare, 
  FileImage,
  Video,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function EvidenceGuide({ evidenceGuide }) {
  const { t } = useLanguage();

  if (!evidenceGuide || evidenceGuide.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("noEvidenceGuide")}</p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "document":
      case "documents":
        return FileText;
      case "photo":
      case "photos":
      case "image":
      case "images":
        return Camera;
      case "video":
      case "videos":
        return Video;
      case "message":
      case "messages":
      case "communication":
        return MessageSquare;
      default:
        return FileImage;
    }
  };

  const getImportanceConfig = (importance) => {
    switch (importance?.toLowerCase()) {
      case "critical":
      case "required":
        return { variant: "destructive", label: t("importanceCritical") };
      case "high":
      case "important":
        return { variant: "default", label: t("importanceHigh") };
      case "medium":
      case "recommended":
        return { variant: "secondary", label: t("importanceMedium") };
      default:
        return { variant: "outline", label: t("importanceOptional") };
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-chart-1" />
          {t("evidenceGuide")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {evidenceGuide.map((item, index) => {
            const Icon = getIcon(item.type);
            const importanceConfig = getImportanceConfig(item.importance);

            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-secondary/30 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20 flex-shrink-0">
                      <Icon className="h-5 w-5 text-chart-1" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.type}</h4>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={importanceConfig.variant} className="flex-shrink-0">
                    {importanceConfig.label}
                  </Badge>
                </div>

                {/* Examples */}
                {item.examples && item.examples.length > 0 && (
                  <div className="pl-13 space-y-2">
                    <h5 className="text-xs text-muted-foreground font-medium">
                      {t("examples")}:
                    </h5>
                    <ul className="space-y-1.5">
                      {item.examples.map((example, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-chart-2 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                {item.tips && (
                  <div className="flex items-start gap-2 p-2 rounded bg-primary/10">
                    <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-primary">{item.tips}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
