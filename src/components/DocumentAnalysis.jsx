"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  AlertTriangle, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  Calendar,
  Users,
  FileCheck,
  Scale,
  Lightbulb,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function DocumentAnalysis({ analysis, onBack, fileName }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("summary");

  if (!analysis) {
    return null;
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <AlertCircle className="h-4 w-4" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Document Analysis
            </h1>
            {fileName && (
              <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {analysis.documentType || "Legal Document"}
        </Badge>
      </div>

      {/* Legal Compliance Alert */}
      {analysis.legalCompliance && (
        <Alert
          variant={
            analysis.legalCompliance.philippineLawCompliant === false
              ? "destructive"
              : analysis.legalCompliance.philippineLawCompliant === true
              ? "default"
              : "default"
          }
        >
          <Scale className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">
              {analysis.legalCompliance.philippineLawCompliant === false
                ? "⚠️ Legal Compliance Issues Detected"
                : analysis.legalCompliance.philippineLawCompliant === true
                ? "✅ Document Appears Compliant"
                : "ℹ️ Compliance Status Unknown"}
            </div>
            {analysis.legalCompliance.concerns &&
              analysis.legalCompliance.concerns.length > 0 && (
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {analysis.legalCompliance.concerns.map((concern, idx) => (
                    <li key={idx} className="text-sm">
                      {concern}
                    </li>
                  ))}
                </ul>
              )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="clauses">Key Clauses</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.summary?.overview && (
                <div>
                  <h3 className="font-semibold mb-2">Overview</h3>
                  <p className="text-muted-foreground">
                    {analysis.summary.overview}
                  </p>
                </div>
              )}

              {analysis.summary?.purpose && (
                <div>
                  <h3 className="font-semibold mb-2">Purpose</h3>
                  <p className="text-muted-foreground">
                    {analysis.summary.purpose}
                  </p>
                </div>
              )}

              {analysis.summary?.parties && analysis.summary.parties.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Parties Involved
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.summary.parties.map((party, idx) => (
                      <Badge key={idx} variant="outline">
                        {party}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis.summary?.keyDates && analysis.summary.keyDates.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Key Dates
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.summary.keyDates.map((date, idx) => (
                      <li key={idx}>{date}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rights Section */}
          {analysis.rights && analysis.rights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Rights Identified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.rights.map((right, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg border"
                    >
                      {right.protected ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{right.right}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {right.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Key Clauses Tab */}
        <TabsContent value="clauses" className="space-y-4">
          {analysis.keyClauses && analysis.keyClauses.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {analysis.keyClauses.map((clause, idx) => (
                <AccordionItem key={idx} value={`clause-${idx}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant={getSeverityColor(clause.importance)}>
                        {clause.importance}
                      </Badge>
                      <span className="font-semibold">{clause.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <div>
                        <h4 className="font-medium mb-2">Content:</h4>
                        <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                          {clause.content}
                        </p>
                      </div>
                      {clause.explanation && (
                        <div>
                          <h4 className="font-medium mb-2">Explanation:</h4>
                          <p className="text-sm text-muted-foreground">
                            {clause.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No key clauses identified
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          {analysis.issues && analysis.issues.length > 0 ? (
            <div className="space-y-4">
              {analysis.issues.map((issue, idx) => (
                <Card key={idx} className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getSeverityIcon(issue.severity)}
                        {issue.type}
                      </CardTitle>
                      <Badge variant={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                    {issue.location && (
                      <CardDescription className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Location: {issue.location}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Description:</h4>
                      <p className="text-sm text-muted-foreground">
                        {issue.description}
                      </p>
                    </div>
                    {issue.recommendation && (
                      <div className="bg-primary/5 p-3 rounded-lg">
                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Recommendation:
                        </h4>
                        <p className="text-sm">{issue.recommendation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                No significant issues identified
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          {analysis.risks && analysis.risks.length > 0 ? (
            <div className="space-y-4">
              {analysis.risks.map((risk, idx) => (
                <Card key={idx} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        {risk.category}
                      </CardTitle>
                      <Badge variant={getSeverityColor(risk.level)}>
                        {risk.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Description:</h4>
                      <p className="text-sm text-muted-foreground">
                        {risk.description}
                      </p>
                    </div>
                    {risk.impact && (
                      <div>
                        <h4 className="font-semibold mb-1">Impact:</h4>
                        <p className="text-sm text-muted-foreground">
                          {risk.impact}
                        </p>
                      </div>
                    )}
                    {risk.mitigation && (
                      <div className="bg-primary/5 p-3 rounded-lg">
                        <h4 className="font-semibold mb-1">Mitigation:</h4>
                        <p className="text-sm">{risk.mitigation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No significant risks identified
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {analysis.recommendations && analysis.recommendations.length > 0 ? (
            <div className="space-y-4">
              {analysis.recommendations.map((rec, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <ChevronRight className="h-5 w-5" />
                        {rec.action}
                      </CardTitle>
                      <Badge variant={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  {rec.reason && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {rec.reason}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No recommendations available
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          {analysis.nextSteps && analysis.nextSteps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.nextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg border"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{step.step}</h4>
                          <Badge variant={getPriorityColor(step.priority)}>
                            {step.priority}
                          </Badge>
                        </div>
                        {step.deadline && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {step.deadline}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Required Modifications */}
          {analysis.legalCompliance?.requiredModifications &&
            analysis.legalCompliance.requiredModifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Required Modifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {analysis.legalCompliance.requiredModifications.map(
                      (mod, idx) => (
                        <li key={idx}>{mod}</li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

