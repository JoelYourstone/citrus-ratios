import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { Link, Outlet } from "@remix-run/react";
// import styles from "./calc.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Citrus calculators" },
    { name: "description", content: "For all your citrus needs!" },
  ];
};

export function headers() {
  return {
    "Cache-Control": "max-age=10800",
  };
}

// export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Calc() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link className="styletest" to="/calc/lime">
          Lime Calculator
        </Link>
        <Link to="/calc/lemon">Lemon Calculator</Link>
        <Link to="/calc/orange">Orange Calculator</Link>
        <Link to="/calc/grape">Grape Calculator</Link>
      </div>
      <Outlet /> {/* This will render the matched child route */}
    </div>
  );
}
