import { SimulationInputs } from "../types";
import CustomTooltip from "./CustomTooltip";
import { Accordion, AccordionItem } from "@heroui/react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";

// Helper function to format numbers with commas
const formatNumberWithCommas = (num: number | string) => {
  if (num === null || num === undefined || num === "") return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface AssumptionsProps {
  inputs: SimulationInputs;
  onInputChange: (name: keyof SimulationInputs, value: number) => void;
}

export default function Assumptions({
  inputs,
  onInputChange,
}: AssumptionsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="">
        <Accordion
          variant="splitted"
          defaultExpandedKeys={["1"]}
          className="w-11/12 mx-auto"
        >
          <AccordionItem
            key="1"
            aria-label="1"
            title={<p className="font-semibold">Simulations assumptions</p>}
            indicator={
              isOpen ? (
                <ArrowUpIcon className="w-6 h-4" />
              ) : (
                <ArrowDownIcon className="w-6 h-4" />
              )
            }
            onClick={() => setIsOpen(!isOpen)}
            className="text-left border rounded-xl mb-4 py-1 bg-slate-50"
          >
            <div className="py-4 md:px-6 lg:px-8 bg-slate-50 rounded-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="text-sm font-medium text-gray-900">
                    <CustomTooltip description="Total number of targeted pages created.">
                      Number of pSEO Pages
                    </CustomTooltip>
                  </label>
                  <input
                    id="pSEO_pages"
                    type="text"
                    value={formatNumberWithCommas(inputs.pSEO_pages || "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      onInputChange("pSEO_pages", parseFloat(value) || 0);
                    }}
                    className="w-3/4 h-12 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  />
                  <label className="text-sm font-medium text-gray-900">
                    <CustomTooltip description="Estimated average monthly searches for keywords targeted by each page.">
                      Avg. Monthly Search Vol (MSV) / Page
                    </CustomTooltip>
                  </label>
                  <input
                    id="avg_msv"
                    type="text"
                    value={formatNumberWithCommas(inputs.avg_msv || "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      onInputChange("avg_msv", parseFloat(value) || 0);
                    }}
                    className="w-3/4 h-12 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    <CustomTooltip description="Estimated percentage of searchers who click your link.">
                      Avg. Click-Through Rate (CTR %)
                    </CustomTooltip>
                  </label>
                  <input
                    id="avg_ctr"
                    type="text"
                    value={formatNumberWithCommas(inputs.avg_ctr || "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      onInputChange("avg_ctr", parseFloat(value) || 0);
                    }}
                    className="w-3/4 h-12 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    <CustomTooltip description="Percentage of visitors who become a lead.">
                      Traffic-to-Lead Conv. Rate (%)
                    </CustomTooltip>
                  </label>
                  <input
                    id="traffic_cr"
                    type="text"
                    value={formatNumberWithCommas(inputs.traffic_cr || "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      onInputChange("traffic_cr", parseFloat(value) || 0);
                    }}
                    className="w-3/4 h-12 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    <CustomTooltip description="Percentage of leads who become customers.">
                      Lead-to-Customer Conv. Rate (%)
                    </CustomTooltip>
                  </label>
                  <input
                    id="lead_cr"
                    type="text"
                    value={formatNumberWithCommas(inputs.lead_cr || "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      onInputChange("lead_cr", parseFloat(value) || 0);
                    }}
                    className="w-3/4 h-12 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    <CustomTooltip description="Estimated total revenue from one customer.">
                      Avg. Customer Lifetime Value (CLTV) ($)
                    </CustomTooltip>
                  </label>
                  <input
                    id="cltv"
                    type="text"
                    value={formatNumberWithCommas(inputs.cltv || "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      onInputChange("cltv", parseFloat(value) || 0);
                    }}
                    className="w-3/4 h-12 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    <CustomTooltip description="Months for traffic to reach full potential (linear increase assumed).">
                      Ramp-up Period (Months)
                    </CustomTooltip>
                  </label>
                  <input
                    id="ramp_up"
                    type="text"
                    value={formatNumberWithCommas(inputs.ramp_up || "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      onInputChange("ramp_up", parseFloat(value) || 0);
                    }}
                    className="w-3/4 h-12 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    <CustomTooltip description="Estimated total recurring monthly cost for this SEO strategy (tools, content, links, personnel, etc.).">
                      Monthly Expense ($)
                    </CustomTooltip>
                  </label>
                  <input
                    id="monthly_expense"
                    type="text"
                    value={formatNumberWithCommas(inputs.monthly_expense || "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      onInputChange("monthly_expense", parseFloat(value) || 0);
                    }}
                    className="w-3/4 h-12 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </form>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
