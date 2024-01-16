import { useState, useEffect, useRef } from "react";

type Props = {
  title: string;
  inputString: string;
  outputs: {
    name: string;
    conversionFactor: number;
  }[];
};

type HistoryEntry = {
  input: number;
  timestamp: number;
};

export default function Calculator(props: Props) {
  const [outputStates, setOutputStates] = useState<{ [key: string]: number }>(
    {}
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { storeInputHistory, history } = useHistory(
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
        <button
          type="button"
          key={index}
          onClick={() => handleHistoryItemClick(entry.input)}
        >
          {entry.input}g, {new Date(entry.timestamp).toLocaleString()}
        </button>
      ))}
    </div>
  );
}

function useHistory(
  inputRef: React.RefObject<HTMLInputElement>,
  title: string,
  calcOutputs: (inputValue: number) => void
) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load history and prefill the input if the last entry was less than 30 minutes ago
  useEffect(() => {
    const savedHistory = localStorage.getItem(`history_${title}`);
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as HistoryEntry[];
      setHistory(parsedHistory);
      const recentEntry = parsedHistory[parsedHistory.length - 1];
      if (recentEntry && Date.now() - recentEntry.timestamp < 1800000) {
        // 30 minutes
        inputRef.current!.value = String(recentEntry.input);
        calcOutputs(recentEntry.input);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  function storeInputHistory(value: number) {
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }
    setInputTimeout(setTimeout(() => storeInputInHistory(value), 5000));
  }

  function storeInputInHistory(value: number) {
    if (value === 0) return;
    const newEntry = { input: value, timestamp: Date.now() };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem(`history_${title}`, JSON.stringify(updatedHistory));
  }

  return {
    storeInputHistory,
    history,
  };
}
