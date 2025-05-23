import { useState } from "react";
import { jsPDF } from "jspdf";
import { SimulationInputs } from "@/types";

type NextStepsSectionProps = {
  inputs: SimulationInputs;
};

export default function NextStepsSection({ inputs }: NextStepsSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generatePdf = () => {
    setIsGenerating(true);

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      let yPos = margin;

      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.text("SEO Planner Results", margin, yPos);
      yPos += 15;

      // Add date
      const today = new Date();
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${today.toLocaleDateString()}`, margin, yPos);
      yPos += 10;

      // Add assumptions section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 51, 153);
      pdf.text("Assumptions", margin, yPos);
      // yPos += 8;

      // Try to get assumption values
      const assumptionLabels = [
        "Pages",
        "Avg. MSV",
        "Avg. CTR",
        "Traffic CR",
        "Lead CR",
        "CLTV",
        "Ramp Up",
        "Monthly Expense",
      ];

      // Extract values from inputs
      const inputValues: string[] = [];
      document.querySelectorAll('input[type="number"]').forEach((input) => {
        inputValues.push((input as HTMLInputElement).value);
      });

      // Create a table for assumptions
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      const cellWidth = contentWidth / 2;
      const cellHeight = 7;

      // Draw assumption table
      for (
        let i = 0;
        i < assumptionLabels.length && i < inputValues.length;
        i++
      ) {
        const rowY = yPos + i * cellHeight;

        // Draw cell borders
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(margin, rowY, cellWidth, cellHeight);
        pdf.rect(margin + cellWidth, rowY, cellWidth, cellHeight);

        // Add text
        pdf.text(assumptionLabels[i], margin + 2, rowY + 5);
        pdf.text(inputValues[i], margin + cellWidth + 2, rowY + 5);
      }

      yPos += assumptionLabels.length * cellHeight + 5; // Reduced from 10 to 5

      // Add new page if needed
      if (yPos > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        yPos = margin;
      }

      // Extract monthly data from table first (we'll need this for charts and tables)
      const monthlyData: string[][] = [];
      const tableRows = document.querySelectorAll("table tr");

      tableRows.forEach((row) => {
        const rowData: string[] = [];
        row.querySelectorAll("th, td").forEach((cell) => {
          rowData.push(cell.textContent?.trim() || "");
        });
        if (rowData.length > 0) {
          monthlyData.push(rowData);
        }
      });

      // Add new page if needed
      if (yPos > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        yPos = margin;
      }

      // Add charts section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 51, 153);
      pdf.text("Charts", margin, yPos);
      yPos += 8;

      // Create charts that match the ChartsSection.tsx

      // Extract data for charts from monthly data
      const months: string[] = [];
      const monthlyRevenue: number[] = [];
      const cumulativeRevenue: number[] = [];
      const monthlyExpense: number[] = [];
      const monthlyProfit: number[] = [];
      const cumulativeProfit: number[] = [];

      // Try to extract data from monthly data table
      if (monthlyData.length > 0) {
        // Find column indices for the data we need
        const headers = monthlyData[0].map((h) => h.toLowerCase());
        const monthIdx = headers.findIndex((h) => h.includes("month"));
        const revenueIdx = headers.findIndex(
          (h) => h.includes("revenue") && !h.includes("cum")
        );
        const cumRevenueIdx = headers.findIndex(
          (h) => h.includes("cumrevenue") || h.includes("cum revenue")
        );
        const expenseIdx = headers.findIndex(
          (h) => h.includes("expense") && !h.includes("cum")
        );
        const profitIdx = headers.findIndex(
          (h) => h.includes("profit") && !h.includes("cum")
        );
        const cumProfitIdx = headers.findIndex(
          (h) => h.includes("cumprofit") || h.includes("cum profit")
        );

        // Extract data from the table (skip the last row which is the total/end year 1)
        monthlyData.slice(1, -1).forEach((row) => {
          // Extract month
          if (monthIdx >= 0 && row[monthIdx]) {
            months.push(row[monthIdx]);
          } else {
            months.push(`Month ${months.length + 1}`);
          }

          // Extract revenue
          if (revenueIdx >= 0 && row[revenueIdx]) {
            const value = parseFloat(row[revenueIdx].replace(/[^0-9.-]/g, ""));
            monthlyRevenue.push(isNaN(value) ? 0 : value);
          } else {
            monthlyRevenue.push(0);
          }

          // Extract cumulative revenue
          if (cumRevenueIdx >= 0 && row[cumRevenueIdx]) {
            const value = parseFloat(
              row[cumRevenueIdx].replace(/[^0-9.-]/g, "")
            );
            cumulativeRevenue.push(isNaN(value) ? 0 : value);
          } else {
            // Calculate cumulative revenue if not available
            const prevCumRevenue =
              cumulativeRevenue.length > 0
                ? cumulativeRevenue[cumulativeRevenue.length - 1]
                : 0;
            const currRevenue = monthlyRevenue[monthlyRevenue.length - 1];
            cumulativeRevenue.push(prevCumRevenue + currRevenue);
          }

          // Extract expense
          if (expenseIdx >= 0 && row[expenseIdx]) {
            const value = parseFloat(row[expenseIdx].replace(/[^0-9.-]/g, ""));
            monthlyExpense.push(isNaN(value) ? 0 : value);
          } else {
            // Use cumulative expense divided by 12 if available
            const cumExpenseIdx = headers.findIndex(
              (h) => h.includes("cumexpense") || h.includes("cum expense")
            );
            if (cumExpenseIdx >= 0 && row[cumExpenseIdx]) {
              const cumValue = parseFloat(
                row[cumExpenseIdx].replace(/[^0-9.-]/g, "")
              );
              monthlyExpense.push(isNaN(cumValue) ? 0 : cumValue / 12);
            } else {
              monthlyExpense.push(0);
            }
          }

          // Extract profit
          if (profitIdx >= 0 && row[profitIdx]) {
            const value = parseFloat(row[profitIdx].replace(/[^0-9.-]/g, ""));
            monthlyProfit.push(isNaN(value) ? 0 : value);
          } else {
            // Calculate profit if not available
            const revenue = monthlyRevenue[monthlyRevenue.length - 1];
            const expense = monthlyExpense[monthlyExpense.length - 1];
            monthlyProfit.push(revenue - expense);
          }

          // Extract cumulative profit
          if (cumProfitIdx >= 0 && row[cumProfitIdx]) {
            const value = parseFloat(
              row[cumProfitIdx].replace(/[^0-9.-]/g, "")
            );
            cumulativeProfit.push(isNaN(value) ? 0 : value);
          } else {
            // Calculate cumulative profit if not available
            const prevCumProfit =
              cumulativeProfit.length > 0
                ? cumulativeProfit[cumulativeProfit.length - 1]
                : 0;
            const currProfit = monthlyProfit[monthlyProfit.length - 1];
            cumulativeProfit.push(prevCumProfit + currProfit);
          }
        });
      }

      // If we still don't have data, use placeholder data
      if (months.length === 0) {
        for (let i = 1; i <= 12; i++) {
          months.push(`Month ${i}`);
          monthlyRevenue.push(i * 200);
          cumulativeRevenue.push(i * (i + 1) * 100);
          monthlyExpense.push(200);
          monthlyProfit.push(i * 200 - 200);
          cumulativeProfit.push(i < 6 ? -1000 + i * 300 : -1000 + i * 500);
        }
      }

      // Function to draw the Revenue Growth Over Time chart
      const drawRevenueGrowthChart = (startY: number) => {
        // Add chart title
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Revenue Growth Over Time", margin, startY);
        startY += 8;

        const chartHeight = 60;
        const chartWidth = contentWidth;

        // Find max values for scaling
        const maxRevenue = Math.max(...monthlyRevenue);
        const maxCumRevenue = Math.max(...cumulativeRevenue);

        // Calculate scaling factors
        const barHeightFactor = (chartHeight * 0.7) / maxRevenue;
        const lineHeightFactor = (chartHeight * 0.7) / maxCumRevenue;

        // Draw chart background
        pdf.setDrawColor(240, 240, 240);
        pdf.setFillColor(248, 249, 250);
        pdf.rect(margin, startY, chartWidth, chartHeight, "FD");

        // Draw grid lines with y-axis labels
        pdf.setDrawColor(220, 220, 220);
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);

        // Calculate y-axis scale values with nice rounded numbers
        const yAxisValues = [];

        // Find a nice round number for the maximum value
        const maxValue = maxCumRevenue;
        const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
        const roundedMax = Math.ceil(maxValue / magnitude) * magnitude;

        for (let i = 0; i <= 4; i++) {
          const value = Math.round((roundedMax / 4) * i);
          yAxisValues.push(value);
        }

        // Draw grid lines and labels
        for (let i = 0; i <= 4; i++) {
          const lineY = startY + chartHeight - i * (chartHeight / 4);
          pdf.line(margin, lineY, margin + chartWidth, lineY);

          // Add y-axis label
          const formattedValue = yAxisValues[i].toLocaleString("en-US");
          pdf.text(`$${formattedValue}`, margin - 2, lineY, { align: "right" });
        }

        // Draw bars for monthly revenue
        const barCount = monthlyRevenue.length;
        const barWidth = (chartWidth / barCount) * 0.6;
        const barSpacing = (chartWidth / barCount) * 0.4;

        pdf.setFillColor(71, 85, 105); // #475569 (slate-600)
        monthlyRevenue.forEach((value, index) => {
          const barHeight = value * barHeightFactor;
          const barX =
            margin + index * (barWidth + barSpacing) + barSpacing / 2;
          const barY = startY + chartHeight - barHeight;
          pdf.rect(barX, barY, barWidth, barHeight, "F");
        });

        // Draw line for cumulative revenue
        pdf.setDrawColor(255, 128, 0); // #FF8000 (bright orange)
        pdf.setLineWidth(0.5);

        // Draw the line segments
        for (let i = 0; i < cumulativeRevenue.length - 1; i++) {
          const x1 =
            margin +
            i * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const y1 =
            startY + chartHeight - cumulativeRevenue[i] * lineHeightFactor;
          const x2 =
            margin +
            (i + 1) * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const y2 =
            startY + chartHeight - cumulativeRevenue[i + 1] * lineHeightFactor;

          pdf.line(x1, y1, x2, y2);
        }

        // Draw dots for the line and add value labels
        pdf.setFillColor(255, 128, 0); // #FF8000 (bright orange)
        cumulativeRevenue.forEach((value, index) => {
          const dotX =
            margin +
            index * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const dotY = startY + chartHeight - value * lineHeightFactor;

          // Draw dot
          pdf.circle(dotX, dotY, 1.5, "F");

          // Add value label for key points (first, last, and some in between)
          if (
            index === 0 ||
            index === cumulativeRevenue.length - 1 ||
            index % 3 === 0
          ) {
            // Format the value with commas for thousands
            const formattedValue = value.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            });

            pdf.setFontSize(7);
            pdf.setTextColor(255, 128, 0); // #FF8000 (bright orange)
            pdf.text(`$${formattedValue}`, dotX, dotY - 3, {
              align: "center",
            });
          }
        });

        // Add x-axis labels
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);

        // Only show a subset of labels to avoid overcrowding
        const labelInterval = Math.ceil(months.length / 4);
        for (let i = 0; i < months.length; i += labelInterval) {
          const labelX =
            margin +
            i * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          pdf.text(months[i], labelX, startY + chartHeight + 8, {
            align: "center",
          });
        }

        // Add legend
        const legendY = startY + chartHeight + 15;

        // Monthly Revenue legend
        pdf.setFillColor(71, 85, 105);
        pdf.rect(margin, legendY, 5, 5, "F");
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Monthly Revenue ($)", margin + 8, legendY + 4);

        // Cumulative Revenue legend
        pdf.setFillColor(255, 128, 0); // #FF8000 (bright orange)
        pdf.circle(margin + 80, legendY + 2.5, 2.5, "F");
        pdf.text("Cumulative Revenue ($)", margin + 88, legendY + 4);

        return legendY + 15; // Reduced from 10 to 5
      };

      // Function to draw the Profitability Analysis chart
      const drawProfitabilityChart = (startY: number) => {
        // Add chart title
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Profitability Analysis", margin, startY);
        startY += 8;

        const chartHeight = 60;
        const chartWidth = contentWidth;

        // Find max values for scaling
        const maxBarValue = Math.max(...monthlyRevenue, ...monthlyExpense);
        const maxLineValue = Math.max(
          Math.abs(Math.min(...monthlyProfit)),
          Math.abs(Math.min(...cumulativeProfit)),
          Math.max(...monthlyProfit),
          Math.max(...cumulativeProfit)
        );

        // Calculate scaling factors
        const barHeightFactor = (chartHeight * 0.4) / maxBarValue;
        const lineHeightFactor = (chartHeight * 0.4) / maxLineValue;

        // Draw chart background
        pdf.setDrawColor(240, 240, 240);
        pdf.setFillColor(248, 249, 250);
        pdf.rect(margin, startY, chartWidth, chartHeight, "FD");

        // Draw grid lines with y-axis labels
        pdf.setDrawColor(220, 220, 220);
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);

        // Find a nice round number for the maximum value
        const maxValue = maxLineValue;
        const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
        const roundedMax = Math.ceil(maxValue / magnitude) * magnitude;

        // Calculate step size for grid lines
        const step = roundedMax / 4;

        // Draw grid lines and labels
        // First draw the center line (0)
        const centerY = startY + chartHeight / 2;
        pdf.line(margin, centerY, margin + chartWidth, centerY);
        pdf.text("$0", margin - 2, centerY, { align: "right" });

        // Draw lines above center (positive values)
        for (let i = 1; i <= 4; i++) {
          const lineY = centerY - i * (chartHeight / 8);
          pdf.line(margin, lineY, margin + chartWidth, lineY);

          const value = step * i;
          const formattedValue = value.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          });
          pdf.text(`$${formattedValue}`, margin - 2, lineY, { align: "right" });
        }

        // Draw lines below center (negative values)
        for (let i = 1; i <= 4; i++) {
          const lineY = centerY + i * (chartHeight / 8);
          pdf.line(margin, lineY, margin + chartWidth, lineY);

          const value = -step * i;
          const formattedValue = value.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          });
          pdf.text(`$${formattedValue}`, margin - 2, lineY, { align: "right" });
        }

        // Draw center line (already defined above)
        pdf.setDrawColor(180, 180, 180);
        pdf.line(margin, centerY, margin + chartWidth, centerY);

        // Draw bars
        const barCount = months.length;
        const barWidth = (chartWidth / barCount) * 0.6;
        const barSpacing = (chartWidth / barCount) * 0.4;
        const barGroupWidth = barWidth / 2;

        // Draw revenue bars
        pdf.setFillColor(71, 85, 105); // #475569 (slate-600)
        monthlyRevenue.forEach((value, index) => {
          const barHeight = value * barHeightFactor;
          const barX =
            margin + index * (barWidth + barSpacing) + barSpacing / 2;
          const barY = centerY - barHeight;
          pdf.rect(barX, barY, barGroupWidth, barHeight, "F");
        });

        // Draw expense bars with a darker gray color
        pdf.setFillColor(100, 116, 139); // #64748B (slate-500) - darker than previous color
        monthlyExpense.forEach((value, index) => {
          const barHeight = value * barHeightFactor;
          const barX =
            margin +
            index * (barWidth + barSpacing) +
            barSpacing / 2 +
            barGroupWidth;
          const barY = centerY - barHeight;
          pdf.rect(barX, barY, barGroupWidth, barHeight, "F");
        });

        // Draw monthly profit line
        pdf.setDrawColor(255, 128, 0); // #FF8000 (orange)
        pdf.setLineWidth(0.5);

        for (let i = 0; i < monthlyProfit.length - 1; i++) {
          const x1 =
            margin +
            i * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const y1 = centerY - monthlyProfit[i] * lineHeightFactor;
          const x2 =
            margin +
            (i + 1) * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const y2 = centerY - monthlyProfit[i + 1] * lineHeightFactor;

          pdf.line(x1, y1, x2, y2);
        }

        // Draw dots for monthly profit and add value labels
        pdf.setFillColor(255, 128, 0); // #FF8000 (orange)
        monthlyProfit.forEach((value, index) => {
          const dotX =
            margin +
            index * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const dotY = centerY - value * lineHeightFactor;

          // Draw dot
          pdf.circle(dotX, dotY, 1.5, "F");

          // Add value label for key points
          if (
            index === 0 ||
            index === monthlyProfit.length - 1 ||
            index % 3 === 0
          ) {
            // Format the value with commas for thousands
            const formattedValue = value.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            });

            pdf.setFontSize(7);
            pdf.setTextColor(255, 128, 0);
            pdf.text(`$${formattedValue}`, dotX, dotY - 3, {
              align: "center",
            });
          }
        });

        // Draw cumulative profit line
        pdf.setDrawColor(0, 71, 255); // #0047FF (blue)
        pdf.setLineWidth(0.5);

        for (let i = 0; i < cumulativeProfit.length - 1; i++) {
          const x1 =
            margin +
            i * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const y1 = centerY - cumulativeProfit[i] * lineHeightFactor;
          const x2 =
            margin +
            (i + 1) * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const y2 = centerY - cumulativeProfit[i + 1] * lineHeightFactor;

          pdf.line(x1, y1, x2, y2);
        }

        // Draw dots for cumulative profit and add value labels
        pdf.setFillColor(0, 71, 255); // #0047FF (blue)
        cumulativeProfit.forEach((value, index) => {
          const dotX =
            margin +
            index * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          const dotY = centerY - value * lineHeightFactor;

          // Draw dot
          pdf.circle(dotX, dotY, 1.5, "F");

          // Add value label for key points
          if (
            index === 0 ||
            index === cumulativeProfit.length - 1 ||
            index % 3 === 0
          ) {
            // Format the value with commas for thousands
            const formattedValue = value.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            });

            pdf.setFontSize(7);
            pdf.setTextColor(0, 71, 255);
            pdf.text(`$${formattedValue}`, dotX, dotY - 3, {
              align: "center",
            });
          }
        });

        // Add x-axis labels
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);

        // Only show a subset of labels to avoid overcrowding
        const labelInterval = Math.ceil(months.length / 4);
        for (let i = 0; i < months.length; i += labelInterval) {
          const labelX =
            margin +
            i * (barWidth + barSpacing) +
            barWidth / 2 +
            barSpacing / 2;
          pdf.text(months[i], labelX, startY + chartHeight + 8, {
            align: "center",
          });
        }

        // Add legend
        const legendY = startY + chartHeight + 15;

        // Monthly Revenue legend
        pdf.setFillColor(71, 85, 105);
        pdf.rect(margin, legendY, 5, 5, "F");
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Monthly Revenue ($)", margin + 8, legendY + 4);

        // Monthly Expense legend
        pdf.setFillColor(100, 116, 139); // #64748B (slate-500) - darker gray to match the bars
        pdf.rect(margin + 80, legendY, 5, 5, "F");
        pdf.text("Monthly Expense ($)", margin + 88, legendY + 4);

        // Monthly Profit legend
        pdf.setFillColor(255, 128, 0);
        pdf.circle(margin, legendY + 12.5, 2.5, "F");
        pdf.text("Monthly Profit ($)", margin + 8, legendY + 14);

        // Cumulative Profit legend
        pdf.setFillColor(0, 71, 255);
        pdf.circle(margin + 80, legendY + 12.5, 2.5, "F");
        pdf.text("Cumulative Profit ($)", margin + 88, legendY + 14);

        return legendY + 20;
      };

      // Draw Revenue Growth chart
      yPos = drawRevenueGrowthChart(yPos);

      // Add new page if needed
      if (yPos > pdf.internal.pageSize.getHeight() - 100) {
        pdf.addPage();
        yPos = margin;
      }

      // Draw Profitability Analysis chart
      yPos = drawProfitabilityChart(yPos);

      // Add some spacing after charts
      yPos += 20;

      // Add new page if needed
      if (yPos > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        yPos = margin;
      }

      // Add monthly data section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 51, 153);
      pdf.text("Monthly Data", margin, yPos);
      yPos += 8;

      // Draw monthly data table
      if (monthlyData.length > 0) {
        const columnCount = monthlyData[0].length;

        // Adjust column widths based on content
        const columnWidths: number[] = [];
        const totalWidth = contentWidth;

        // Set default column widths - narrower for simple columns, wider for complex ones
        for (let i = 0; i < columnCount; i++) {
          const header = monthlyData[0][i] || "";
          if (header.toLowerCase().includes("month")) {
            columnWidths.push(totalWidth * 0.08); // Month column - narrow
          } else if (
            header.toLowerCase().includes("traffic") ||
            header.toLowerCase().includes("leads") ||
            header.toLowerCase().includes("new c")
          ) {
            columnWidths.push(totalWidth * 0.09); // Simple numeric columns - narrow
          } else {
            columnWidths.push(totalWidth * 0.12); // Revenue/expense columns - wider
          }
        }

        // Adjust to ensure total width matches content width
        const totalCalculatedWidth = columnWidths.reduce(
          (sum, width) => sum + width,
          0
        );
        const adjustmentFactor = totalWidth / totalCalculatedWidth;
        columnWidths.forEach((width, i) => {
          columnWidths[i] = width * adjustmentFactor;
        });

        // Draw header row with increased height for wrapping
        const headerHeight = cellHeight * 1.5; // Taller header row
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, yPos, contentWidth, headerHeight, "F");

        let xPos = margin;
        for (let i = 0; i < columnCount; i++) {
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(xPos, yPos, columnWidths[i], headerHeight);

          if (monthlyData[0][i]) {
            pdf.setFontSize(7); // Smaller font for headers
            pdf.setTextColor(0, 0, 0);

            // Split long headers into multiple lines
            const header = monthlyData[0][i];
            const maxWidth = columnWidths[i] - 4;

            pdf.text(header, xPos + 2, yPos + 5, {
              maxWidth: maxWidth,
              align: "left",
            });
          }
          xPos += columnWidths[i];
        }

        yPos += headerHeight;

        // Draw data rows
        for (let rowIndex = 1; rowIndex < monthlyData.length; rowIndex++) {
          // Add new page if needed
          if (yPos > pdf.internal.pageSize.getHeight() - 20) {
            pdf.addPage();
            yPos = margin;

            // Redraw header on new page
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, yPos, contentWidth, headerHeight, "F");

            let xPos = margin;
            for (let i = 0; i < columnCount; i++) {
              pdf.setDrawColor(200, 200, 200);
              pdf.rect(xPos, yPos, columnWidths[i], headerHeight);

              if (monthlyData[0][i]) {
                pdf.setFontSize(7);
                pdf.setTextColor(0, 0, 0);
                pdf.text(monthlyData[0][i], xPos + 2, yPos + 5, {
                  maxWidth: columnWidths[i] - 4,
                  align: "left",
                });
              }
              xPos += columnWidths[i];
            }

            yPos += headerHeight;
          }

          const row = monthlyData[rowIndex];
          let xPos = margin;
          for (let colIndex = 0; colIndex < columnCount; colIndex++) {
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(xPos, yPos, columnWidths[colIndex], cellHeight);

            if (row[colIndex]) {
              pdf.setFontSize(7); // Smaller font for data too
              pdf.setTextColor(0, 0, 0);
              pdf.text(row[colIndex], xPos + 2, yPos + 5, {
                maxWidth: columnWidths[colIndex] - 4,
                align: "left",
              });
            }
            xPos += columnWidths[colIndex];
          }

          yPos += cellHeight;
        }
      }

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        "Generated from SEO Planner - For interactive results, please use the web application.",
        margin,
        pdf.internal.pageSize.getHeight() - 10
      );

      // Save the PDF
      pdf.save("seo-planner-results.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, val]) => {
      params.set(key, val.toString());
    });
    const shareableUrl = `${window.location.origin}${
      window.location.pathname
    }?${params.toString()}`;

    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div className="w-11/12 mx-auto mt-8 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Next Steps & Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Get Your Free SEO Guide */}
        <div className="bg-slate-50 p-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-3">Get Your Free SEO Guide</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter your work email to receive a comprehensive guide on
            Programmatic SEO.
          </p>
          <div className="mb-4">
            <input
              type="email"
              placeholder="your.email@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Send Guide
          </button>
        </div>

        {/* Share Your Simulation */}
        <div className="bg-slate-50 p-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-3">Share Your Simulation</h3>
          <p className="text-sm text-gray-600 mb-4">
            Copy a unique link to share this simulation with your current
            settings.
          </p>
          <button
            className={`w-full flex justify-center items-center py-2 px-4 rounded-md transition-colors ${
              isCopied
                ? "bg-green-600 text-white cursor-default"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={handleCopyLink}
            disabled={isCopied}
          >
            {isCopied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                </svg>
                Link Copied!
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Copy Share Link
              </>
            )}
          </button>
        </div>

        {/* Download Results */}
        <div className="bg-slate-50 p-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-3">Download Results</h3>
          <p className="text-sm text-gray-600 mb-4">
            Save a PDF summary of the simulation results and charts.
          </p>
          <button
            className="w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={generatePdf}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download PDF
              </>
            )}
          </button>
          {isGenerating && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              This may take a few moments...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
