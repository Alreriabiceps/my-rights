"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/lib/LanguageContext";
import { Scale, ExternalLink, BookOpen, Copy, Check, Share2, Shield, CheckCircle2 } from "lucide-react";

function LawCard({ law, index }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Get the law citation/code - handle both API formats
  const lawCode = law.law || law.article || law.citation || "";
  const lawTitle = law.title || law.name || "Batas";

  const handleCopy = async () => {
    const textToCopy = `${lawTitle}\n${lawCode}\n\n${law.description || ""}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: lawTitle,
        text: `${lawCode}\n\n${law.description || ""}`,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <AccordionItem value={`law-${index}`} className="border rounded-lg bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/30 transition-colors duration-200">
        <div className="flex items-center gap-3 text-left flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 flex-shrink-0">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{lawTitle}</h3>
            {lawCode && (
              <p className="text-xs text-primary font-mono mt-0.5">{lawCode}</p>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="pt-2 space-y-4">
          {/* Description */}
          {law.description && (
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-sm leading-relaxed">{law.description}</p>
            </div>
          )}

          {/* Key Points */}
          {law.keyPoints && law.keyPoints.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-chart-2" />
                {t("keyPoints")}
              </h4>
              <ul className="space-y-2">
                {law.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-3.5 w-3.5" />
              {t("share") || "Share"}
            </Button>
            {law.link && (
              <a
                href={law.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline ml-auto"
              >
                {t("viewFullText")}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function LawList({ laws, rights }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Rights and Laws Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rights Section */}
        {rights && rights.length > 0 && (
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-chart-2" />
                {t("yourRights") || "Iyong mga Karapatan"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {rights.map((right, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                    <CheckCircle2 className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{right}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Laws Section */}
        {(!laws || laws.length === 0) ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Scale className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("noLawsFound")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                {t("relevantLaws") || "Mga Kaugnay na Batas"}
              </h2>
              <Badge variant="outline">{laws.length} {t("laws") || "batas"}</Badge>
            </div>

            <Accordion type="multiple" className="space-y-2">
              {laws.map((law, index) => (
                <div 
                  key={index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards", opacity: 0 }}
                >
                  <LawCard law={law} index={index} />
                </div>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}

export default LawCard;
