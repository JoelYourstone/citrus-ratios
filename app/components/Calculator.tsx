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
      {history.map((entry, index) => (
        <div key={index + entry.input}>
          <button
            type="button"
            key={index}
            onClick={() => handleHistoryItemClick(entry.input)}
          >
            {entry.input}g, {new Date(entry.timestamp).toLocaleString()}
          </button>
          <button type="button" onClick={() => deleteEntry(entry.timestamp)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
