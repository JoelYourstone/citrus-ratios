import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { Link, Outlet } from "@remix-run/react";
import styles from "../styles/calc.css";

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

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Calc() {
  return (
    <div>
      <div className="linkTabs">
        <Link className="linkLime linkLink" to="/calc/lime">
          Lime Calculator
        </Link>
        <Link className="linkLemon linkLink" to="/calc/lemon">
          Lemon Calculator
        </Link>
        <Link className="linkOrange linkLink" to="/calc/orange">
          Orange Calculator
        </Link>
        <Link className="linkGrape linkLink" to="/calc/grape">
          Grapefruit Calculator
        </Link>
      </div>
      <Outlet /> {/* This will render the matched child route */}
    </div>
  );
}
