import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { MessageCircleQuestion } from "lucide-react";

export default function SheetInformation() {
  const content = [
    {
      title: "How to use this simulator?",
      content: (
        <>
          <br />
          <ol>
            <li>
              <strong>Review Assumptions:</strong> Go through each field in the
              "Simulation Assumptions" section below. Hover over the labels for
              tooltips explaining each input.
            </li>
            <br />
            <li>
              <strong>Enter Your Estimates:</strong> Replace the default values
              with figures that reflect your specific business context, target
              keywords, and expected performance. Be realistic!
            </li>
            <br />
            <li>
              <strong>Input Monthly Expense:</strong> Estimate your total
              recurring monthly cost for this SEO strategy (tools, content,
              links, personnel, etc.).
            </li>
            <br />
            <li>
              <strong>Run Simulation:</strong> Click the "Run Simulation &
              Generate Charts" button.
            </li>
            <br />
            <li>
              <strong>Analyze Results Table:</strong> Examine the month-by-month
              breakdown. See how traffic, leads, customers, revenue, and profit
              evolve. Note the color coding for profit (green) and loss (red).
            </li>
            <br />
            <li>
              <strong>Check ROI:</strong> Look at the "Time to ROI" calculation
              above the table. This shows when your cumulative profit is
              projected to turn positive.
            </li>
            <br />
            <li>
              <strong>View Charts:</strong> The charts provide a visual
              representation of revenue growth and profitability over the
              12-month period. Use them to understand trends and the crossover
              point for ROI.
            </li>
            <br />
            <li>
              <strong>Iterate:</strong> Adjust the assumptions and re-run the
              simulation to explore different scenarios (e.g., impact of higher
              conversion rates, lower costs, faster ramp-up).
            </li>
            <br />
            <li>
              <strong>Share & Download:</strong> Use the buttons in the "Next
              Steps" section (below the results) to share a link to your
              simulation or download a PDF summary.
            </li>
          </ol>
        </>
      ),
    },
  ];

  return (
    <Sheet>
      <div className="justify-center align-middle lg:ml-4 md:ml-2 ml-2 ">
        <SheetTrigger className="flex text-slate-900  cursor-pointer bg-white rounded-xl mr-8 px-2 py-2 text-sm font-medium hover:bg-slate-200 ease-in-out duration-500">
          <MessageCircleQuestion className="mr-2" />
          <p className="mt-0.5">How to use?</p>
        </SheetTrigger>
      </div>
      <SheetContent side="right" className="bg-white rounded-l-xl ">
        <SheetHeader>
          <SheetTitle>
            <h1 className="font-semibold text-xl">
              Follow these steps to estimate the potential impact of your SEO
              strategy:
            </h1>
          </SheetTitle>
          <SheetDescription>{content[0].content}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
