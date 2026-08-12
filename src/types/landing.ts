import type { ComponentType, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** A label/value row — used by both the metrics list and the primary feature card. */
export interface StatRow {
  label: string;
  value: string;
}

/** One of the three traits named along the bottom of the hero frame. */
export type ProductPillar = "Nocturnal" | "Phototactic" | "Unprofitable";

/** A secondary feature card (Low Expectations, No Incentives, Read the Contract). */
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
