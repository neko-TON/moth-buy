import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { AddressForm } from "@/app/admin/address-form";
import { LoginForm } from "@/app/admin/login-form";
import { getHistory, getRecordFresh, isAddress } from "@/lib/address-store";
import {
  IS_CONFIGURED,
  configurationProblem,
  hasValidSession,
} from "@/lib/admin-auth";
import { BACKEND, describeBackend } from "@/lib/kv";
import { CHAIN_NAME } from "@/lib/token";

/**
 * Nothing here should ever be cached, indexed, or archived. `metadata.robots`
 * covers crawlers that read the page; the `X-Robots-Tag` header in
 * `next.config.ts` covers the rest, and does it without a `Disallow` line in
 * robots.txt — that file is public, and it would advertise the path it was
 * meant to protect.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

/** Reading the session cookie already forces this; stated for the next reader. */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  /**
   * With no password configured the panel does not exist — the same 404 as any
   * other missing route. There is no form to attack and, more importantly, no
   * default credential shipped in the repository for someone to find.
   */
  if (!IS_CONFIGURED) {
    if (process.env.NODE_ENV !== "production") {
      // In development, say what is missing instead of a silent 404.
      throw new Error(
        `The admin panel is disabled: ${configurationProblem()} ` +
          "See .env.example.",
      );
    }
    notFound();
  }

  if (!(await hasValidSession())) {
    return (
      <Shell title="Sign in">
        <p className="mt-4 max-w-xl text-base leading-7 text-mute-2">
          This page sets the contract address shown to every visitor.
        </p>
        <LoginForm />
      </Shell>
    );
  }

  const [record, history] = await Promise.all([
    getRecordFresh(),
    getHistory(),
  ]);

  const store = describeBackend();
  const live = record?.value ?? "";

  return (
    <Shell title="Contract address">
      <form action={logout} className="absolute top-0 right-0">
        <button
          type="submit"
          className="rounded-lg border border-edge-strong px-4 py-2 text-sm font-semibold text-mute-1 transition-colors duration-300 hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Sign out
        </button>
      </form>

      {/* State of the world first: what is live, and where it is stored. */}
      <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-edge bg-edge sm:grid-cols-2">
        <div className="bg-ink-deep p-5">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mute-4">
            Live on the site
          </dt>
          <dd className="mt-3 break-all font-mono text-sm text-heading">
            {live === "" ? (
              <span className="font-sans text-mute-2">
                Nothing set. The site shows its “no address yet” state.
              </span>
            ) : (
              live
            )}
          </dd>
          {live !== "" && (
            <dd className="mt-3 text-sm text-mute-2">
              {isAddress(live)
                ? `A valid ${CHAIN_NAME} address. Links and on-chain figures are live.`
                : "Not a valid address — shown as plain text, links switched off."}
              {record?.updatedAt && (
                <>
                  {" "}
                  Set{" "}
                  <time dateTime={record.updatedAt}>
                    {record.updatedAt.slice(0, 16).replace("T", " ")} UTC
                  </time>
                  .
                </>
              )}
            </dd>
          )}
        </div>

        <div className="bg-ink-deep p-5">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mute-4">
            Storage
          </dt>
          <dd className="mt-3 text-sm leading-6 text-mute-2">{store.detail}</dd>
        </div>
      </dl>

      {BACKEND === "none" && (
        <p className="mt-6 rounded-xl border border-accent/50 bg-accent/5 p-4 text-sm leading-6 text-heading">
          Saving is disabled until a store exists. Writing to this server’s own
          disk would look like it worked, reach nobody, and disappear at the
          next cold start — so it refuses instead.
        </p>
      )}

      <AddressForm current={live} history={history} />
    </Shell>
  );
}

function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-ink px-4 py-16 text-heading sm:px-6">
      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-heading sm:text-4xl">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}
