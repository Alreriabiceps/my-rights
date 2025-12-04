"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/LanguageContext";
import { Upload, X, FileText, Image, File, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function FileUpload({ onFilesChange, disabled = false }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useLanguage();

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return Image;
    if (type === "application/pdf") return FileText;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return t("fileTypeNotSupported");
    }
    if (file.size > MAX_FILE_SIZE) {
      return t("fileTooLarge");
    }
    return null;
  };

  const addFiles = useCallback(
    (newFiles) => {
      setError(null);
      const validFiles = [];

      for (const file of newFiles) {
        const error = validateFile(file);
        if (error) {
          setError(error);
          continue;
        }
        // Check for duplicates
        if (!files.some((f) => f.name === file.name && f.size === file.size)) {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
      }
    },
    [files, onFilesChange]
  );

  const removeFile = useCallback(
    (index) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles, disabled]
  );

  const handleFileSelect = useCallback(
    (e) => {
      if (e.target.files) {
        addFiles(Array.from(e.target.files));
      }
    },
    [addFiles]
  );

  return (
    <Card className={isDragging ? "border-primary border-dashed" : ""}>
      <CardContent className="py-4">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />

          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">{t("dropFiles")}</p>
          <p className="text-xs text-muted-foreground">
            {t("supportedFormats")}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{t("attachedFiles")}</h4>
              <Badge variant="outline">{files.length}</Badge>
            </div>
            <div className="space-y-2">
              {files.map((file, index) => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-background">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      disabled={disabled}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
