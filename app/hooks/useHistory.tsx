import { useState, useEffect } from "react";
import { HistoryEntry } from "~/components/Calculator";

export function useHistory(
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

  function deleteEntry(timestamp: number) {
    const updatedHistory = history.filter(
      (entry) => entry.timestamp !== timestamp
    );
    setHistory(updatedHistory);
    localStorage.setItem(`history_${title}`, JSON.stringify(updatedHistory));
  }

  return {
    storeInputHistory,
    history,
    deleteEntry,
  };
}
