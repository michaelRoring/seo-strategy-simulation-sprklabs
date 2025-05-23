// Define input types
export interface SimulationInputs {
  pSEO_pages: number;
  avg_msv: number;
  avg_ctr: number;
  traffic_cr: number;
  lead_cr: number;
  cltv: number;
  ramp_up: number;
  monthly_expense: number;
}

// Define result types
export interface MonthlyData {
  month: string;
  traffic: number;
  leads: number;
  customers: number;
  revenue: number;
  cumRevenue: number;
  cumExpense: number;
  profit: number;
  cumProfit: number;
}

export interface SimulationResults {
  monthlyData: MonthlyData[];
  totalTraffic: number;
  totalLeads: number;
  totalCustomers: number;
  totalMonthlyRevenue: number;
  finalCumulativeRevenue: number;
  finalCumulativeExpense: number;
  finalCumulativeProfit: number;
  roiMonth: number;
}
