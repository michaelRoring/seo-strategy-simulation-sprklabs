import SheetInformation from "./SheetInformation";

export default function Header() {
  return (
    <div className="space-y-3 mx-auto py-8 px-6 lg:px-24">
      <h1 className="text-3xl font-semibold ">
        Enhanced SEO Strategy Impact Simulation
      </h1>
      <div className="md:flex md:justify-between">
        <h1>
          Estimate the potential business impact (including ROI) of combining
          Topical Authority with Programmatic SEO over 12 months.
        </h1>
        <div className="sm:flex sm:justify-end">
          <SheetInformation />
        </div>
      </div>
    </div>
  );
}
