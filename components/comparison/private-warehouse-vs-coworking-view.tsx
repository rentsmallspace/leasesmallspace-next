import Link from "next/link"
import { Check, X, MapPin, Zap, Gauge, DoorOpen, FileText, Lock } from "lucide-react"

// Exported so the page can feed the same Q&A into FAQ structured data (keeps visible FAQ and schema in sync).
export const comparisonFaqs = [
  {
    question: "Is co-warehousing cheaper than leasing your own warehouse?",
    answer:
      "Usually not, once you compare cost per square foot. Co-warehousing operators like WareSpace, Saltbox, and ReadySpaces bundle shared amenities into the rate, and you share docks, corridors, and restrooms with other tenants. LeaseSmallSpace leases you your own private standalone bay and beats any co-warehousing or shared-warehousing price per square foot.",
  },
  {
    question: "What is the difference between co-warehousing and a private warehouse lease?",
    answer:
      "Co-warehousing gives you a private unit inside a larger shared building, on a membership or short-term plan, with shared loading docks, corridors, restrooms, and a shared building address. A private warehouse lease gives you your own standalone bay with your own drive-in or dock loading, your own business address, your own utility meter, and a real Triple Net lease that locks your rate for the term.",
  },
  {
    question: "Can I use a co-warehousing address for my business license or Google Business Profile?",
    answer:
      "It is a shared building address used by many tenants, which can limit how it works for licensing, signage, and a verified Google Business Profile. A private leased bay gives you your own commercial address and your own exterior signage, which reads as a real standalone business location.",
  },
  {
    question: "Will a month-to-month warehouse membership raise my rate?",
    answer:
      "It can. Month-to-month memberships and licenses can change your rate with notice. A real lease locks your base rent for the term, so your cost does not move month to month.",
  },
  {
    question: "Do private warehouse units include 3-phase power and their own meter?",
    answer:
      "Yes. LeaseSmallSpace units include 3-phase power and are separately metered, so you pay your actual usage instead of a bundled or estimated share of a shared building.",
  },
  {
    question: "What are the best WareSpace, Saltbox, and ReadySpaces alternatives in Denver?",
    answer:
      "If you want your own private space instead of a unit inside a shared building, LeaseSmallSpace is the direct alternative in the Denver metro. You get a standalone bay, your own loading, your own address, and a real lease, across Denver, Arvada, Wheat Ridge, Lakewood, and Aurora.",
  },
]

const comparisonRows: Array<{
  label: string
  lss: string
  coworking: string
  lssGood: boolean
}> = [
  { label: "Cost per square foot", lss: "Lowest. We beat any co-warehousing price", coworking: "Membership or bundled pricing", lssGood: true },
  { label: "Rate stability", lss: "Locked for your lease term", coworking: "Month-to-month or short term, can rise", lssGood: true },
  { label: "Your space", lss: "Private standalone bay", coworking: "Private unit inside a shared building", lssGood: true },
  { label: "Loading", lss: "Your own drive-in or dock position", coworking: "Shared docks used by all tenants", lssGood: true },
  { label: "Corridors, restrooms, kitchen", lss: "All yours, inside your unit", coworking: "Shared common areas", lssGood: true },
  { label: "Business address", lss: "Your own standalone commercial address", coworking: "Shared building address", lssGood: true },
  { label: "Power", lss: "3-phase power to your unit", coworking: "Varies, shared building service", lssGood: true },
  { label: "Utility meter", lss: "Your own meter, pay your actual usage", coworking: "Bundled or estimated share", lssGood: true },
  { label: "Agreement", lss: "Real Triple Net lease (a leasehold)", coworking: "Membership, license, or short bundled term", lssGood: true },
]

const features = [
  { icon: DoorOpen, title: "Your own loading", body: "Drive-in or dock position at your unit. Pull right in. No waiting on a shared dock." },
  { icon: MapPin, title: "Your own private address", body: "Real exterior signage, a verifiable Google listing, and a clean address for your business license." },
  { icon: Zap, title: "3-phase power", body: "Industrial power to your unit, ready for real equipment." },
  { icon: Gauge, title: "Your own meter", body: "Separately metered. You pay your actual usage, not a bundled or estimated share." },
  { icon: FileText, title: "A real lease", body: "A Triple Net lease gives you a legal right to your space, not a membership or a license." },
  { icon: Lock, title: "Fixed rate", body: "Your base rent is locked for the term. Month-to-month means month-to-month rate hikes. A lease does not." },
]

const competitors = [
  {
    name: "WareSpace",
    model:
      "Private warehouse units (Denver: about 200 to 2,000+ sq ft) inside a shared, multi-tenant building. The shipping station, loading docks, conference rooms, restrooms, kitchen, and lobby all sit outside your unit and are shared by the community.",
    terms:
      "One all-in monthly fee, billed as a short-term lease with a 6-month minimum. No NNN, no CAM, no personal guarantee.",
    better: "Genuinely convenient if you want one bundled bill and a short commitment with no personal guarantee.",
    denver: "Denver-metro locations in Park Hill and Centennial.",
  },
  {
    name: "Saltbox",
    model:
      "A co-warehousing facility where you get a private suite inside a shared building. Loading docks, packing stations, conference rooms, an on-site content studio, and kitchens are shared. Saltbox markets a shared business address as a credibility perk.",
    terms:
      "Flexible month-to-month memberships, called Access Plans, openly positioned as warehouse access without the lease. Lower tiers are shared, co-working-style access; a dedicated suite is custom quoted.",
    better: "Strong if you are an e-commerce or logistics business that wants 3PL support, a content studio, and networking.",
    denver: "Denver location at 4800 Dahlia St in Park Hill.",
  },
  {
    name: "ReadySpaces",
    model:
      "Co-warehousing with a private, lockable unit (about 250 to 5,000 sq ft) inside a shared building. Conference rooms, kitchens, lounges, Wi-Fi, and community forklifts and pallet jacks are shared. Only select units have a private loading door.",
    terms:
      "A license model. Terms typically start at 3 months and then go month-to-month, and occupants are called members. Marketed as no long-term lease and no triple-net surprises.",
    better: "Useful if you value short commitments and shared forklifts and pallet jacks you do not have to buy.",
    denver: "Denver-area co-warehousing locations.",
  },
]

export default function PrivateWarehouseVsCoworkingView() {
  return (
    <div className="w-full bg-white text-gray-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center bg-blue-500/30 border border-blue-300/40 text-blue-50 px-3 py-1 rounded-full text-sm font-medium mb-6">
            Private warehouse vs co-warehousing in Denver
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">
            Your own private warehouse. Lower cost per square foot. Guaranteed.
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl">
            WareSpace, Saltbox, and ReadySpaces rent you a unit inside a shared building. LeaseSmallSpace
            leases you your own standalone bay across the Denver metro: your door, your address, your meter,
            your lease. And we beat any co-warehousing or shared-warehousing price per square foot.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              See available units
            </Link>
            <Link
              href="/questionnaire"
              className="bg-blue-500/30 border border-white/60 text-white hover:bg-blue-500/50 text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Get matched to a space
            </Link>
          </div>
        </div>
      </section>

      {/* Real-use photo band */}
      <figure className="relative bg-white">
        <figcaption className="absolute top-0 left-0 right-0 z-10 px-5 py-5 sm:px-10 sm:py-7">
          <div className="inline-block bg-white/85 backdrop-blur-sm rounded-xl px-5 py-3 shadow-sm max-w-2xl">
            <p className="text-blue-700 font-bold text-lg sm:text-2xl leading-tight">
              A real tenant in their own private bay
            </p>
            <p className="text-blue-900/80 text-sm sm:text-base mt-1">
              Copper Hill Brewing Co. runs its whole operation behind its own roll-up door, with its own address
              and signage. Not a unit inside someone else&apos;s shared building.
            </p>
          </div>
        </figcaption>
        <img
          src="/images/private-bay-brewery.jpg"
          alt="A Denver brewery operating from its own private warehouse bay with its own roll-up drive-in door"
          className="w-full h-auto"
          loading="lazy"
        />
      </figure>

      {/* Answer-first summary */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-blue-50/60 border-b border-blue-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-wide text-blue-700 mb-3">The short version</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Co-warehousing (WareSpace, Saltbox, ReadySpaces) gives you a private unit inside a shared building,
            on a membership or short-term plan, with shared docks, corridors, restrooms, and a shared address.
            LeaseSmallSpace leases you a private, standalone small-bay warehouse on a real Triple Net lease:
            your own drive-in or dock loading, your own business address, your own meter, 3-phase power, and a
            rate locked for your term. And we beat any co-warehousing price per square foot.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">Private warehouse vs co-warehousing, side by side</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            How leasing your own bay with LeaseSmallSpace compares to a unit inside a shared co-warehousing building.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wide"></th>
                  <th className="py-4 px-5 text-base font-bold text-blue-700">LeaseSmallSpace</th>
                  <th className="py-4 px-5 text-base font-bold text-gray-700">Co-warehousing / shared</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100 last:border-0 align-top">
                    <td className="py-4 px-5 font-semibold text-gray-900">{row.label}</td>
                    <td className="py-4 px-5">
                      <span className="flex items-start gap-2 text-gray-900">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden />
                        {row.lss}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="flex items-start gap-2 text-gray-600">
                        <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden />
                        {row.coworking}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Competitor models summarized from each company&apos;s own published terms. All three provide a private
            interior unit inside a shared, multi-tenant building.
          </p>
        </div>
      </section>

      {/* What is co-warehousing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">What is co-warehousing?</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Co-warehousing, sometimes called shared warehousing, is a flexible-space model where one operator
            runs a large building and rents private units inside it to many small businesses. You get your own
            lockable unit, but you share the loading docks, corridors, restrooms, conference rooms, and amenities
            with every other tenant in the building, and you typically sign a membership or a license rather than
            a lease.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            It is convenient and quick to start. The trade-off is that you do not control the building, your
            address is shared with dozens of other businesses, and a month-to-month plan can raise your rate.
            Leasing your own standalone bay trades a little of that convenience for ownership of your space, your
            address, and your rate.
          </p>
        </div>
      </section>

      {/* Yours in every capacity */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">Yours in every capacity</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            A LeaseSmallSpace unit is private space, not shared space, down to the meter.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price-beat guarantee */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-10 text-center shadow-lg">
          <h2 className="text-3xl font-bold mb-3">The price-beat guarantee</h2>
          <p className="text-xl text-green-50 mb-6 max-w-2xl mx-auto">
            We beat any co-warehousing or shared-warehousing price per square foot. Bring us a competitor&apos;s
            rate and we will give you your own private bay for less.
          </p>
          <Link
            href="/questionnaire"
            className="inline-block bg-white text-green-700 hover:bg-green-50 text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Get your rate
          </Link>
        </div>
      </section>

      {/* Competitor breakdowns */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">
            How LeaseSmallSpace compares to WareSpace, Saltbox, and ReadySpaces
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            All three are solid operators. Here is how their model differs from leasing your own bay, in their own terms.
          </p>
          <div className="space-y-6">
            {competitors.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                <h3 className="text-2xl font-bold mb-4">LeaseSmallSpace vs {c.name}</h3>
                <dl className="space-y-3 text-gray-700">
                  <div>
                    <dt className="font-semibold text-gray-900">The model</dt>
                    <dd>{c.model}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">The agreement</dt>
                    <dd>{c.terms}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">Where {c.name} is genuinely strong</dt>
                    <dd>{c.better}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">Denver presence</dt>
                    <dd>{c.denver}</dd>
                  </div>
                </dl>
                <p className="mt-5 pt-5 border-t border-gray-100 text-gray-900">
                  <span className="font-semibold text-blue-700">The LeaseSmallSpace difference:</span> a private,
                  standalone bay with your own loading, your own address, your own meter, and a real lease that
                  locks your rate, for a lower cost per square foot.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When co-warehousing makes sense (honest) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">When co-warehousing makes sense</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Co-warehousing is a real fit for some businesses. If you need to start this week with zero setup,
            want a single all-in bill, value shared amenities like conference rooms, content studios, forklifts,
            or logistics support, or want the freedom to leave on short notice, a membership can be the right
            call. If what you want instead is your own private space, your own address, control of your unit, and
            the lowest cost per square foot on a stable rate, a lease with LeaseSmallSpace is the better deal.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {comparisonFaqs.map((faq) => (
              <details key={faq.question} className="group bg-white rounded-xl border border-gray-200 p-6">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="ml-4 text-blue-600 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get your own space for less</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            See what is available across the Denver metro, or tell us what you need and we will match you to a
            private bay and beat any co-warehousing price per square foot.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Browse available units
            </Link>
            <Link
              href="/questionnaire"
              className="bg-blue-500/30 border border-white/60 text-white hover:bg-blue-500/50 text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Get matched
            </Link>
            <a
              href="tel:+17209898838"
              className="bg-blue-500/30 border border-white/60 text-white hover:bg-blue-500/50 text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Call (720) 989-8838
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
