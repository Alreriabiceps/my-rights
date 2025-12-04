"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/lib/LanguageContext";
import { Loader2, ArrowRight, CheckCircle2, Sparkles, X } from "lucide-react";

export default function FollowUpQuestions({ 
  initialDescription, 
  onComplete, 
  onCancel 
}) {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: initialDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError(err.message || "Failed to generate questions");
      // If questions fail, proceed with just the initial description
      setTimeout(() => {
        onComplete(initialDescription, {});
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // Create structured Q&A data
    const followUpData = questions
      .filter(q => answers[q.id] && answers[q.id].trim())
      .map(q => ({
        question: q.text,
        answer: answers[q.id],
        hint: q.hint || ""
      }));
    
    // Combine initial description with answers for the prompt
    const combinedDescription = combineDescriptionAndAnswers(initialDescription, answers, questions);
    
    // Call onComplete with the combined description and structured Q&A data
    onComplete(combinedDescription, followUpData);
  };

  const combineDescriptionAndAnswers = (initial, answers, questions) => {
    let combined = initial;
    
    // Add answers to the description
    questions.forEach((question, index) => {
      const answer = answers[question.id];
      if (answer && answer.trim()) {
        combined += `\n\n${question.text}\n${answer}`;
      }
    });

    return combined;
  };

  // Don't show separate loading/error screens - show card structure immediately

  // Show card structure immediately, even while loading
  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] || "") : "";
  const isLastQuestion = questions.length > 0 && currentQuestionIndex === questions.length - 1;
  const hasAnswer = currentAnswer.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 backdrop-blur-lg p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-border/50 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl">Help us understand better</CardTitle>
                  <CardDescription className="mt-1">
                    {loading ? (
                      "Preparing personalized questions..."
                    ) : questions.length === 0 ? (
                      "Ready to proceed"
                    ) : (
                      `Question ${currentQuestionIndex + 1} of ${questions.length}`
                    )}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress bar */}
            {questions.length > 0 && (
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            )}
            {loading && (
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div className="bg-primary/50 h-full animate-pulse rounded-full" style={{ width: "60%" }} />
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {loading ? (
              // Loading skeleton
              <div className="space-y-3 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0 mt-1 w-10 h-10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-secondary rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-1/2" />
                  </div>
                </div>
                <div className="pl-11">
                  <div className="h-32 bg-secondary/50 rounded" />
                </div>
              </div>
            ) : questions.length === 0 ? (
              // No questions - ready to proceed
              <div className="space-y-4 text-center py-8">
                <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-6 inline-block">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ready to analyze</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    We have enough information to proceed with your case analysis
                  </p>
                </div>
                <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Analysis
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            ) : error ? (
              // Error state
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="text-center">
                  <Button onClick={onCancel} variant="outline">
                    Go Back
                  </Button>
                </div>
              </div>
            ) : (
              // Questions loaded - show question
              <>
                {/* Question */}
                <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-lg">
                        {currentQuestionIndex + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold leading-relaxed">
                        {currentQuestion.text}
                      </h3>
                      {currentQuestion.hint && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {currentQuestion.hint}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Answer input */}
                  <div className="pl-11">
                    <Textarea
                      value={currentAnswer}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Type your answer here..."
                      rows={5}
                      className="resize-none bg-secondary/50 text-base"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip
                  </Button>
                  <div className="flex items-center gap-3">
                    {currentQuestionIndex > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      disabled={submitting}
                      className="gap-2"
                    >
                      {isLastQuestion ? (
                        <>
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Complete
                              <CheckCircle2 className="h-4 w-4" />
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

