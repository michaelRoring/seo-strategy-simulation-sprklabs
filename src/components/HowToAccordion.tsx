import { Accordion, AccordionItem } from "@heroui/react";
import { ArrowRight as ArrowRightIcon } from "lucide-react";

export default function App() {
  const content = [
    {
      title: "Glossary & Formulas",
      content: (
        <>
          <br />
          <p>Understanding the metrics and calculations:</p>
          <br />
          <dl>
            <dt>
              <strong>Number of pSEO Pages</strong>
            </dt>
            <dd>Total number of targeted pages created.</dd>
            <br />
            <dt>
              <strong>Avg. Monthly Search Vol (MSV) / Page</strong>
            </dt>
            <dd>
              Estimated average monthly searches for keywords targeted by each
              page.
            </dd>
            <br />
            <dt>
              <strong>Avg. Click-Through Rate (CTR %)</strong>
            </dt>
            <dd>Estimated percentage of searchers who click your link.</dd>
            <br />
            <dt>
              <strong>Traffic-to-Lead Conv. Rate (%)</strong>
            </dt>
            <dd>Percentage of visitors who become a lead.</dd>
            <br />
            <dt>
              <strong>Lead-to-Customer Conv. Rate (%)</strong>
            </dt>
            <dd>Percentage of leads who become customers.</dd>
            <br />
            <dt>
              <strong>Avg. Customer Lifetime Value (CLTV) ($)</strong>
            </dt>
            <dd>Estimated total revenue from one customer.</dd>
            <br />
            <dt>
              <strong>Traffic Ramp-up (Months)</strong>
            </dt>
            <dd>
              Months for traffic to reach full potential (linear increase
              assumed).
            </dd>
            <br />
            <dt>
              <strong>Monthly SEO Expense ($)</strong>
            </dt>
            <dd>
              Estimated total recurring monthly cost for the SEO strategy.
            </dd>
            <br />
            <dt>
              <strong>Ramp Factor (Internal)</strong>
            </dt>
            <dd>
              Multiplier increasing linearly over the ramp-up period. Formula:{" "}
              <code>MIN(1, Current Month / Ramp-up Months)</code>
            </dd>
            <br />
            <dt>
              <strong>Est. Traffic (Monthly)</strong>
            </dt>
            <dd>
              Formula: <code>(Pages * MSV/Page * CTR %) * Ramp Factor</code>
            </dd>
            <br />
            <dt>
              <strong>Est. Leads (MQLs) (Monthly)</strong>
            </dt>
            <dd>
              Formula: <code>Est. Traffic * Traffic-to-Lead CR %</code>
            </dd>
            <br />
            <dt>
              <strong>Est. New Customers (Monthly)</strong>
            </dt>
            <dd>
              Formula: <code>Est. Leads * Lead-to-Customer CR %</code>
            </dd>
            <br />
            <dt>
              <strong>Est. Monthly Revenue ($)</strong>
            </dt>
            <dd>
              Formula: <code>Est. New Customers * CLTV</code>
            </dd>
            <br />
            <dt>
              <strong>Cumulative Revenue ($)</strong>
            </dt>
            <dd>Running total of monthly revenue.</dd>
            <br />
            <dt>
              <strong>Cumulative Expense ($)</strong>
            </dt>
            <dd>
              Running total of monthly expense. Formula:{" "}
              <code>Monthly SEO Expense * Month #</code>
            </dd>
            <br />
            <dt>
              <strong>Monthly Profit ($)</strong>
            </dt>
            <dd>
              Formula: <code>Monthly Revenue - Monthly Expense</code>
            </dd>
            <br />
            <dt>
              <strong>Cumulative Profit ($)</strong>
            </dt>
            <dd>
              Running total profit/loss. Formula:{" "}
              <code>Cumulative Revenue - Cumulative Expense</code>
            </dd>
            <br />
            <dt>
              <strong>Time to ROI</strong>
            </dt>
            <dd>First month where Cumulative Profit more than 0.</dd>
            <br />
          </dl>
        </>
      ),
    },
  ];
  return (
    <div className="w-11/12 mx-auto text-center py-6 px-4 sm:px-6 lg:px-8 bg-white">
      <Accordion className="" variant="splitted">
        {content.map((item) => (
          <AccordionItem
            key={item.title}
            aria-label={item.title}
            title={<strong>{item.title}</strong>}
            indicator={<ArrowRightIcon className="w-6 h-4" />}
            className="text-left border rounded-2xl mb-4 py-1 w-full  hover:bg-slate-50"
          >
            {item.content}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
