
import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode } from '../types';
import { WORK_DURATION_SECONDS, BREAK_DURATION_SECONDS } from '../constants';

export const useTimer = (onWorkSessionComplete: () => void) => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.WORK);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION_SECONDS);
  const [isActive, setIsActive] = useState(false);
  // Fix: Use 'ReturnType<typeof setInterval>' for the timer ID type to be environment-agnostic, which resolves to 'number' in browsers.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchMode = useCallback(() => {
    if (mode === TimerMode.WORK) {
      onWorkSessionComplete();
      setMode(TimerMode.BREAK);
      setTimeLeft(BREAK_DURATION_SECONDS);
    } else {
      setMode(TimerMode.WORK);
      setTimeLeft(WORK_DURATION_SECONDS);
    }
    setIsActive(true);
  }, [mode, onWorkSessionComplete]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            switchMode();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, switchMode]);
  
  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  
  const reset = useCallback(() => {
    setIsActive(false);
    if(mode === TimerMode.WORK) {
        setTimeLeft(WORK_DURATION_SECONDS);
    } else {
        setTimeLeft(BREAK_DURATION_SECONDS);
    }
  }, [mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const totalDuration = mode === TimerMode.WORK ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;

  return { timeLeft, isActive, mode, totalDuration, toggleTimer, reset, start, pause };
};
