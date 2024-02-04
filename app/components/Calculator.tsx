import type { LinksFunction } from "@remix-run/cloudflare";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "~/hooks/useHistory";
import styles from "./calculator.css";

type Props = {
  title: string;
  inputString: string;
  outputs: {
    name: string;
    conversionFactor: number;
  }[];
  color: string;
};

export type HistoryEntry = {
  input: number;
  timestamp: number;
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Calculator(props: Props) {
  const [outputStates, setOutputStates] = useState<{ [key: string]: number }>(
    {}
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { storeInputHistory, history, deleteEntry } = useHistory(
    inputRef,
    props.title,
    (input) => calculateOutputs(input)
  );

  // Focus the input when the page loads
  useEffect(() => {
    inputRef.current?.focus();
  }, [props.title]);

  function calculateOutputs(inputValue: number) {
    const newOutputStates: { [key: string]: number } = {};
    props.outputs.forEach((output) => {
      newOutputStates[output.name] =
        Math.round(inputValue * output.conversionFactor * 100) / 100;
    });
    setOutputStates(newOutputStates);
  }

  function handleHistoryItemClick(input: number) {
    inputRef.current!.value = String(input);
    calculateOutputs(input);
  }

  const reversedHistory = [...history].reverse().slice(0, 5);

  return (
    <div className="calculator">
      <section className="headerWithToggle">
        <HeaderWithToggle color={props.color} title={props.title} />
      </section>
      <div className="calcContainer">
        <p className="calcInputContainer">
          {props.inputString}{" "}
          <div>
            <input
              className="calcInput"
              type="number"
              ref={inputRef}
              onChange={(e) => {
                const value = Number(e.target.value);
                storeInputHistory(value);
                calculateOutputs(value);
              }}
            />
            <span className="calcUnit">g</span>
          </div>
        </p>

        <ul className="calcUl">
          {props.outputs.map((output) => (
            <li key={output.name} className="calcUlLi">
              <span className="calcUlName">{output.name}:</span>
              <section className="calcUlAmountSection">
                <span className="calcUlNumber">
                  {outputStates[output.name]}
                </span>
                <span className="calcUlUnit">g</span>
              </section>
            </li>
          ))}
        </ul>
        {/* <p>
          Acidity
          <br />
          <label htmlFor="sixpercent">6%</label>
          <input id="sixpercent" type="radio" name="acidity" />
          <label htmlFor="fivepercent">5%</label>
          <input id="fivepercent" type="radio" name="acidity" />
        </p> */}
        {Boolean(history.length) && (
          <h2 className="calcPrevH2">Previous measurements</h2>
        )}
        {reversedHistory.map((entry, index) => (
          <div className="calcPrevButtons" key={index + entry.input}>
            <button
              className="calcPrevButton"
              type="button"
              key={index}
              onClick={() => handleHistoryItemClick(entry.input)}
            >
              {entry.input} <span>g,</span>{" "}
              {toRelativeTime(new Date(entry.timestamp))}
            </button>
            <button
              className="calcPrevDelButton"
              type="button"
              onClick={() => deleteEntry(entry.timestamp)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function toRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

function HeaderWithToggle(props: { color: string; title: string }) {
  return (
    <div className="calcHeader" style={{ background: props.color }}>
      <h1>{props.title}</h1>
      <div className="aciditySection">
        <span>Acidity</span>
        <section>
          <input className="acidityInput" type="checkbox" id="switch" />
          <label className="acidityLabel" htmlFor="switch">
            Toggle
          </label>
          <div style={{ position: "relative" }}>
            <p>6%</p>
            <p>5%</p>
          </div>
        </section>
      </div>
    </div>
  );
}
