import { useState, useEffect } from "react";
import Assumptions from "./components/Assumptions";
import ChartsSection from "./components/ChartsSection";
import Header from "./components/Header";
import NextStepsSection from "./components/NextStepsSection";
import { HeroUIProvider } from "@heroui/react";
import TableSection from "./components/Table";
import { SimulationInputs, SimulationResults, MonthlyData } from "./types";

// Helper functions for formatting numbers
const formatNumber = (num: number) => {
  if (Math.abs(num) < 1 && num !== 0) {
    return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatCurrency = (num: number) => {
  const roundedNum = num.toFixed(0);
  return "$" + roundedNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function App() {
  // const [simulationRun, setSimulationRun] = useState(false);
  const [inputs, setInputs] = useState<SimulationInputs>({
    pSEO_pages: 500,
    avg_msv: 50,
    avg_ctr: 3,
    traffic_cr: 2,
    lead_cr: 10,
    cltv: 1500,
    ramp_up: 6, // Default ramp up period
    monthly_expense: 2000,
  });
  // Initialize results with default values so sections are always displayed
  const [results, setResults] = useState<SimulationResults>({
    monthlyData: Array(12)
      .fill(0)
      .map((_, index) => ({
        month: `Month ${index + 1}`,
        traffic: 0,
        leads: 0,
        customers: 0,
        revenue: 0,
        cumRevenue: 0,
        cumExpense: 0,
        profit: 0,
        cumProfit: 0,
      })),
    totalTraffic: 0,
    totalLeads: 0,
    totalCustomers: 0,
    totalMonthlyRevenue: 0,
    finalCumulativeRevenue: 0,
    finalCumulativeExpense: 0,
    finalCumulativeProfit: 0,
    roiMonth: -1,
  });

  // Load inputs from URL on component mount and run initial simulation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let paramsFound = false;
    const newInputs = { ...inputs };

    Object.keys(newInputs).forEach((key) => {
      if (params.has(key)) {
        const value = parseFloat(params.get(key) || "0");
        newInputs[key as keyof SimulationInputs] = value;
        paramsFound = true;
      }
    });

    if (paramsFound) {
      setInputs(newInputs);
    }

    // Always run simulation on mount with current inputs
    runSimulation(paramsFound ? newInputs : inputs);
  }, []);

  const handleInputChange = (name: keyof SimulationInputs, value: number) => {
    const newInputs = {
      ...inputs,
      [name]: value,
    };
    setInputs(newInputs);
    // Run simulation automatically when inputs change
    runSimulation(newInputs);
  };

  const runSimulation = (simulationInputs: SimulationInputs = inputs) => {
    // Convert percentage inputs to decimal
    const processedInputs = {
      ...simulationInputs,
      avg_ctr: simulationInputs.avg_ctr / 100,
      traffic_cr: simulationInputs.traffic_cr / 100,
      lead_cr: simulationInputs.lead_cr / 100,
    };

    // Calculate max potential values
    const max_monthly_msv =
      processedInputs.pSEO_pages * processedInputs.avg_msv;
    const max_monthly_traffic = max_monthly_msv * processedInputs.avg_ctr;
    const max_monthly_leads = max_monthly_traffic * processedInputs.traffic_cr;
    const max_monthly_customers = max_monthly_leads * processedInputs.lead_cr;
    const max_monthly_revenue = max_monthly_customers * processedInputs.cltv;

    const monthlyData: MonthlyData[] = [];
    let cumulative_revenue = 0,
      cumulative_expense = 0,
      cumulative_profit = 0;
    let total_traffic = 0,
      total_leads = 0,
      total_customers = 0,
      total_monthly_revenue_sum = 0;
    let roi_month = -1;

    for (let month = 1; month <= 12; month++) {
      const ramp_factor = Math.min(1, month / processedInputs.ramp_up);

      const monthly_traffic = max_monthly_traffic * ramp_factor;
      const monthly_leads = max_monthly_leads * ramp_factor;
      const monthly_customers = max_monthly_customers * ramp_factor;
      const monthly_revenue = max_monthly_revenue * ramp_factor;
      const current_monthly_expense = processedInputs.monthly_expense;
      const monthly_profit = monthly_revenue - current_monthly_expense;

      cumulative_revenue += monthly_revenue;
      cumulative_expense += current_monthly_expense;
      cumulative_profit = cumulative_revenue - cumulative_expense;

      total_traffic += monthly_traffic;
      total_leads += monthly_leads;
      total_customers += monthly_customers;
      total_monthly_revenue_sum += monthly_revenue;

      if (roi_month === -1 && cumulative_profit >= 0) {
        roi_month = month;
      }

      monthlyData.push({
        month: `Month ${month}`,
        traffic: monthly_traffic,
        leads: monthly_leads,
        customers: monthly_customers,
        revenue: monthly_revenue,
        cumRevenue: cumulative_revenue,
        cumExpense: cumulative_expense,
        profit: monthly_profit,
        cumProfit: cumulative_profit,
      });
    }

    const simulationResults: SimulationResults = {
      monthlyData,
      totalTraffic: total_traffic,
      totalLeads: total_leads,
      totalCustomers: total_customers,
      totalMonthlyRevenue: total_monthly_revenue_sum,
      finalCumulativeRevenue: cumulative_revenue,
      finalCumulativeExpense: cumulative_expense,
      finalCumulativeProfit: cumulative_profit,
      roiMonth: roi_month,
    };

    setResults(simulationResults);
    // setSimulationRun(true);
  };

  return (
    <>
      <HeroUIProvider>
        <div className="flex flex-col min-h-screen p-6 bg-blue-50">
          <div className="bg-white rounded-2xl mx-auto w-11/12 min-h-screen">
            <Header />
            <Assumptions inputs={inputs} onInputChange={handleInputChange} />
            <ChartsSection monthlyData={results.monthlyData} />
            <TableSection
              results={results}
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
            />
            <NextStepsSection inputs={inputs} />
            <footer className="mt-12 text-center text-sm text-gray-500">
              <p>
                <span className="font-semibold">Sprklabs</span> © 2025
              </p>
              <div className="flex gap-2 items-center justify-center">
                <p className="mt-1">In partnership with </p>
                <a
                  href="https://www.devhaus.com.sg/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://content.partnerpage.io/eyJidWNrZXQiOiJwYXJ0bmVycGFnZS5wcm9kIiwia2V5IjoibWVkaWEvY29udGFjdF9pbWFnZXMvZmY2MmIwYmQtZTRkMS00MzZmLWExOWMtMWVlYzEzNmEzMDgzLzk0ZjZkMzQ1LTAzNGMtNDVmMi04MmJlLTZkMTI1ZGI2ZTI1My5wbmciLCJlZGl0cyI6eyJ0b0Zvcm1hdCI6IndlYnAiLCJyZXNpemUiOnsid2lkdGgiOjEyMDAsImhlaWdodCI6NjI3LCJmaXQiOiJjb250YWluIiwiYmFja2dyb3VuZCI6eyJyIjoyNTUsImciOjI1NSwiYiI6MjU1LCJhbHBoYSI6MH19fX0="
                    alt="Devhaus logo"
                    width={100}
                    height={10}
                  />
                </a>
              </div>
            </footer>
          </div>
        </div>
      </HeroUIProvider>
    </>
  );
}

export default App;
