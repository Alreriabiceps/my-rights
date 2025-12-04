"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/LanguageContext";
import { Building2, Phone, Globe, MapPin, Clock, ExternalLink } from "lucide-react";

function AgencyCard({ agency }) {
  const { t } = useLanguage();

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20 flex-shrink-0">
            <Building2 className="h-5 w-5 text-chart-2" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {agency.name}
            </h3>
            {agency.abbreviation && (
              <Badge variant="outline" className="mt-1 text-xs">
                {agency.abbreviation}
              </Badge>
            )}
          </div>
        </div>

        {agency.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agency.description}
          </p>
        )}

        <div className="space-y-2">
          {agency.address && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <span>{agency.address}</span>
            </div>
          )}
          {agency.phone && (
            <a
              href={`tel:${agency.phone}`}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{agency.phone}</span>
            </a>
          )}
          {agency.hotline && (
            <a
              href={`tel:${agency.hotline}`}
              className="flex items-center gap-2 text-xs"
            >
              <Phone className="h-3.5 w-3.5 flex-shrink-0 text-chart-2" />
              <span className="font-medium text-chart-2">{t("hotline")}: {agency.hotline}</span>
            </a>
          )}
          {agency.hours && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{agency.hours}</span>
            </div>
          )}
        </div>

        {agency.website && (
          <Button variant="outline" size="sm" asChild className="w-full mt-2">
            <a
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Globe className="h-3.5 w-3.5" />
              {t("visitWebsite")}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function GovernmentAgencies({ agencies }) {
  const { t } = useLanguage();

  if (!agencies || agencies.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("noAgencies")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-chart-2" />
          {t("governmentAgencies")}
        </h2>
        <Badge variant="outline">{agencies.length} {t("agencies")}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agencies.map((agency, index) => (
          <AgencyCard key={index} agency={agency} />
        ))}
      </div>
    </div>
  );
}
