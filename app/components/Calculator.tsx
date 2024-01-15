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
  const [currentInput, setCurrentInput] = useState<number>(0);
  const [outputStates, setOutputStates] = useState<{ [key: string]: number }>(
    {}
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem(`history_${props.title}`);
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as HistoryEntry[];
      setHistory(parsedHistory);
      const recentEntry = parsedHistory[parsedHistory.length - 1];
      if (recentEntry && Date.now() - recentEntry.timestamp < 1800000) {
        // 30 minutes
        setCurrentInput(recentEntry.input);
        calculateOutputs(recentEntry.input);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.title]);

  // Focus the input when the page loads
  useEffect(() => {
    inputRef.current?.focus();
  }, [props.title]);

  const handleInputChange = (value: number) => {
    setCurrentInput(value);
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }
    setInputTimeout(setTimeout(() => storeInputInHistory(value), 5000));
  };

  const storeInputInHistory = (value: number) => {
    if (value === 0) return;
    const newEntry = { input: value, timestamp: Date.now() };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem(
      `history_${props.title}`,
      JSON.stringify(updatedHistory)
    );
  };

  const calculateOutputs = (inputValue: number) => {
    const newOutputStates: { [key: string]: number } = {};
    props.outputs.forEach((output) => {
      newOutputStates[output.name] =
        Math.round(inputValue * output.conversionFactor * 100) / 100;
    });
    setOutputStates(newOutputStates);
  };

  const handleHistoryItemClick = (input: number) => {
    setCurrentInput(input);
    calculateOutputs(input);
  };

  return (
    <div>
      <h1>{props.title}</h1>
      <p>
        {props.inputString}{" "}
        <input
          type="number"
          ref={inputRef}
          value={currentInput}
          onChange={(e) => {
            const value = Number(e.target.value);
            handleInputChange(value);
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
