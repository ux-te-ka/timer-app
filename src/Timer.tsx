import { useEffect, useRef, useState } from "react";

type Status = "idle" | "running" | "paused";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Dev-only preset for Dribbble shots (?state=paused&t=754); import.meta.env.DEV is false in production builds, so this is stripped.
function readDevPreset(): { status: Status; seconds: number } {
  if (!import.meta.env.DEV) return { status: "idle", seconds: 0 };
  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");
  const status: Status = state === "running" || state === "paused" ? state : "idle";
  const t = Math.floor(Number(params.get("t") ?? 0));
  return { status, seconds: status !== "idle" && t > 0 ? t : 0 };
}

export default function Timer() {
  const [status, setStatus] = useState<Status>(() => readDevPreset().status);
  const [seconds, setSeconds] = useState(() => readDevPreset().seconds);
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
    <div className={`timer timer--${status}`}>
      <span className="timer__flutes" aria-hidden="true" />
      <p className="timer__display">{formatTime(seconds)}</p>
      <div className="timer__controls">
        {status !== "idle" && (
          <button type="button" className="timer__button timer__button--reset" onClick={handleReset}>
            Reset
          </button>
        )}
        {status !== "running" && (
          <button type="button" className="timer__button timer__button--start" onClick={handleStart}>
            Start
          </button>
        )}
        {status === "running" && (
          <button type="button" className="timer__button timer__button--pause" onClick={handlePause}>
            Pause
          </button>
        )}
      </div>
    </div>
  );
}
