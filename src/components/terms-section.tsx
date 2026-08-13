/**
 * The three words along the bottom of the hero frame, defined.
 *
 * This started as a joke and turned out to fix a real hole: the whole hero
 * visual carries `aria-hidden="true"`, so "Nocturnal · Phototactic ·
 * Unprofitable" does not exist for a screen reader at all. Here they are, in
 * readable markup, immediately below where they are shown.
 *
 * Deliberately no `<h2>`. This is a gloss on the section above it, not a
 * section of its own, so it takes an `aria-label` and stays out of the heading
 * outline the real sections build.
 *
 * The third definition only works because the first two are played straight.
 */
const TERMS: { term: string; definition: string }[] = [
  {
    term: "Nocturnal",
    definition:
      "Active at night. Most moths are. Some are not — burnet moths fly in full sun.",
  },
  {
    term: "Phototactic",
    definition:
      "Moving in response to light. This one moves toward it. Why is still argued about.",
  },
  {
    term: "Unprofitable",
    definition: "Not a term in entomology. It is here because it is accurate.",
  },
];

export function TermsSection() {
  return (
    <section
      aria-label="Terms used on this page"
      className="border-b border-edge"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute-4">
          Terms used on this page
        </p>

        <dl
          className="mt-6 grid gap-x-12 gap-y-6 sm:grid-cols-3"
          data-stagger
        >
          {TERMS.map((entry) => (
            <div key={entry.term} data-reveal="soft">
              <dt className="text-sm font-semibold text-heading">
                {entry.term}
              </dt>
              <dd className="mt-2 text-sm leading-6 text-mute-2">
                {entry.definition}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
