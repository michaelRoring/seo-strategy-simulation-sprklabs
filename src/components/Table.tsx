import { SimulationResults } from "../types";
import CustomTooltip from "./CustomTooltip";

interface TableSectionProps {
  results: SimulationResults;
  formatNumber: (num: number) => string;
  formatCurrency: (num: number) => string;
}

export default function TableSection({
  results,
  formatNumber,
  formatCurrency,
}: TableSectionProps) {
  const roiText =
    results.roiMonth !== -1
      ? `Month ${results.roiMonth}`
      : "Not achieved within 12 months";

  const roiClass = results.roiMonth !== -1 ? "text-green-500" : "text-red-500";

  return (
    <>
      <div className="w-11/12 mx-auto mt-8 py-6 sm:px-6 lg:px-8 bg-slate-50 rounded-2xl">
        <h1 className="font-semibold text-2xl">
          Estimated 12-Month Impact & ROI
        </h1>
        <div className="mt-2 mb-4">
          <span className="font-medium">Time to ROI:</span>{" "}
          <span className={`${roiClass} font-medium`}>{roiText}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Month
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  <CustomTooltip description="(Pages * MSV/Page * CTR %) * Ramp Factor">
                    EST. TRAFFIC
                  </CustomTooltip>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  <CustomTooltip description="Est. Traffic * Traffic-to-Lead CR %">
                    EST. LEADS (MQL)
                  </CustomTooltip>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  <CustomTooltip description="Est. Leads * Lead-to-Customer CR %">
                    EST. NEW CUSTOMERS
                  </CustomTooltip>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  <CustomTooltip description="Est. New Customers * CLTV">
                    EST. MONTHLY REVENUE ($)
                  </CustomTooltip>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  <CustomTooltip description="Running total of monthly revenue">
                    CUMULATIVE REVENUE ($)
                  </CustomTooltip>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  <CustomTooltip description="Running total of monthly expense. Formula: Monthly SEO Expense * Month #">
                    CUMULATIVE EXPENSE ($)
                  </CustomTooltip>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  <CustomTooltip description="Monthly Revenue - Monthly Expense">
                    MONTHLY PROFIT ($)
                  </CustomTooltip>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  <CustomTooltip description="Running total profit/loss. Formula: Cumulative Revenue - Cumulative Expense">
                    CUMULATIVE PROFIT ($)
                  </CustomTooltip>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.monthlyData.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {row.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatNumber(row.traffic)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatNumber(row.leads)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatNumber(row.customers)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(row.cumRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(row.cumExpense)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      row.profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(row.profit)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      row.cumProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(row.cumProfit)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  Total / End of Year 1
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatNumber(results.totalTraffic)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatNumber(results.totalLeads)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatNumber(results.totalCustomers)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatCurrency(results.totalMonthlyRevenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatCurrency(results.finalCumulativeRevenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatCurrency(results.finalCumulativeExpense)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    results.finalCumulativeProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(
                    results.finalCumulativeProfit -
                      results.finalCumulativeExpense +
                      results.finalCumulativeExpense / 12
                  )}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    results.finalCumulativeProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(results.finalCumulativeProfit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
