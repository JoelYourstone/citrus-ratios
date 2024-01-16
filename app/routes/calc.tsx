import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Citrus calculators" },
    { name: "description", content: "For all your citrus needs!" },
  ];
};

export function Headers() {
  return {
    "Cache-Control": "max-age=10800",
  };
}

export default function Calc() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/calc/lime">Lime Calculator</Link>
        <Link to="/calc/lemon">Lemon Calculator</Link>
        <Link to="/calc/orange">Orange Calculator</Link>
        <Link to="/calc/grape">Grape Calculator</Link>
      </div>
      <Outlet /> {/* This will render the matched child route */}
    </div>
  );
}
