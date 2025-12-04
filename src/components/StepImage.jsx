"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * StepImage Component
 * Displays a visual doodle/illustration for a legal process step
 */
export default function StepImage({ stepText, stepNumber, className = "" }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateImage = async () => {
      if (!stepText) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/generate-step-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stepText,
            stepNumber: stepNumber || 1,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate image");
        }

        const data = await response.json();
        if (data.success && data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          throw new Error("Invalid response from API");
        }
      } catch (err) {
        console.error("Error loading step image:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [stepText, stepNumber]);

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary/30 rounded-lg ${className}`}
        style={{ minHeight: "150px" }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !imageUrl) {
    // Fallback: show step number in a circle
    return (
      <div
        className={`flex items-center justify-center bg-secondary/30 rounded-lg ${className}`}
        style={{ minHeight: "150px" }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">
            {stepNumber || "?"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={`Step ${stepNumber}: ${stepText}`}
        className="w-full h-auto object-contain"
        style={{ maxHeight: "200px" }}
      />
    </div>
  );
}

