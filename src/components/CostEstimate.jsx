"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/LanguageContext";
import { Coins, Info, TrendingDown, Calculator, Copy, Check, Banknote, Receipt, FileText } from "lucide-react";

export default function CostEstimate({ costs }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!costs) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("noCostEstimate") || "No cost estimate available"}</p>
        </CardContent>
      </Card>
    );
  }

  // Helper to display cost - handles both string and number formats
  const displayCost = (value) => {
    if (!value && value !== 0) return "—";
    if (typeof value === "string") return value; // Already formatted string like "₱2,000 - ₱5,000"
    if (typeof value === "object" && value.min !== undefined) {
      return `₱${value.min.toLocaleString()} - ₱${value.max.toLocaleString()}`;
    }
    return `₱${Number(value).toLocaleString()}`;
  };

  // Build cost items from the API response format
  const costItems = [];
  
  if (costs.consultationFee) {
    costItems.push({
      label: t("consultationFee") || "Consultation Fee",
      value: costs.consultationFee,
      icon: Receipt,
    });
  }
  if (costs.filingFees) {
    costItems.push({
      label: t("filingFees") || "Filing Fees",
      value: costs.filingFees,
      icon: FileText,
    });
  }
  if (costs.additionalCosts) {
    costItems.push({
      label: t("additionalCosts") || "Additional Costs",
      value: costs.additionalCosts,
      icon: Coins,
    });
  }

  // Also handle breakdown array if present
  if (costs.breakdown && costs.breakdown.length > 0) {
    costs.breakdown.forEach(item => {
      costItems.push({
        label: item.description || item.label,
        value: item.amount || item.value,
        note: item.note,
        icon: Coins,
      });
    });
  }

  const handleCopySummary = async () => {
    const summary = `Cost Estimate:\n${costItems.map(item => `${item.label}: ${displayCost(item.value)}`).join('\n')}\n\nTotal: ${displayCost(costs.totalEstimated || costs.total)}\n\n${costs.paymentPlan ? `Payment Options: ${costs.paymentPlan}` : ''}`;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-chart-3" />
            {t("estimatedCosts") || "Estimated Costs"}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-chart-2" />
                {t("copied") || "Copied!"}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                {t("copy") || "Copy"}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cost Breakdown - Side by Side Grid */}
        {costItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {costItems.map((item, index) => {
              const Icon = item.icon || Coins;
              return (
                <div
                  key={index}
                  className="flex flex-col p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/20 flex-shrink-0">
                      <Icon className="h-4 w-4 text-chart-3" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground truncate">{item.label}</p>
                  </div>
                  <span className="text-lg font-bold text-chart-3">
                    {displayCost(item.value)}
                  </span>
                  {item.note && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-secondary/30 text-center">
            <p className="text-muted-foreground text-sm">
              {t("contactLawyerForQuote") || "Contact a lawyer for a detailed quote"}
            </p>
          </div>
        )}

        {/* Total and Payment Plan Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Total */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-chart-3/20 to-chart-2/20 border border-chart-3/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/30">
                <Banknote className="h-5 w-5 text-chart-3" />
              </div>
              <span className="font-semibold text-sm">{t("estimatedTotal") || "Estimated Total"}</span>
            </div>
            <span className="text-xl font-bold text-chart-3">
              {displayCost(costs.totalEstimated || costs.total)}
            </span>
          </div>

          {/* Payment Plan */}
          {costs.paymentPlan && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
              <Info className="h-5 w-5 text-chart-2 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-chart-2">{t("paymentOptions") || "Payment Options"}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{costs.paymentPlan}</p>
              </div>
            </div>
          )}
        </div>

        {/* Cost Notes and Free Options Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cost Notes */}
          {costs.notes && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">{costs.notes}</p>
            </div>
          )}

          {/* Free Legal Aid Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold flex items-center gap-2">
              <TrendingDown className="h-3.5 w-3.5 text-chart-2" />
              {t("freeOptions") || "Free Legal Aid Options"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(costs.freeOptions || [
                "Public Attorney's Office (PAO)",
                "Integrated Bar of the Philippines (IBP) Legal Aid",
                "Law School Legal Aid Clinics",
                "Barangay Justice System"
              ]).map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-chart-2/10 border border-chart-2/20 hover:bg-chart-2/20 transition-colors cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-2 flex-shrink-0" />
                  <span className="text-xs">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
