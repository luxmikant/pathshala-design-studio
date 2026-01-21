import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { LfaProject, LfaComponent } from "@/types";

export interface ExportOptions {
  includeMetadata?: boolean;
  includeStakeholders?: boolean;
  includeIndicators?: boolean;
  format?: "a4" | "letter";
}

export async function generateLFAPDF(
  project: LfaProject & {
    components: LfaComponent[];
    organization: { name: string };
    createdBy: { name: string };
  },
  options: ExportOptions = {}
): Promise<Blob> {
  const {
    includeMetadata = true,
    includeStakeholders = true,
    includeIndicators = true,
    format = "a4",
  } = options;

  // Initialize PDF with proper formatting
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: format,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Color scheme
  const colors = {
    primary: [20, 184, 166], // Teal
    secondary: [139, 92, 246], // Purple
    accent: [249, 115, 22], // Orange
    text: [30, 41, 59], // Slate 800
    lightGray: [148, 163, 184], // Slate 400
  };

  // Helper function to add page header
  function addHeader() {
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, pageWidth, 15, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text("Pathshala Design Studio", margin, 10);
    pdf.setTextColor(...colors.text);
  }

  // Helper function to add page footer
  function addFooter(pageNumber: number) {
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.lightGray);
    pdf.text(
      `Page ${pageNumber}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    pdf.text(
      new Date().toLocaleDateString("en-IN"),
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" }
    );
  }

  // Helper function to check if new page is needed
  function checkPageBreak(requiredSpace: number): number {
    if (yPosition + requiredSpace > pageHeight - 30) {
      pdf.addPage();
      addHeader();
      return margin + 20; // Reset to top of content area
    }
    return yPosition;
  }

  // Add first page header
  addHeader();
  yPosition = 25;

  // ===== COVER PAGE =====
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...colors.primary);
  yPosition = 60;
  pdf.text("Logical Framework Approach", pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 15;
  pdf.setFontSize(18);
  pdf.setTextColor(...colors.text);
  pdf.text(project.title, pageWidth / 2, yPosition, { align: "center" });

  yPosition += 30;
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...colors.lightGray);

  if (includeMetadata) {
    const metadata = [
      `Organization: ${project.organization.name}`,
      `Theme: ${project.theme.replace("_", " ")}`,
      `Status: ${project.status}`,
      `Created by: ${project.createdBy.name}`,
      `Created on: ${new Date(project.createdAt).toLocaleDateString("en-IN")}`,
      `Last updated: ${new Date(project.updatedAt).toLocaleDateString("en-IN")}`,
    ];

    metadata.forEach((line) => {
      pdf.text(line, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 7;
    });
  }

  // Add decorative element
  pdf.setDrawColor(...colors.primary);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition + 10, pageWidth - margin, yPosition + 10);

  addFooter(1);

  // ===== TABLE OF CONTENTS =====
  pdf.addPage();
  addHeader();
  yPosition = 30;

  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...colors.primary);
  pdf.text("Table of Contents", margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...colors.text);

  const tocItems = [
    "1. Project Overview",
    "2. Problem Definition & Context",
    "3. Stakeholder Analysis",
    "4. Intervention Strategy",
    "5. Monitoring & Evaluation Framework",
    "6. Risk & Assumptions",
  ];

  tocItems.forEach((item, index) => {
    pdf.text(item, margin + 5, yPosition);
    yPosition += 8;
  });

  addFooter(2);

  // ===== COMPONENT SECTIONS =====
  let pageNumber = 3;

  // Group components by level
  const componentsByLevel = project.components.reduce((acc, component) => {
    const level = component.questLevel || 1;
    if (!acc[level]) acc[level] = [];
    acc[level].push(component);
    return acc;
  }, {} as Record<number, LfaComponent[]>);

  const levelTitles: Record<number, string> = {
    1: "Understanding the Landscape",
    2: "Stakeholder Analysis",
    3: "Designing Strategies",
    4: "Monitoring & Evaluation",
    5: "Risk & Assumptions",
  };

  // Iterate through each level
  Object.entries(componentsByLevel)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([level, components]) => {
      pdf.addPage();
      addHeader();
      yPosition = 30;

      // Level title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...colors.primary);
      pdf.text(`${levelTitles[Number(level)]}`, margin, yPosition);
      yPosition += 12;

      pdf.setDrawColor(...colors.primary);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Component details
      components.forEach((component) => {
        yPosition = checkPageBreak(40);

        // Component title
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...colors.secondary);
        pdf.text(
          component.type.replace(/_/g, " ").toUpperCase(),
          margin,
          yPosition
        );
        yPosition += 10;

        // Component content
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...colors.text);

        if (component.content && typeof component.content === "object") {
          const content = component.content as Record<string, any>;

          Object.entries(content).forEach(([key, value]) => {
            yPosition = checkPageBreak(15);

            // Field label
            pdf.setFont("helvetica", "bold");
            const label = key.replace(/([A-Z])/g, " $1").trim();
            pdf.text(
              `${label.charAt(0).toUpperCase() + label.slice(1)}:`,
              margin + 5,
              yPosition
            );
            yPosition += 6;

            // Field value
            pdf.setFont("helvetica", "normal");
            if (Array.isArray(value)) {
              value.forEach((item) => {
                yPosition = checkPageBreak(10);
                const itemText =
                  typeof item === "object" ? JSON.stringify(item, null, 2) : String(item);
                const lines = pdf.splitTextToSize(itemText, pageWidth - margin * 2 - 10);
                pdf.text(`• ${lines[0]}`, margin + 10, yPosition);
                yPosition += 5;
                for (let i = 1; i < lines.length; i++) {
                  yPosition = checkPageBreak(5);
                  pdf.text(`  ${lines[i]}`, margin + 10, yPosition);
                  yPosition += 5;
                }
              });
            } else if (typeof value === "object") {
              const objText = JSON.stringify(value, null, 2);
              const lines = pdf.splitTextToSize(objText, pageWidth - margin * 2 - 10);
              lines.forEach((line: string) => {
                yPosition = checkPageBreak(5);
                pdf.text(line, margin + 10, yPosition);
                yPosition += 5;
              });
            } else {
              const valueText = String(value);
              const lines = pdf.splitTextToSize(valueText, pageWidth - margin * 2 - 10);
              lines.forEach((line: string) => {
                yPosition = checkPageBreak(5);
                pdf.text(line, margin + 10, yPosition);
                yPosition += 5;
              });
            }
            yPosition += 3;
          });
        }

        yPosition += 8;
      });

      addFooter(pageNumber);
      pageNumber++;
    });

  // ===== STAKEHOLDER TABLE (if included) =====
  if (includeStakeholders) {
    const stakeholderComponents = project.components.filter(
      (c) => c.type === "STAKEHOLDER_ANALYSIS"
    );

    if (stakeholderComponents.length > 0) {
      pdf.addPage();
      addHeader();
      yPosition = 30;

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...colors.primary);
      pdf.text("Stakeholder Matrix", margin, yPosition);
      yPosition += 15;

      const tableData: any[][] = [];
      stakeholderComponents.forEach((component) => {
        if (component.content && typeof component.content === "object") {
          const content = component.content as any;
          if (content.stakeholders && Array.isArray(content.stakeholders)) {
            content.stakeholders.forEach((stakeholder: any) => {
              tableData.push([
                stakeholder.name || "-",
                stakeholder.role || "-",
                stakeholder.influence || "-",
                stakeholder.interest || "-",
                stakeholder.practiceChange || "-",
              ]);
            });
          }
        }
      });

      if (tableData.length > 0) {
        autoTable(pdf, {
          head: [["Name", "Role", "Influence", "Interest", "Practice Change"]],
          body: tableData,
          startY: yPosition,
          theme: "striped",
          headStyles: {
            fillColor: colors.primary,
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          alternateRowStyles: {
            fillColor: [241, 245, 249], // Slate 100
          },
        });
      }

      addFooter(pageNumber);
      pageNumber++;
    }
  }

  // ===== INDICATOR TABLE (if included) =====
  if (includeIndicators) {
    const indicatorComponents = project.components.filter(
      (c) => c.type === "OUTCOME_DEFINITION" || c.type === "OUTPUT_DEFINITION"
    );

    if (indicatorComponents.length > 0) {
      pdf.addPage();
      addHeader();
      yPosition = 30;

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...colors.primary);
      pdf.text("M&E Framework - Indicators", margin, yPosition);
      yPosition += 15;

      const tableData: any[][] = [];
      indicatorComponents.forEach((component) => {
        if (component.content && typeof component.content === "object") {
          const content = component.content as any;
          if (content.indicators && Array.isArray(content.indicators)) {
            content.indicators.forEach((indicator: any) => {
              tableData.push([
                indicator.name || "-",
                indicator.type || "-",
                indicator.baseline || "-",
                indicator.target || "-",
                indicator.frequency || "-",
              ]);
            });
          }
        }
      });

      if (tableData.length > 0) {
        autoTable(pdf, {
          head: [["Indicator", "Type", "Baseline", "Target", "Frequency"]],
          body: tableData,
          startY: yPosition,
          theme: "striped",
          headStyles: {
            fillColor: colors.secondary,
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          alternateRowStyles: {
            fillColor: [245, 243, 255], // Purple 50
          },
        });
      }

      addFooter(pageNumber);
    }
  }

  // Return PDF as Blob
  return pdf.output("blob");
}

// Export function to trigger download
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
