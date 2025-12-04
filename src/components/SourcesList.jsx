"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  BookOpen, 
  Scale, 
  Globe, 
  Building2, 
  FileText, 
  ExternalLink,
  Link2,
  CheckCircle2
} from "lucide-react";

function SourceCard({ source }) {
  const { t } = useLanguage();

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "law":
      case "statute":
      case "code":
        return Scale;
      case "government":
      case "agency":
        return Building2;
      case "constitution":
        return BookOpen;
      case "website":
      case "online":
        return Globe;
      default:
        return FileText;
    }
  };

  const getTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "law":
      case "statute":
        return t("sourceTypeLaw");
      case "code":
        return t("sourceTypeCode");
      case "government":
      case "agency":
        return t("sourceTypeGovernment");
      case "constitution":
        return t("sourceTypeConstitution");
      case "jurisprudence":
      case "case":
        return t("sourceTypeCase");
      case "website":
        return t("sourceTypeWebsite");
      default:
        return type || t("sourceTypeReference");
    }
  };

  const Icon = getIcon(source.type);

  return (
    <div className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50 h-full flex flex-col">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 flex-shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-sm line-clamp-1">{source.title}</h4>
              {source.article && (
                <p className="text-xs text-muted-foreground line-clamp-1">{source.article}</p>
              )}
            </div>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {getTypeLabel(source.type)}
            </Badge>
          </div>

          {source.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {source.description}
            </p>
          )}

          {source.relevance && (
            <p className="text-xs text-muted-foreground italic line-clamp-1">
              {t("usedFor")}: {source.relevance}
            </p>
          )}

          {source.url && (
            <Button variant="link" size="sm" asChild className="h-auto p-0 text-primary mt-auto">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                {source.urlLabel || t("viewSource")}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SourcesList({ sources, analysis }) {
  const { t } = useLanguage();

  // Generate sources from analysis if not provided directly or if sources array is empty
  // The AI might return an empty sources array, so we always generate from relevantLaws
  const allSources = (sources && sources.length > 0) ? sources : generateSourcesFromAnalysis(analysis);

  // Group sources by type
  const groupedSources = allSources.reduce((acc, source) => {
    const type = source.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(source);
    return acc;
  }, {});

  const typeOrder = ["constitution", "law", "code", "jurisprudence", "government", "website", "other"];
  const sortedTypes = Object.keys(groupedSources).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  if (!allSources || allSources.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("noSources")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header - Compact */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5 text-primary" />
              {t("sourcesTitle")}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {allSources.length} {t("sources") || "sources"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-chart-2/10 border border-chart-2/20">
            <CheckCircle2 className="h-4 w-4 text-chart-2 flex-shrink-0" />
            <p className="text-xs text-chart-2">
              {t("sourcesVerified", { count: allSources.length })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sources by category - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedTypes.map((type) => (
          <Card key={type} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm capitalize font-semibold">
                  {getCategoryTitle(type, t)}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {groupedSources[type].length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {groupedSources[type].map((source, index) => (
                  <SourceCard key={index} source={source} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Disclaimer - Compact */}
      <Card className="bg-secondary/30 border-border/50">
        <CardContent className="py-3">
          <p className="text-xs text-muted-foreground text-center">
            {t("sourcesDisclaimer")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function getCategoryTitle(type, t) {
  switch (type) {
    case "constitution":
      return t("categoryConstitution");
    case "law":
    case "statute":
      return t("categoryLaws");
    case "code":
      return t("categoryCodes");
    case "jurisprudence":
    case "case":
      return t("categoryJurisprudence");
    case "government":
    case "agency":
      return t("categoryGovernment");
    case "website":
      return t("categoryWebsites");
    default:
      return t("categoryOther");
  }
}

function generateSourcesFromAnalysis(analysis) {
  if (!analysis) {
    // Even without analysis, return standard resources
    return getStandardLegalResources();
  }

  const sources = [];

  // Add sources from relevant laws (PRIMARY SOURCES)
  // The AI returns: { title, law, description, relevance }
  if (analysis.relevantLaws && Array.isArray(analysis.relevantLaws) && analysis.relevantLaws.length > 0) {
    analysis.relevantLaws.forEach((law) => {
      // Handle different property names from AI response
      const lawTitle = law.title || law.name || "";
      const lawCitation = law.law || law.article || law.citation || "";
      
      // Always add sources from relevant laws - they should always have at least a citation
      if (lawTitle || lawCitation) {
        const displayTitle = lawTitle || extractLawNameFromCitation(lawCitation) || "Legal Reference";
        
        sources.push({
          type: law.type || "law",
          title: displayTitle,
          article: lawCitation,
          description: law.description || `Relevant Philippine law for this case`,
          url: law.link || getLawUrl(displayTitle),
          relevance: law.relevance || law.description || "Directly applicable to this case",
        });
      }
    });
  }

  // Add government agencies as sources
  if (analysis.governmentAgencies && analysis.governmentAgencies.length > 0) {
    analysis.governmentAgencies.forEach((agency) => {
      if (agency && agency.name) {
        try {
          sources.push({
            type: "government",
            title: agency.name,
            description: agency.description || agency.purpose || "Government agency relevant to this case",
            url: agency.website || agency.contact,
            urlLabel: agency.website ? new URL(agency.website).hostname : undefined,
          });
        } catch (e) {
          // If URL parsing fails, add without urlLabel
          sources.push({
            type: "government",
            title: agency.name,
            description: agency.description || agency.purpose || "Government agency relevant to this case",
            url: agency.website || agency.contact,
          });
        }
      }
    });
  }

  // Add any additional sources from the analysis
  if (analysis.sources && analysis.sources.length > 0) {
    sources.push(...analysis.sources);
  }

  // Always add standard Philippine legal resources (even if no other sources)
  const standardResources = getStandardLegalResources();
  sources.push(...standardResources);

  return sources;
}

// Helper function to get standard legal resources
function getStandardLegalResources() {
  return [
    {
      type: "website",
      title: "LawPhil Project",
      description: "Philippine Laws and Jurisprudence Databank",
      url: "https://lawphil.net/",
      urlLabel: "lawphil.net",
      relevance: "Primary source for Philippine laws and Supreme Court decisions",
    },
    {
      type: "website",
      title: "Official Gazette of the Philippines",
      description: "Official publication of the Republic of the Philippines",
      url: "https://www.officialgazette.gov.ph/",
      urlLabel: "officialgazette.gov.ph",
      relevance: "Official source for laws, executive orders, and proclamations",
    },
  ];
}

// Helper function to extract law name from citation
function extractLawNameFromCitation(citation) {
  if (!citation) return "";
  
  // Common patterns in Philippine law citations
  const patterns = [
    /(Civil Code of the Philippines)/i,
    /(Family Code)/i,
    /(Labor Code)/i,
    /(Revised Penal Code)/i,
    /(Republic Act No\.?\s*\d+)/i,
    /(Presidential Decree No\.?\s*\d+)/i,
    /(Executive Order No\.?\s*\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = citation.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }
  
  // If no pattern matches, return first part of citation
  return citation.split(",")[0] || citation.split("Article")[0] || "";
}

function getLawUrl(lawName) {
  if (!lawName) return "https://lawphil.net/";
  
  // Map common Philippine laws to their URLs
  const lawUrls = {
    "Labor Code": "https://lawphil.net/statutes/presdecs/pd1974/pd_442_1974.html",
    "Civil Code": "https://lawphil.net/statutes/repacts/ra1949/ra_386_1949.html",
    "Civil Code of the Philippines": "https://lawphil.net/statutes/repacts/ra1949/ra_386_1949.html",
    "Family Code": "https://lawphil.net/statutes/execord/eo1987/eo_209_1987.html",
    "Revised Penal Code": "https://lawphil.net/statutes/acts/act_3815_1930.html",
    "Constitution": "https://lawphil.net/consti/cons1987.html",
    "1987 Constitution": "https://lawphil.net/consti/cons1987.html",
    "Consumer Act": "https://lawphil.net/statutes/repacts/ra1992/ra_7394_1992.html",
    "Data Privacy Act": "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    "Cybercrime Prevention Act": "https://lawphil.net/statutes/repacts/ra2012/ra_10175_2012.html",
    "Anti-Violence Against Women and Their Children Act": "https://lawphil.net/statutes/repacts/ra2004/ra_9262_2004.html",
    "Rent Control Act": "https://lawphil.net/statutes/repacts/ra2009/ra_9653_2009.html",
  };

  // Check if law name contains any known law
  for (const [key, url] of Object.entries(lawUrls)) {
    if (lawName.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }

  // Default to LawPhil search
  return `https://lawphil.net/search?q=${encodeURIComponent(lawName)}`;
}

