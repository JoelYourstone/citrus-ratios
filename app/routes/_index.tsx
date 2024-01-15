import type { MetaFunction } from "@remix-run/cloudflare";
import Calc from "./calc";

export const meta: MetaFunction = () => {
  return [
    { title: "Citrus calculators" },
    { name: "description", content: "For all your citrus needs!" },
  ];
};

export default function Index() {
  return <Calc />;
}
