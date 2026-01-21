"use client";

import { Check, CloudOff, Loader2, AlertCircle } from "lucide-react";
import { formatLastSaved } from "@/hooks/useAutoSave";

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: Error | null;
  className?: string;
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  saveError,
  className = "",
}: AutoSaveIndicatorProps) {
  if (isSaving) {
    return (
      <div
        className={`flex items-center space-x-2 text-sm text-slate-600 ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
        <span>Saving...</span>
      </div>
    );
  }

  if (saveError) {
    return (
      <div
        className={`flex items-center space-x-2 text-sm text-red-600 ${className}`}
        title={saveError.message}
      >
        <AlertCircle className="h-4 w-4" />
        <span>Save failed</span>
      </div>
    );
  }

  if (!lastSaved) {
    return (
      <div
        className={`flex items-center space-x-2 text-sm text-slate-400 ${className}`}
      >
        <CloudOff className="h-4 w-4" />
        <span>Not saved</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center space-x-2 text-sm text-green-600 ${className}`}
      title={lastSaved.toLocaleString("en-IN")}
    >
      <Check className="h-4 w-4" />
      <span>{formatLastSaved(lastSaved)}</span>
    </div>
  );
}
