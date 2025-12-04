"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CaseSummary from "./CaseSummary";
import { LawList } from "./LawCard";
import { LawyerList } from "./LawyerCard";
import CostEstimate from "./CostEstimate";
import GovernmentAgencies from "./GovernmentAgencies";
import EvidenceGuide from "./EvidenceGuide";
import RiskAssessment from "./RiskAssessment";
import SourcesList from "./SourcesList";
import ReportsGenerator from "./ReportsGenerator";
import AIChatAssistant from "./AIChatAssistant";
import { AnimatedItem } from "./AnimatedContainer";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  RefreshCw, 
  ClipboardList, 
  Scale, 
  Users, 
  Coins, 
  FileText,
  Shield,
  CheckCircle2,
  ListChecks,
  File,
  FileSignature,
  BookOpen,
  MessageCircle
} from "lucide-react";

// Dummy lawyers data with coordinates for map display
const DUMMY_LAWYERS = [
  {
    id: "lawyer-001",
    name: "Atty. Maria Santos-Cruz",
    specialization: "Family Law, Civil Law",
    location: "Makati City",
    officeAddress: "Unit 1205, Makati Corporate Center, Ayala Avenue",
    contact: "+63 917 123 4567",
    email: "maria.santos@lawfirm.ph",
    startingPrice: "₱3,000",
    rating: 4.8,
    experience: "15 years",
    latitude: 14.5547,
    longitude: 121.0244
  },
  {
    id: "lawyer-002",
    name: "Atty. Jose Reyes Jr.",
    specialization: "Criminal Law, Litigation",
    location: "Quezon City",
    officeAddress: "Room 301, QC Legal Center, EDSA corner Timog Ave.",
    contact: "+63 918 234 5678",
    email: "jose.reyes@criminaldefense.ph",
    startingPrice: "₱5,000",
    rating: 4.9,
    experience: "20 years",
    latitude: 14.6282,
    longitude: 121.0347
  },
  {
    id: "lawyer-003",
    name: "Atty. Ana Gabriela Mendoza",
    specialization: "Labor Law, Employment",
    location: "Pasig City",
    officeAddress: "18F Ortigas Tower, Ortigas Center",
    contact: "+63 919 345 6789",
    email: "ana.mendoza@laborlaw.ph",
    startingPrice: "₱2,500",
    rating: 4.7,
    experience: "12 years",
    latitude: 14.5876,
    longitude: 121.0615
  },
  {
    id: "lawyer-004",
    name: "Atty. Ricardo Tan",
    specialization: "Property Law, Real Estate",
    location: "Manila",
    officeAddress: "Suite 502, Pacific Star Building, Makati Avenue",
    contact: "+63 920 456 7890",
    email: "ricardo.tan@propertylaw.ph",
    startingPrice: "₱4,000",
    rating: 4.6,
    experience: "18 years",
    latitude: 14.5995,
    longitude: 120.9842
  },
  {
    id: "lawyer-005",
    name: "Atty. Carmen Villanueva",
    specialization: "Civil Law, Contracts",
    location: "Taguig City",
    officeAddress: "Unit 2301, One Global Place, BGC",
    contact: "+63 921 567 8901",
    email: "carmen.villanueva@civillaw.ph",
    startingPrice: "₱3,500",
    rating: 4.8,
    experience: "14 years",
    latitude: 14.5514,
    longitude: 121.0503
  }
];

// Dynamically import the map component to avoid SSR issues with Leaflet
const LawyersMap = dynamic(() => import("./LawyersMap"), {
  ssr: false,
  loading: () => (
    <Card className="h-80 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </Card>
  ),
});

export default function ResultsView({ analysis, onReset }) {
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const { t } = useLanguage();

  const toggleStep = (index) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Ensure we have lawyers with coordinates for the map
  const lawyersWithCoordinates = useMemo(() => {
    const analysisLawyers = analysis?.lawyers || [];
    const hasValidCoords = analysisLawyers.some(l => l.latitude && l.longitude);
    
    if (hasValidCoords && analysisLawyers.length > 0) {
      return analysisLawyers;
    }
    
    // Merge analysis lawyers with dummy data coordinates, or use dummy data
    if (analysisLawyers.length > 0) {
      return analysisLawyers.map((lawyer, index) => ({
        ...lawyer,
        latitude: lawyer.latitude || DUMMY_LAWYERS[index % DUMMY_LAWYERS.length]?.latitude,
        longitude: lawyer.longitude || DUMMY_LAWYERS[index % DUMMY_LAWYERS.length]?.longitude,
      }));
    }
    
    return DUMMY_LAWYERS;
  }, [analysis?.lawyers]);

  if (!analysis) return null;

  const handleViewOnMap = (lawyer) => {
    setSelectedLawyer(lawyer);
    setActiveTab("lawyers");
    document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-down">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {t("resultsTitle")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("resultsSubtitle")}
          </p>
        </div>
        <Button variant="outline" onClick={onReset} className="gap-2 btn-press glow-hover">
          <RefreshCw className="h-4 w-4" />
          {t("newAnalysis")}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <ScrollArea className="w-full">
          <TabsList className="w-full justify-start h-auto p-1.5 bg-secondary/50 backdrop-blur-sm rounded-xl">
            <TabsTrigger value="summary" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 btn-press">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabSummary")}</span>
            </TabsTrigger>
            <TabsTrigger value="laws" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 btn-press">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabLaws")}</span>
            </TabsTrigger>
            <TabsTrigger value="lawyers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 btn-press">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabLawyers")}</span>
            </TabsTrigger>
            <TabsTrigger value="costs" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 btn-press">
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabCosts")}</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 btn-press">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabGuide")}</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 btn-press">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabSources")}</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-chart-2 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-chart-2/25 btn-press">
              <FileSignature className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabReports") || "Reports"}</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 btn-press">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabChat") || "AI Chat"}</span>
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6 mt-6" key="summary-tab">
          <AnimatedItem animation="fade-in-up" delay={0}>
            <CaseSummary
              caseType={analysis.caseType}
              severity={analysis.severity}
              timeline={analysis.timeline}
            />
          </AnimatedItem>

          {/* Rights and Laws Side by Side */}
          {(analysis.rights && analysis.rights.length > 0) || (analysis.relevantLaws && analysis.relevantLaws.length > 0) ? (
            <AnimatedItem animation="fade-in-up" delay={100}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rights Section */}
                {analysis.rights && analysis.rights.length > 0 && (
                  <Card className="card-hover h-fit">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-primary" />
                        {t("yourRights")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.rights.map((right, index) => (
                          <li 
                            key={index} 
                            className="flex items-start gap-3 animate-fade-in-up"
                            style={{ animationDelay: `${150 + index * 50}ms`, animationFillMode: "forwards", opacity: 0 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{right}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Laws Section */}
                {analysis.relevantLaws && analysis.relevantLaws.length > 0 && (
                  <Card className="card-hover">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Scale className="h-5 w-5 text-primary" />
                        {t("relevantLaws")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.relevantLaws.slice(0, 3).map((law, index) => (
                          <div 
                            key={index}
                            className="p-3 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 flex-shrink-0">
                                <Scale className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1">{law.title || law.name}</h4>
                                {law.law || law.article ? (
                                  <p className="text-xs text-primary font-mono mb-2">{law.law || law.article}</p>
                                ) : null}
                                {law.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">{law.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {analysis.relevantLaws.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center pt-2">
                            {analysis.relevantLaws.length - 3} more {t("laws") || "laws"} available in Laws tab
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </AnimatedItem>
          ) : null}

          {/* Next Steps - Interactive Checklist */}
          {analysis.nextSteps && analysis.nextSteps.length > 0 && (
            <AnimatedItem animation="fade-in-up" delay={200}>
            <Card className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ListChecks className="h-5 w-5 text-chart-3" />
                    {t("nextSteps") || "Next Steps"}
                  </CardTitle>
                  <Badge variant="outline">
                    {completedSteps.size}/{analysis.nextSteps.length} {t("completed") || "completed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.nextSteps.map((step, index) => {
                    const isCompleted = completedSteps.has(index);
                    return (
                      <button
                        key={index}
                        onClick={() => toggleStep(index)}
                        className={`w-full flex items-start gap-4 p-4 rounded-lg transition-all text-left ${
                          isCompleted 
                            ? "bg-chart-2/10 border border-chart-2/30" 
                            : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            isCompleted
                              ? "bg-chart-2 text-white"
                              : step.priority === "high"
                              ? "bg-destructive/20 text-destructive"
                              : step.priority === "medium"
                              ? "bg-chart-3/20 text-chart-3"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                            {step.action}
                          </span>
                          {step.deadline && (
                            <span className="text-xs text-muted-foreground block mt-1">
                              📅 Deadline: {step.deadline}
                            </span>
                          )}
                        </div>
                        {!isCompleted && (
                          <Badge
                            variant={
                              step.priority === "high"
                                ? "destructive"
                                : step.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {step.priority === "high"
                              ? t("priorityHigh") || "High"
                              : step.priority === "medium"
                              ? t("priorityMedium") || "Medium"
                              : t("priorityLow") || "Low"}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Progress indicator */}
                {analysis.nextSteps.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{t("progress") || "Progress"}</span>
                      <span className="font-medium">
                        {Math.round((completedSteps.size / analysis.nextSteps.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-chart-2 transition-all duration-500"
                        style={{ width: `${(completedSteps.size / analysis.nextSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            </AnimatedItem>
          )}

          <AnimatedItem animation="fade-in-up" delay={300}>
            <RiskAssessment riskAssessment={analysis.riskAssessment} />
          </AnimatedItem>
        </TabsContent>

        {/* Laws Tab */}
        <TabsContent value="laws" className="mt-6" key="laws-tab">
          <AnimatedItem animation="slide-in-left" delay={0}>
            <LawList laws={analysis.relevantLaws} rights={analysis.rights} />
          </AnimatedItem>
        </TabsContent>

        {/* Lawyers Tab */}
        <TabsContent value="lawyers" className="space-y-6 mt-6" key="lawyers-tab">
          <AnimatedItem animation="scale-up" delay={0}>
            <div id="map-section">
              <LawyersMap
                lawyers={lawyersWithCoordinates}
                selectedLawyer={selectedLawyer}
                onSelectLawyer={setSelectedLawyer}
              />
            </div>
          </AnimatedItem>
          <AnimatedItem animation="fade-in-up" delay={200}>
            <LawyerList
              lawyers={lawyersWithCoordinates}
              onViewOnMap={handleViewOnMap}
            />
          </AnimatedItem>
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs" className="space-y-6 mt-6" key="costs-tab">
          <AnimatedItem animation="fade-in-up" delay={0}>
            <CostEstimate costs={analysis.estimatedCosts} />
          </AnimatedItem>
          <AnimatedItem animation="fade-in-up" delay={150}>
            <GovernmentAgencies agencies={analysis.governmentAgencies} />
          </AnimatedItem>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6" key="guide-tab">
          <AnimatedItem animation="fade-in-up" delay={0}>
            <EvidenceGuide evidenceGuide={analysis.evidenceGuide} />
          </AnimatedItem>

          {/* Essential Documents */}
          {analysis.essentialDocuments && analysis.essentialDocuments.length > 0 && (
            <AnimatedItem animation="fade-in-up" delay={150}>
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <File className="h-5 w-5 text-chart-1" />
                    {t("essentialDocuments")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.essentialDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 animate-fade-in-up cursor-pointer btn-press"
                        style={{ animationDelay: `${200 + index * 50}ms`, animationFillMode: "forwards", opacity: 0 }}
                      >
                        <FileText className="h-5 w-5 text-chart-1 flex-shrink-0" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedItem>
          )}
        </TabsContent>

        {/* Sources Tab */}
        <TabsContent value="sources" className="mt-6" key="sources-tab">
          <AnimatedItem animation="slide-in-right" delay={0}>
            <SourcesList sources={analysis.sources} analysis={analysis} />
          </AnimatedItem>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6" key="reports-tab">
          <AnimatedItem animation="fade-in-up" delay={0}>
            <ReportsGenerator analysis={analysis} />
          </AnimatedItem>
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="chat" className="mt-6" key="chat-tab">
          <AnimatedItem animation="fade-in-up" delay={0}>
            <div className="min-h-[600px] max-h-[800px]">
              <AIChatAssistant analysis={analysis} />
            </div>
          </AnimatedItem>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="bg-secondary/30 border-border/50 animate-fade-in-up" style={{ animationDelay: "500ms", animationFillMode: "forwards", opacity: 0 }}>
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            {t("resultsDisclaimer")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
