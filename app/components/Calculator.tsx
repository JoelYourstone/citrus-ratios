import { useState, useEffect, useRef } from "react";
import { useHistory } from "~/hooks/useHistory";

type Props = {
  title: string;
  inputString: string;
  outputs: {
    name: string;
    conversionFactor: number;
  }[];
};

export type HistoryEntry = {
  input: number;
  timestamp: number;
};

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
    <div>
      <h1>{props.title}</h1>
      <p>
        {props.inputString}{" "}
        <input
          type="number"
          ref={inputRef}
          onChange={(e) => {
            const value = Number(e.target.value);
            storeInputHistory(value);
            calculateOutputs(value);
          }}
        />
      </p>
      <ul>
        {props.outputs.map((output) => (
          <li key={output.name}>
            {output.name}: {outputStates[output.name]}g
          </li>
        ))}
      </ul>
      {Boolean(history.length) && <h2>Previous measurements</h2>}
      {reversedHistory.map((entry, index) => (
        <div key={index + entry.input}>
          <button
            type="button"
            key={index}
            onClick={() => handleHistoryItemClick(entry.input)}
          >
            {entry.input}g, {toRelativeTime(new Date(entry.timestamp))}
          </button>
          <button type="button" onClick={() => deleteEntry(entry.timestamp)}>
            Delete
          </button>
        </div>
      ))}
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
