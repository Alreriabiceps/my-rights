"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { Mic, MicOff, X, AlertCircle, Keyboard } from "lucide-react";

export default function VoiceInput({ onTranscript, onClose, disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const isListeningRef = useRef(false); // Use ref to track listening state for callbacks
  const restartTimeoutRef = useRef(null);
  const { t } = useLanguage();

  // Audio visualization
  const startAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream; // Store stream for cleanup
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
        }
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err) {
      console.error("Audio visualization error:", err);
    }
  }, []);

  const stopAudioVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    // Stop all tracks in the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Initialize speech recognition once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Try Filipino first, fallback to English - browser will use best match
    recognition.lang = "fil-PH";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => (prev + " " + finalTranscript).trim());
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      
      // Handle specific errors
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please allow microphone access.");
        setIsListening(false);
        isListeningRef.current = false;
      } else if (event.error === "network") {
        setError("Network error. Please check your internet connection.");
      } else if (event.error === "no-speech") {
        // No speech detected - this is normal, don't show error
        // Recognition will auto-restart via onend
      } else if (event.error === "aborted") {
        // User or system aborted - don't show error
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      // Only restart if we're supposed to be listening (use ref for current value)
      if (isListeningRef.current) {
        // Clear any existing restart timeout
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        
        // Small delay before restarting to prevent rapid restart loops
        restartTimeoutRef.current = setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // If start fails, try again after a longer delay
              if (e.message?.includes("already started")) {
                // Already running, that's fine
              } else {
                console.error("Failed to restart recognition:", e);
                // Try one more time after a delay
                setTimeout(() => {
                  if (isListeningRef.current && recognitionRef.current) {
                    try {
                      recognitionRef.current.start();
                    } catch (e2) {
                      console.error("Second restart attempt failed:", e2);
                    }
                  }
                }, 500);
              }
            }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore stop errors on cleanup
        }
      }
    };
  }, []); // Only run once on mount

  // Cleanup audio visualization on unmount
  useEffect(() => {
    return () => {
      stopAudioVisualization();
    };
  }, [stopAudioVisualization]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) return;

    setError(null);
    setTranscript("");
    setInterimTranscript("");
    
    try {
      // Update ref before starting
      isListeningRef.current = true;
      setIsListening(true);
      
      recognitionRef.current.start();
      await startAudioVisualization();
    } catch (e) {
      console.error("Start error:", e);
      if (e.message?.includes("already started")) {
        // Already running, just update state
        setIsListening(true);
      } else {
        setError("Failed to start voice recognition. Please try again.");
        isListeningRef.current = false;
        setIsListening(false);
      }
    }
  }, [startAudioVisualization]);

  const stopListening = useCallback(() => {
    // Update ref first to prevent restart in onend
    isListeningRef.current = false;
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop errors
      }
    }
    setIsListening(false);
    stopAudioVisualization();
  }, [stopAudioVisualization]);

  const handleDone = () => {
    stopListening();
    const finalText = (transcript + " " + interimTranscript).trim();
    if (finalText) {
      onTranscript(finalText);
    }
    onClose?.();
  };

  const handleCancel = () => {
    stopListening();
    onClose?.();
  };

  // Auto-start listening when component mounts
  useEffect(() => {
    if (isSupported && !disabled) {
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSupported, disabled, startListening]);

  if (!isSupported) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("voiceNotSupported")}</h2>
          <p className="text-muted-foreground mb-6">
            Your browser doesn't support voice input. Please use the text input instead.
          </p>
          <Button onClick={onClose} variant="outline">
            <Keyboard className="h-4 w-4 mr-2" />
            {t("useTextInput")}
          </Button>
        </div>
      </div>
    );
  }

  // Calculate ring sizes based on audio level
  const baseScale = 1;
  const activeScale = 1 + audioLevel * 0.5;
  const ring1Scale = isListening ? baseScale + audioLevel * 0.3 : baseScale;
  const ring2Scale = isListening ? baseScale + audioLevel * 0.5 : baseScale;
  const ring3Scale = isListening ? baseScale + audioLevel * 0.7 : baseScale;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/98 backdrop-blur-lg">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCancel}
        className="absolute top-6 right-6 h-12 w-12 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-lg px-6">
        {/* Status text */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isListening ? t("listeningTitle") : t("tapToSpeak")}
          </h1>
          {!isListening && (
            <p className="text-muted-foreground mt-2">
              {t("tapMicrophoneDesc")}
            </p>
          )}
        </div>

        {/* Animated listening circle */}
        <div className="relative flex items-center justify-center mb-12">
          {/* Outer rings - audio reactive */}
          <div
            className="absolute w-72 h-72 rounded-full border border-primary/10 transition-transform duration-100"
            style={{ transform: `scale(${ring3Scale})` }}
          />
          <div
            className="absolute w-56 h-56 rounded-full border border-primary/20 transition-transform duration-100"
            style={{ transform: `scale(${ring2Scale})` }}
          />
          <div
            className="absolute w-44 h-44 rounded-full border border-primary/30 transition-transform duration-100"
            style={{ transform: `scale(${ring1Scale})` }}
          />

          {/* Pulse rings when listening */}
          {isListening && (
            <>
              <div className="absolute w-36 h-36 rounded-full bg-primary/5 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute w-36 h-36 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
            </>
          )}

          {/* Glow effect */}
          {isListening && (
            <div
              className="absolute w-40 h-40 rounded-full blur-xl transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
                opacity: 0.3 + audioLevel * 0.5,
              }}
            />
          )}

          {/* Main button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            className={`
              relative z-10 w-32 h-32 rounded-full flex items-center justify-center
              transition-all duration-300 ease-out
              ${isListening
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary hover:bg-secondary/80 text-foreground"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={{
              transform: `scale(${isListening ? activeScale : 1})`,
            }}
          >
            {isListening ? (
              <MicOff className="h-12 w-12" />
            ) : (
              <Mic className="h-12 w-12" />
            )}
          </button>

          {/* Audio level indicator bars */}
          {isListening && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-20 flex items-end justify-center gap-1">
              {[...Array(7)].map((_, i) => {
                const height = Math.max(4, Math.min(32, audioLevel * 100 * Math.sin((i + 1) * 0.5)));
                return (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Transcript display */}
        <div className="w-full max-w-md min-h-[120px] mb-8">
          {(transcript || interimTranscript) ? (
            <div className="bg-secondary/30 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-lg leading-relaxed">
                <span className="text-foreground">{transcript}</span>
                {interimTranscript && (
                  <span className="text-muted-foreground italic"> {interimTranscript}</span>
                )}
              </p>
            </div>
          ) : isListening ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-muted-foreground mt-3 text-sm">{t("waitingForSpeech")}</p>
            </div>
          ) : null}
        </div>

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 text-destructive mb-8 p-4 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center gap-4 pb-8">
        <Button
          variant="outline"
          size="lg"
          onClick={handleCancel}
          className="px-8"
        >
          {t("cancel")}
        </Button>
        <Button
          size="lg"
          onClick={handleDone}
          disabled={!transcript && !interimTranscript}
          className="px-8"
        >
          {t("done")}
        </Button>
      </div>
    </div>
  );
}
