import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import Calc, { links as calcLinks } from "./calc";

export const meta: MetaFunction = () => {
  return [
    { title: "Citrus calculators" },
    { name: "description", content: "For all your citrus needs!" },
  ];
};

export const links: LinksFunction = () => [...calcLinks()];

// Cache for 24h
export function headers() {
  return {
    "Cache-Control": "max-age=86400",
  };
}

export default function Index() {
  return <Calc />;
}
