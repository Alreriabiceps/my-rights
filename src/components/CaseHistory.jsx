"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { getUserCases, deleteCase, updateCase } from "@/lib/caseService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Calendar,
  Trash2,
  Eye,
  Clock,
  AlertCircle,
  Loader2,
  Archive,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  RefreshCw,
  X,
} from "lucide-react";
import { format } from "date-fns";

export default function CaseHistory({ onSelectCase }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    if (user) {
      loadCases();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCases = async () => {
    if (!user) return;
    
    setLoading(true);
    setError("");
    
    const result = await getUserCases(user.uid);
    setLoading(false);
    
    if (result.success) {
      setCases(result.cases);
    } else {
      setError(result.error || "Failed to load cases");
    }
  };

  const handleDelete = async () => {
    if (!caseToDelete || !user) return;
    
    const result = await deleteCase(caseToDelete.id, user.uid);
    
    if (result.success) {
      setCases(cases.filter((c) => c.id !== caseToDelete.id));
      setDeleteDialogOpen(false);
      setCaseToDelete(null);
    } else {
      setError(result.error || "Failed to delete case");
    }
  };

  const handleStatusUpdate = async (caseId, newStatus) => {
    if (!user) return;
    
    setUpdatingStatus(caseId);
    setError("");
    
    const updates = {
      status: newStatus,
    };
    
    // If marking as resolved, add resolved date
    if (newStatus === "resolved") {
      updates.resolvedAt = new Date();
    }
    
    const result = await updateCase(caseId, updates);
    
    if (result.success) {
      // Update local state
      setCases(cases.map(c => 
        c.id === caseId 
          ? { 
              ...c, 
              status: newStatus, 
              resolvedAt: newStatus === "resolved" ? new Date() : c.resolvedAt,
              updatedAt: new Date()
            }
          : c
      ));
    } else {
      setError(result.error || "Failed to update case status");
    }
    
    setUpdatingStatus(null);
  };

  const getStatusBadge = (status) => {
    const configs = {
      active: {
        icon: Clock,
        className: "bg-primary/10 text-primary border-primary/20",
      },
      archived: {
        icon: Archive,
        className: "bg-muted/30 text-muted-foreground border-border",
      },
      resolved: {
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-600 border-green-500/20",
      },
    };
    
    const config = configs[status] || configs.active;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-[10px] ${config.className}`}>
        <Icon className="h-3 w-3" />
        <span className="font-medium capitalize">{status}</span>
      </Badge>
    );
  };

  const formatDate = (date) => {
    if (!date) return t("noDeadline");
    try {
      if (date.toDate) {
        return format(date.toDate(), "MMM dd, yyyy");
      }
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return t("noDeadline");
    }
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    try {
      const now = new Date();
      const deadlineDate = deadline.toDate ? deadline.toDate() : new Date(deadline);
      const diffTime = deadlineDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 mb-6">
          <AlertCircle className="h-16 w-16 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{t("signInToViewCases")}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Sign in to save and manage your legal cases
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading your cases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-8 mb-6">
          <FileText className="h-16 w-16 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{t("noCases")}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
          {t("noCasesDesc")}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Analyze a case to get started</span>
        </div>
      </div>
    );
  }

  const activeCases = cases.filter(c => c.status === "active").length;
  const resolvedCases = cases.filter(c => c.status === "resolved").length;
  const archivedCases = cases.filter(c => c.status === "archived").length;
  
  // Filter cases based on status filter
  const filteredCases = statusFilter === "all" 
    ? cases 
    : cases.filter(c => c.status === statusFilter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Case History</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {cases.length} {cases.length === 1 ? "case" : "cases"} total
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={loadCases}
          className="h-8 w-8"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-1.5">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
          className="h-7 text-xs px-2.5"
        >
          All
          <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
            {cases.length}
          </Badge>
        </Button>
        <Button
          variant={statusFilter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("active")}
          className="h-7 text-xs px-2.5 gap-1.5"
        >
          <Clock className="h-3 w-3" />
          Active
          <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
            {activeCases}
          </Badge>
        </Button>
        <Button
          variant={statusFilter === "resolved" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("resolved")}
          className="h-7 text-xs px-2.5 gap-1.5"
        >
          <CheckCircle2 className="h-3 w-3" />
          Resolved
          <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
            {resolvedCases}
          </Badge>
        </Button>
        <Button
          variant={statusFilter === "archived" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("archived")}
          className="h-7 text-xs px-2.5 gap-1.5"
        >
          <Archive className="h-3 w-3" />
          Archived
          <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
            {archivedCases}
          </Badge>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-border/50">
          <CardContent className="pt-3 pb-3 px-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Total</p>
                <p className="text-xl font-bold">{cases.length}</p>
              </div>
              <FileText className="h-4 w-4 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="pt-3 pb-3 px-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Active</p>
                <p className="text-xl font-bold">{activeCases}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-orange-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-3 pb-3 px-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Resolved</p>
                <p className="text-xl font-bold text-green-600">{resolvedCases}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-3 pb-3 px-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Archived</p>
                <p className="text-xl font-bold">{archivedCases}</p>
              </div>
              <Archive className="h-4 w-4 text-muted-foreground opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases List */}
      <div className="space-y-2">
        {filteredCases.length === 0 ? (
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-center text-sm text-muted-foreground">
                No {statusFilter !== "all" ? statusFilter : ""} cases found.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCases.map((caseItem) => {
            const daysRemaining = getDaysRemaining(caseItem.deadline);
            const isOverdue = daysRemaining !== null && daysRemaining < 0;
            const isUrgent = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7;
            
            return (
            <Card 
              key={caseItem.id} 
              className="group border-border/50 hover:border-primary/30 transition-all hover:shadow-sm"
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-sm leading-tight">
                            {caseItem.analysis?.caseType || t("caseAnalysis")}
                          </h3>
                          {getStatusBadge(caseItem.status)}
                        </div>
                        
                        {caseItem.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {caseItem.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{caseItem.createdAt && formatDate(caseItem.createdAt)}</span>
                      </div>
                      
                      {caseItem.status === "resolved" && caseItem.resolvedAt && (
                        <div className="flex items-center gap-1.5 text-green-600 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Resolved: {formatDate(caseItem.resolvedAt)}</span>
                        </div>
                      )}
                      
                      {caseItem.deadline && caseItem.status === "active" && (
                        <div className={`flex items-center gap-1.5 font-medium ${
                          isOverdue 
                            ? "text-destructive" 
                            : isUrgent
                            ? "text-orange-500"
                            : "text-muted-foreground"
                        }`}>
                          <Clock className={`h-3 w-3 ${isOverdue ? "animate-pulse" : ""}`} />
                          {isOverdue ? (
                            <span className="flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                              Overdue ({Math.abs(daysRemaining)}d)
                            </span>
                          ) : (
                            <span>
                              {formatDate(caseItem.deadline)} ({daysRemaining}d)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                    {/* Status Selector */}
                    <select
                      value={caseItem.status || "active"}
                      onChange={(e) => handleStatusUpdate(caseItem.id, e.target.value)}
                      disabled={updatingStatus === caseItem.id}
                      className="px-2 py-1 text-xs border rounded-md bg-background hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed h-7"
                    >
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>

                    {/* Quick Action Buttons */}
                    {caseItem.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(caseItem.id, "resolved")}
                        disabled={updatingStatus === caseItem.id}
                        className="gap-1.5 h-7 text-xs px-2"
                      >
                        {updatingStatus === caseItem.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        <span className="hidden sm:inline">Resolve</span>
                      </Button>
                    )}

                    {onSelectCase && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onSelectCase(caseItem)}
                        className="gap-1.5 h-7 text-xs px-2"
                      >
                        <Eye className="h-3 w-3" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    )}
                    
                    <Dialog
                      open={deleteDialogOpen && caseToDelete?.id === caseItem.id} 
                      onOpenChange={(open) => {
                        if (!open) {
                          setDeleteDialogOpen(false);
                          setCaseToDelete(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCaseToDelete(caseItem);
                            setDeleteDialogOpen(true);
                          }}
                          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            {t("deleteCase")}
                          </DialogTitle>
                          <DialogDescription className="pt-2">
                            {t("deleteCaseConfirm")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-6">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setDeleteDialogOpen(false);
                              setCaseToDelete(null);
                            }}
                          >
                            {t("cancel")}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDelete}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("deleteCase")}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }))}
      </div>
    </div>
  );
}
