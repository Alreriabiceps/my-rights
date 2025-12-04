"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllKnowledgeBaseCases, getKnowledgeBaseStats } from "@/lib/knowledgeBaseService";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  Database, 
  Search, 
  TrendingUp, 
  AlertCircle,
  Loader2,
  Calendar,
  Tag,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function KnowledgeBasePage() {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [casesResult, statsResult] = await Promise.all([
        getAllKnowledgeBaseCases(200),
        getKnowledgeBaseStats(),
      ]);

      if (casesResult.success) {
        setCases(casesResult.cases);
      } else {
        setError(casesResult.error);
      }

      if (statsResult.success) {
        setStats(statsResult.stats);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter cases
  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = 
      caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caseItem.keywords && caseItem.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilter = filterType === "all" || caseItem.caseType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Get unique case types for filter
  const caseTypes = [...new Set(cases.map(c => c.caseType))].sort();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            AI Knowledge Base
          </h1>
          <p className="text-muted-foreground mt-2">
            View all cases the AI has learned from
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCases}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Complexity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageComplexity}/10</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsageCount}</div>
              <p className="text-xs text-muted-foreground">Times referenced</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Case Types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{caseTypes.length}</div>
              <p className="text-xs text-muted-foreground">Different types</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Case Type Distribution */}
      {stats && stats.byCaseType && Object.keys(stats.byCaseType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cases by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byCaseType)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <Badge key={type} variant="secondary" className="text-sm">
                    {type}: {count}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases by description, type, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-md bg-background"
            >
              <option value="all">All Types</option>
              {caseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredCases.length} of {cases.length} cases
          </p>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Error loading knowledge base: {error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                {cases.length === 0 
                  ? "No cases found. Start analyzing cases to build the knowledge base!"
                  : "No cases match your search criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCases.map((caseItem) => (
            <Card key={caseItem.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline">{caseItem.caseType}</Badge>
                      <Badge variant="secondary">
                        Complexity: {caseItem.complexity}/10
                      </Badge>
                      <Badge 
                        variant={caseItem.urgencyLevel === "high" ? "destructive" : "default"}
                      >
                        {caseItem.urgencyLevel} urgency
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">
                      {caseItem.description.substring(0, 150)}
                      {caseItem.description.length > 150 && "..."}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {caseItem.createdAt 
                      ? format(caseItem.createdAt, "MMM dd, yyyy")
                      : "Unknown date"}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Used {caseItem.usageCount} times
                  </div>
                </div>
                
                {caseItem.keywords && caseItem.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {caseItem.keywords.slice(0, 10).map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {caseItem.keywords.length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{caseItem.keywords.length - 10} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {caseItem.relevantLaws && caseItem.relevantLaws.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Relevant Laws:</p>
                    <div className="flex flex-wrap gap-1">
                      {caseItem.relevantLaws.slice(0, 3).map((law, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {law.law || law.title}
                        </Badge>
                      ))}
                      {caseItem.relevantLaws.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{caseItem.relevantLaws.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

