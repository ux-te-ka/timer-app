import { useEffect, useRef, useState } from "react";

type Status = "idle" | "running" | "paused";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Timer() {
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "running") return;

    intervalRef.current = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  function handleStart() {
    setStatus("running");
  }

  function handlePause() {
    setStatus("paused");
  }

  function handleReset() {
    setStatus("idle");
    setSeconds(0);
  }

  return (
    <div className="timer">
      <p className="timer__display">{formatTime(seconds)}</p>
      <div className="timer__controls">
        {status !== "running" && (
          <button type="button" className="timer__button timer__button--primary" onClick={handleStart}>
            Start
          </button>
        )}
        {status === "running" && (
          <button type="button" className="timer__button" onClick={handlePause}>
            Pause
          </button>
        )}
        {status !== "idle" && (
          <button type="button" className="timer__button timer__button--reset" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
