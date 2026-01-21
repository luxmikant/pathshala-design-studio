"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateLFAPDF, downloadPDF, type ExportOptions } from "@/lib/pdf-export";

interface ExportPDFButtonProps {
  projectId: string;
  projectTitle: string;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function ExportPDFButton({
  projectId,
  projectTitle,
  variant = "default",
  size = "md",
  showIcon = true,
  className = "",
}: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      // Fetch project data from API
      const response = await fetch(`/api/projects/${projectId}/export`);

      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }

      const { data: project } = await response.json();

      // Generate PDF
      const exportOptions: ExportOptions = {
        includeMetadata: true,
        includeStakeholders: true,
        includeIndicators: true,
        format: "a4",
      };

      const pdfBlob = await generateLFAPDF(project, exportOptions);

      // Download PDF
      const filename = `${projectTitle.replace(/[^a-z0-9]/gi, "_")}_LFA_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      downloadPDF(pdfBlob, filename);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError(err instanceof Error ? err.message : "Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleExport}
        disabled={isExporting}
        variant={variant}
        size={size}
        className={className}
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2">Generating PDF...</span>
          </>
        ) : (
          <>
            {showIcon && <Download className="h-4 w-4" />}
            <span className={showIcon ? "ml-2" : ""}>Export PDF</span>
          </>
        )}
      </Button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// Preview component for showing PDF metadata before export
export function ExportPDFDialog({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    includeMetadata: true,
    includeStakeholders: true,
    includeIndicators: true,
    format: "a4",
  });

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <FileText className="h-4 w-4 mr-2" />
        Export Options
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Export PDF Options</h2>

            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.includeMetadata}
                  onChange={(e) =>
                    setOptions({ ...options, includeMetadata: e.target.checked })
                  }
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Include project metadata</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.includeStakeholders}
                  onChange={(e) =>
                    setOptions({ ...options, includeStakeholders: e.target.checked })
                  }
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Include stakeholder matrix</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.includeIndicators}
                  onChange={(e) =>
                    setOptions({ ...options, includeIndicators: e.target.checked })
                  }
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Include M&E indicators</span>
              </label>

              <div>
                <label className="block text-sm font-medium mb-1">Paper Size</label>
                <select
                  value={options.format}
                  onChange={(e) =>
                    setOptions({ ...options, format: e.target.value as "a4" | "letter" })
                  }
                  className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <ExportPDFButton
                projectId={projectId}
                projectTitle={projectTitle}
                variant="default"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
