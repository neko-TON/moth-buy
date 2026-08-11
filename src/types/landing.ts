import type { ComponentType, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** A label/value row — used by both the metrics list and the primary feature card. */
export interface StatRow {
  label: string;
  value: string;
}

/** One of the three pillars named along the bottom of the hero frame. */
export type ProductPillar = "AMM" | "Lending" | "Launchpad";

/** A secondary feature card (Low Fees, Tailored Incentives, Security in Focus). */
export interface Feature {
  icon: IconComponent;
  title: string;
  description: string;
}

/** A social/doc link in the footer. */
export interface SocialLink {
  href: string;
  label: string;
  icon: IconComponent;
}
