import { LampSwitch } from "@/components/lamp-switch";
import { MothMark } from "@/components/moth-mark";

/**
 * Footer. The yieldra original styled this band with stock Tailwind grays that
 * sat outside its own palette; the palette swap folded them into the token
 * system (edge / ink-deep / mute), so the footer is consistent with the rest
 * of the page rather than an outlier.
 *
 * The social row is intentionally gone. It held four live links to another
 * project's accounts, and dead or placeholder links in a footer are worse than
 * none — add real ones once the accounts exist.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-edge bg-ink-deep">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3" data-reveal="soft">
            <MothMark className="size-10 text-accent" />
            <span className="text-mute-1">
              &copy; 2026 $MOTH. No rights reserved, no promises made.
            </span>
          </div>
          <p className="max-w-md text-center text-xs leading-5 text-mute-3 md:text-right">
            $MOTH is a memecoin with no protocol, yield, or utility behind it.
            Nothing here is financial advice, and you can lose everything you
            put into it.
          </p>
        </div>

        {/* Subordinate to the disclaimer on purpose — it is a toy, and the
            sentence above it is not. */}
        <div className="mt-6 border-t border-edge pt-5">
          <LampSwitch />
        </div>
      </div>
    </footer>
  );
}
