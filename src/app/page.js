"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import VoiceInput from "@/components/VoiceInput";
import FollowUpQuestions from "@/components/FollowUpQuestions";
import FileUpload from "@/components/FileUpload";
import ResultsView from "@/components/ResultsView";
import LanguageToggle from "@/components/LanguageToggle";
import UserProfile from "@/components/UserProfile";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { saveCase } from "@/lib/caseService";
import { Scale, Mic, Keyboard, Paperclip, FileSearch, Lightbulb, Users, Loader2, History, Database } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CaseHistory from "@/components/CaseHistory";

// Storage key for persisting analysis
const STORAGE_KEY = "legaize_analysis";

export default function Home() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [inputMode, setInputMode] = useState(null); // null = choose, 'voice' = voice, 'text' = text
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [pendingDescription, setPendingDescription] = useState("");
  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const [savingCase, setSavingCase] = useState(false);

  // Load saved analysis from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.analysis) {
          setAnalysis(parsed.analysis);
          setDescription(parsed.description || "");
        }
      }
    } catch (e) {
      console.error("Error loading saved analysis:", e);
    }
    setIsHydrated(true);
  }, []);

  // Save analysis to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    
    try {
      if (analysis) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          analysis,
          description,
          savedAt: new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.error("Error saving analysis:", e);
    }
  }, [analysis, description, isHydrated]);

  const handleSaveCase = useCallback(async (caseAnalysis, caseDescription) => {
    if (!user) {
      console.warn("⚠️ Cannot save case: User not authenticated");
      return;
    }
    
    console.log("💾 Attempting to save case...", { userId: user.uid, hasAnalysis: !!caseAnalysis });
    setSavingCase(true);
    try {
      // Extract deadline from analysis if available - with validation
      let deadline = null;
      if (caseAnalysis.timeline?.statuteOfLimitations?.deadline) {
        try {
          const deadlineStr = caseAnalysis.timeline.statuteOfLimitations.deadline;
          // Handle both string and Date objects
          const deadlineDate = typeof deadlineStr === 'string' 
            ? new Date(deadlineStr) 
            : deadlineStr instanceof Date 
            ? deadlineStr 
            : new Date(deadlineStr);
          
          // Validate the date
          if (!isNaN(deadlineDate.getTime())) {
            deadline = deadlineDate;
          } else {
            console.warn("⚠️ Invalid deadline format, skipping:", deadlineStr);
          }
        } catch (error) {
          console.warn("⚠️ Error parsing deadline, skipping:", error);
        }
      }
      
      const result = await saveCase(user.uid, {
        description: caseDescription,
        analysis: caseAnalysis,
        status: "active",
        deadline: deadline,
        tags: [caseAnalysis.caseType],
      });
      
      if (result.success) {
        console.log("✅ Case saved successfully:", result.caseId);
      } else {
        console.error("❌ Failed to save case:", result.error);
      }
    } catch (err) {
      console.error("❌ Error saving case:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
    } finally {
      setSavingCase(false);
    }
  }, [user]);

  const handleVoiceTranscript = useCallback((transcript) => {
    if (!transcript?.trim()) {
      setInputMode(null);
      return;
    }

    // Instead of immediately analyzing, show follow-up questions
    setPendingDescription(transcript);
    setInputMode(null);
    setShowFollowUp(true);
  }, []);

  const handleFollowUpComplete = useCallback(async (combinedDescription, followUpData) => {
    setShowFollowUp(false);
    setDescription(combinedDescription);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("description", combinedDescription);
      // Pass follow-up Q&A data as JSON string
      if (followUpData && followUpData.length > 0) {
        formData.append("followUpQuestions", JSON.stringify(followUpData));
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorGeneral"));
      }

      setAnalysis(data);
      
      // Auto-save case if user is logged in
      console.log("📊 Analysis received, checking if should save...", { 
        hasUser: !!user, 
        userId: user?.uid,
        hasData: !!data 
      });
      if (user && data) {
        handleSaveCase(data, combinedDescription);
      } else {
        console.warn("⚠️ Skipping case save:", { 
          reason: !user ? "Not logged in" : "No analysis data",
          user: !!user,
          data: !!data 
        });
      }
    } catch (err) {
      setError(err.message || t("errorGeneral"));
      setInputMode("text"); // Go to text mode so user can retry
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [t, user, handleSaveCase]);

  const handleFollowUpCancel = useCallback(() => {
    setShowFollowUp(false);
    setPendingDescription("");
    setInputMode(null);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!description.trim()) {
      setError(t("errorRequired"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("description", description);
      
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorGeneral"));
      }

      setAnalysis(data);
      
      // Auto-save case if user is logged in
      console.log("📊 Analysis received, checking if should save...", { 
        hasUser: !!user, 
        userId: user?.uid,
        hasData: !!data 
      });
      if (user && data) {
        handleSaveCase(data, description);
      } else {
        console.warn("⚠️ Skipping case save:", { 
          reason: !user ? "Not logged in" : "No analysis data",
          user: !!user,
          data: !!data 
        });
      }
    } catch (err) {
      setError(err.message || t("errorGeneral"));
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCase = (caseItem) => {
    setAnalysis(caseItem.analysis);
    setDescription(caseItem.description || "");
    setHistorySheetOpen(false);
  };

  const handleReset = () => {
    // Clear saved analysis from localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing saved analysis:", e);
    }
    
    setAnalysis(null);
    setDescription("");
    setFiles([]);
    setError(null);
    setInputMode(null);
  };

  // Show loading while hydrating from localStorage
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-lg bg-primary/20 overflow-hidden mb-4">
            <Image 
              src="/LOGO.png" 
              alt="LegAIze Logo" 
              width={64} 
              height={64} 
              className="object-contain animate-pulse"
              loading="eager"
            />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show results view if analysis is complete
  if (analysis) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/20 overflow-hidden">
                <Image 
                  src="/LOGO.png" 
                  alt="LegAIze Logo" 
                  width={56} 
                  height={56} 
                  className="object-contain"
                  loading="eager"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {t("appName")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {t("tagline")}
              </span>
              <Link href="/knowledge-base">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Knowledge Base</span>
                </Button>
              </Link>
              {user && (
                <Dialog open={historySheetOpen} onOpenChange={setHistorySheetOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <History className="h-4 w-4" />
                      <span className="hidden sm:inline">{t("caseHistory")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader className="pb-3">
                      <DialogTitle className="text-xl">{t("caseHistory")}</DialogTitle>
                      <DialogDescription className="text-xs">{t("myCases")}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-2">
                      <CaseHistory onSelectCase={handleSelectCase} />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <LanguageToggle />
              <UserProfile />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8">
          <ResultsView analysis={analysis} onReset={handleReset} />
        </main>

        <footer className="border-t border-border/40 bg-background/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-1 px-6 py-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
            <span>© {year} {t("appName")}</span>
            <span>{t("footerTagline")}</span>
          </div>
        </footer>
      </div>
    );
  }

  // Show follow-up questions after voice input
  if (showFollowUp) {
    return (
      <FollowUpQuestions
        initialDescription={pendingDescription}
        onComplete={handleFollowUpComplete}
        onCancel={handleFollowUpCancel}
      />
    );
  }

  // Show voice input full screen
  if (inputMode === "voice") {
    return (
      <VoiceInput
        onTranscript={handleVoiceTranscript}
        onClose={() => setInputMode(null)}
        disabled={isLoading}
      />
    );
  }

  // Show text input mode
  if (inputMode === "text") {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/20 overflow-hidden">
                <Image 
                  src="/LOGO.png" 
                  alt="LegAIze Logo" 
                  width={56} 
                  height={56} 
                  className="object-contain"
                  loading="eager"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {t("appName")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/knowledge-base">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Knowledge Base</span>
                </Button>
              </Link>
              {user && (
                <Dialog open={historySheetOpen} onOpenChange={setHistorySheetOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <History className="h-4 w-4" />
                      <span className="hidden sm:inline">{t("caseHistory")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader className="pb-3">
                      <DialogTitle className="text-xl">{t("caseHistory")}</DialogTitle>
                      <DialogDescription className="text-xs">{t("myCases")}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-2">
                      <CaseHistory onSelectCase={handleSelectCase} />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <LanguageToggle />
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
          <section className="w-full max-w-2xl space-y-6">
            <Card className="border-border/50 shadow-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl sm:text-2xl">
                  {t("describeYourCase")}
                </CardTitle>
                <CardDescription>
                  {description ? t("reviewOrEdit") : t("typeYourProblem")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Text Input */}
                  <div className="space-y-2">
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("inputPlaceholder")}
                      rows={6}
                      disabled={isLoading}
                      className="resize-none bg-secondary/50 text-base"
                    />
                  </div>

                  {/* Voice Input & File Upload Toggles */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMode("voice")}
                      className="gap-2"
                    >
                      <Mic className="h-4 w-4" />
                      {t("addVoice")}
                    </Button>

                    <Button
                      type="button"
                      variant={showFileUpload ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowFileUpload(!showFileUpload)}
                      className="gap-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      {t("attach")}
                    </Button>
                  </div>

                  {/* File Upload Section */}
                  {showFileUpload && (
                    <FileUpload onFilesChange={setFiles} disabled={isLoading} />
                  )}

                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading || !description.trim()}
                    className="w-full gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t("analyzing")}
                      </>
                    ) : (
                      <>
                        <FileSearch className="h-5 w-5" />
                        {t("analyzeCase")}
                      </>
                    )}
                  </Button>

                  {/* Back to choice */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setInputMode(null)}
                    className="w-full"
                  >
                    {t("backToChoice")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-1 px-6 py-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
            <span>© {year} {t("appName")}</span>
            <span>{t("footerTagline")}</span>
          </div>
        </footer>
      </div>
    );
  }

  // Show loading screen when analyzing after voice input
  if (isLoading && inputMode === null) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/20 overflow-hidden">
                <Image 
                  src="/LOGO.png" 
                  alt="LegAIze Logo" 
                  width={56} 
                  height={56} 
                  className="object-contain"
                  loading="eager"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {t("appName")}
              </span>
            </div>
            <LanguageToggle />
          </div>
        </header>

        {/* Loading Content */}
        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="text-center animate-fade-in-up">
            {/* Animated loader */}
            <div className="relative mb-8">
              {/* Outer pulsing rings */}
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
              
              {/* Spinning ring */}
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin" style={{ animationDuration: "1s" }} />
              
              {/* Center icon with pulse */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Image 
                  src="/LOGO.png" 
                  alt="LegAIze Logo" 
                  width={64} 
                  height={64} 
                  className="object-contain animate-pulse"
                  loading="eager"
                />
              </div>
            </div>
            
            {/* Loading text with typing effect */}
            <h2 className="text-2xl font-bold mb-2 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "forwards", opacity: 0 }}>
              {t("analyzing")}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "forwards", opacity: 0 }}>
              {t("analyzingDesc") || "Analyzing your case and finding relevant Philippine laws..."}
            </p>
            
            {/* Loading steps indicator */}
            <div className="mt-8 flex items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "600ms", animationFillMode: "forwards", opacity: 0 }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
                <span>Reading case</span>
              </div>
              <div className="w-8 h-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.3s" }} />
                <span>Finding laws</span>
              </div>
              <div className="w-8 h-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" style={{ animationDelay: "0.6s" }} />
                <span>Matching lawyers</span>
              </div>
            </div>
            
            {/* User's input preview */}
            {description && (
              <div className="mt-8 p-4 bg-secondary/30 rounded-xl max-w-md mx-auto animate-fade-in-up border border-border/50" style={{ animationDelay: "800ms", animationFillMode: "forwards", opacity: 0 }}>
                <p className="text-sm text-muted-foreground italic">"{description.slice(0, 150)}{description.length > 150 ? '...' : ''}"</p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-1 px-6 py-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
            <span>© {year} {t("appName")}</span>
            <span>{t("footerTagline")}</span>
          </div>
        </footer>
      </div>
    );
  }

  // Default: Choice screen - Voice or Text
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 overflow-hidden">
              <Image 
                src="/LOGO.png" 
                alt="LegAIze Logo" 
                width={40} 
                height={40} 
                className="object-contain"
                loading="eager"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">
              {t("appName")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {t("tagline")}
            </span>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content - Choice Screen */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <section className="w-full max-w-3xl">
          {/* Hero Text */}
          <div className="text-center mb-12 animate-fade-in-down">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t("chooseInputMethod")}
            </p>
          </div>

          {/* Input Method Choice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {/* Voice Input - Primary */}
            <button
              onClick={() => setInputMode("voice")}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 hover:border-primary/50 p-8 sm:p-10 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 animate-fade-in-up btn-press"
              style={{ animationDelay: "100ms", animationFillMode: "forwards", opacity: 0 }}
            >
              {/* Decorative circles */}
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/10 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-primary/5 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6 group-hover:scale-110 transition-transform">
                  <Mic className="h-8 w-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {t("talkToUs")}
                </h3>
                <p className="text-muted-foreground">
                  {t("talkToUsDesc")}
                </p>
                <div className="mt-4 flex items-center text-primary text-sm font-medium">
                  {t("recommended")}
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-xs">
                    ★
                  </span>
                </div>
              </div>
            </button>

            {/* Text Input - Secondary */}
            <button
              onClick={() => setInputMode("text")}
              className="group relative overflow-hidden rounded-3xl bg-secondary/30 border-2 border-border/50 hover:border-border p-8 sm:p-10 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in-up btn-press"
              style={{ animationDelay: "200ms", animationFillMode: "forwards", opacity: 0 }}
            >
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-foreground mb-6 group-hover:scale-110 transition-transform">
                  <Keyboard className="h-8 w-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {t("typeInstead")}
                </h3>
                <p className="text-muted-foreground">
                  {t("typeInsteadDesc")}
                </p>
              </div>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-card/50 card-hover animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "forwards", opacity: 0 }}>
              <CardContent className="pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 mb-3 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{t("featureAI")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("featureAIDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 card-hover animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "forwards", opacity: 0 }}>
              <CardContent className="pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20 mb-3 group-hover:scale-110 transition-transform">
                  <Scale className="h-5 w-5 text-chart-2" />
                </div>
                <h3 className="font-semibold mb-1">{t("featureLaws")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("featureLawsDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 card-hover animate-fade-in-up" style={{ animationDelay: "500ms", animationFillMode: "forwards", opacity: 0 }}>
              <CardContent className="pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20 mb-3 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-chart-3" />
                </div>
                <h3 className="font-semibold mb-1">{t("featureLawyers")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("featureLawyersDesc")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-muted-foreground text-center">
            {t("disclaimer")}
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-1 px-6 py-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {year} {t("appName")}</span>
          <span>{t("footerTagline")}</span>
        </div>
      </footer>
    </div>
  );
}
