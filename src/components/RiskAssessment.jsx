"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/LanguageContext";
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function RiskAssessment({ riskAssessment }) {
  const { t } = useLanguage();

  if (!riskAssessment) {
    return null;
  }

  const { actionRisks, inactionRisks, recommendations } = riskAssessment;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          {t("riskAssessment")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action Risks */}
          {actionRisks && actionRisks.length > 0 && (
            <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-chart-3" />
                <h4 className="font-semibold text-sm">{t("actionRisks")}</h4>
              </div>
              <ul className="space-y-2">
                {actionRisks.map((risk, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inaction Risks */}
          {inactionRisks && inactionRisks.length > 0 && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <h4 className="font-semibold text-sm">{t("inactionRisks")}</h4>
              </div>
              <ul className="space-y-2">
                {inactionRisks.map((risk, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-chart-2" />
              <h4 className="font-semibold text-sm">{t("recommendations")}</h4>
            </div>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-chart-2 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
