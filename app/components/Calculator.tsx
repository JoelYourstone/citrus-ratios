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
      <div className="calcSVGContainer">
        <svg
          className="calcSVG"
          fill={props.color}
          height="350px"
          width="350px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 501.551 501.551"
          opacity={0.2}
        >
          <g>
            <path
              d="M241.371,428.408V300.931c0-10.449-12.539-14.629-18.808-8.359l-89.861,89.861
		c-4.18,4.18-4.18,12.539,1.045,16.718c27.167,21.943,60.604,35.527,96.131,39.706C235.102,440.947,241.371,434.678,241.371,428.408
		z"
            />
            <path
              d="M101.355,132.702c-21.943,27.167-35.527,60.604-39.706,96.131
		c-1.045,6.269,4.18,12.539,11.494,12.539H200.62c10.449,0,14.629-12.539,8.359-18.808l-89.861-89.861
		C113.894,127.478,105.535,127.478,101.355,132.702z"
            />
            <path
              d="M61.649,272.718c4.18,36.571,18.808,68.963,39.706,96.131c4.18,5.224,11.494,5.224,16.718,1.045
		l89.861-89.861c7.314-7.314,2.09-18.808-8.359-18.808H73.143C66.873,260.18,60.604,266.449,61.649,272.718z"
            />
            <path
              d="M439.902,228.833c-4.18-36.571-18.808-68.963-39.706-96.131c-4.18-5.224-11.494-5.224-16.718-1.045
		l-89.861,89.861c-7.314,7.314-2.09,18.808,8.359,18.808h127.478C434.678,241.371,440.947,235.102,439.902,228.833z"
            />
            <path
              d="M241.371,200.62V73.143c0-6.269-5.224-11.494-12.539-11.494
		c-36.571,4.18-68.963,18.808-96.131,39.706c-5.224,4.18-5.224,11.494-1.045,16.718l89.861,89.861
		C228.833,215.249,241.371,211.069,241.371,200.62z"
            />
            <path
              d="M260.18,73.143V200.62c0,10.449,12.539,14.629,18.808,8.359l89.861-89.861
		c4.18-4.18,4.18-12.539-1.045-16.718c-27.167-21.943-60.604-35.527-96.131-39.706C266.449,60.604,260.18,65.829,260.18,73.143z"
            />
            <path
              d="M400.196,368.849c21.943-27.167,35.527-60.604,39.706-96.131c1.045-6.269-4.18-12.539-11.494-12.539
		H300.931c-10.449,0-14.629,12.539-8.359,18.808l89.861,89.861C387.657,374.073,396.016,374.073,400.196,368.849z"
            />
            <path
              d="M272.718,439.902c36.571-4.18,68.963-18.808,96.131-39.706c5.224-4.18,5.224-11.494,1.045-16.718
		l-89.861-89.861c-7.314-7.314-18.808-2.09-18.808,8.359v127.478C260.18,434.678,266.449,440.947,272.718,439.902z"
            />
            <path
              d="M250.776,0C111.804,0,0,111.804,0,250.776c0,3.135,0,6.269,0,9.404
		c5.224,133.747,114.939,241.371,250.776,241.371S496.327,393.927,501.551,260.18c0-3.135,0-6.269,0-9.404
		C501.551,111.804,389.747,0,250.776,0z M250.776,468.114c-117.029,0-212.114-92.996-217.339-207.935c0-3.135,0-6.269,0-9.404
		c0-120.163,97.176-217.339,217.339-217.339s217.339,97.176,217.339,217.339c0,3.135,0,6.269,0,9.404
		C462.89,376.163,367.804,468.114,250.776,468.114z"
            />
          </g>
        </svg>
      </div>
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
        {Boolean(history.length) && (
          <h2 className="calcPrevH2">Previous measurements:</h2>
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
      <div className="aciditySection" style={{ display: "none" }}>
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
