import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";

export interface AutoSaveOptions {
  delay?: number; // Delay in milliseconds before saving (default: 2000)
  onSave: (data: any) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAutoSave<T>(
  data: T,
  options: AutoSaveOptions
) {
  const {
    delay = 2000,
    onSave,
    onSuccess,
    onError,
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);

  // Keep track of the previous data
  const previousDataRef = useRef<T>(data);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (dataToSave: T) => {
      try {
        setIsSaving(true);
        setSaveError(null);
        
        await onSave(dataToSave);
        
        setLastSaved(new Date());
        onSuccess?.();
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Save failed");
        setSaveError(err);
        onError?.(err);
      } finally {
        setIsSaving(false);
      }
    }, delay),
    [delay, onSave, onSuccess, onError]
  );

  // Trigger save when data changes
  useEffect(() => {
    // Skip on initial mount
    if (JSON.stringify(previousDataRef.current) === JSON.stringify(data)) {
      return;
    }

    // Update reference
    previousDataRef.current = data;

    // Trigger debounced save
    debouncedSave(data);

    // Cleanup
    return () => {
      debouncedSave.cancel();
    };
  }, [data, debouncedSave]);

  // Manual save function (bypass debounce)
  const saveNow = useCallback(async () => {
    debouncedSave.cancel(); // Cancel pending debounced save
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      await onSave(data);
      
      setLastSaved(new Date());
      onSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Save failed");
      setSaveError(err);
      onError?.(err);
    } finally {
      setIsSaving(false);
    }
  }, [data, onSave, onSuccess, onError, debouncedSave]);

  return {
    isSaving,
    lastSaved,
    saveError,
    saveNow,
  };
}

// Helper function to format last saved time
export function formatLastSaved(date: Date | null): string {
  if (!date) return "Not saved";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 10) return "Saved just now";
  if (diffSec < 60) return `Saved ${diffSec}s ago`;
  if (diffMin < 60) return `Saved ${diffMin}m ago`;
  
  return `Saved at ${date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
