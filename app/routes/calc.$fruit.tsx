import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useParams } from "@remix-run/react";
import Calculator from "~/components/Calculator";

// Define calculator configurations for each fruit
const calculatorConfigs = {
  lemon: {
    title: "Lemon",
    inputString: "Peel weight in grams",
    outputs: [
      { name: "Citric Acid", conversionFactor: 1 },
      { name: "Water", conversionFactor: 16.66666666 },
    ],
  },
  lime: {
    title: "Lime",
    inputString: "Peel weight in grams",
    outputs: [
      { name: "Citric Acid", conversionFactor: 0.6666 },
      { name: "Malic Acid", conversionFactor: 0.3333 },
      { name: "Water", conversionFactor: 16.66666666 },
    ],
  },
  orange: {
    title: "Orange",
    inputString: "Peel weight in grams",
    outputs: [
      { name: "Citric Acid", conversionFactor: 0.9 },
      { name: "Malic Acid", conversionFactor: 0.1 },
      { name: "Water", conversionFactor: 16.66666666 },
    ],
  },

  grape: {
    title: "Grape",
    inputString: "Peel weight in grams",
    outputs: [
      { name: "Citric Acid", conversionFactor: 0.8 },
      { name: "Malic Acid", conversionFactor: 0.2 },
      { name: "MSG", conversionFactor: 0.0333 },
      { name: "Water", conversionFactor: 16.66666666 },
    ],
  },
};

export const loader: LoaderFunction = ({ params }) => {
  if (!params.fruit) {
    return new Response("Not found", { status: 404 });
  }

  const fruit = params.fruit as keyof typeof calculatorConfigs;

  // Make sure the fruit is valid
  if (!calculatorConfigs[fruit]) {
    return new Response("Not found", { status: 404 });
  }

  // Get the fruit name from the URL and return its calculator configuration
  return calculatorConfigs[fruit];
};

export default function FruitCalculator() {
  const { fruit } = useParams();
  const config = useLoaderData<{
    title: string;
    inputString: string;
    outputs: { name: string; conversionFactor: number }[];
  }>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {config && (
        <Calculator
          key={config.title}
          title={config.title}
          inputString={config.inputString}
          outputs={config.outputs}
        />
      )}
      {!config && <p>Calculator not found for {fruit}</p>}
    </div>
  );
}
