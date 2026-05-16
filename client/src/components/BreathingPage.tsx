import { useState, useEffect } from "react";
import type { User } from "../types";

type BreathingPageProps = {
  user: User | null;
  onLogout: () => Promise<void>;
  isBlurred?: boolean;
};

/*
  BreathingPage MVP Plan

  Goal:
  Build the logged-in breathing experience:
  landing view → guided breathing session → completion view.

  Props:
  [ ] Accept props from App.tsx:
      - user: User | null
      - onLogout: () => Promise<void>
      - isBlurred?: boolean

  Initial UI:
  [ ] Show a simple landing screen when no session is active:
      - greeting / welcome text
      - static breathing circle
      - Start button
      - Logout button

  Component State:
  [ ] Add state for breathing flow:
      - isBreathing
      - phase: "idle" | "inhale" | "hold" | "exhale" | "complete"
      - count
      - sessionComplete
      - elapsedTime or timeRemaining

  Start Behavior:
  [ ] When Start is clicked:
      - start the session
      - set phase to "inhale"
      - set count to 4
      - reset completion state
      - start total session timer

  Breathing Logic:
  [ ] Use useEffect + interval to count down every second.
  [ ] Inhale countdown:
      - Inhale: 4, 3, 2, 1
  [ ] Exhale countdown:
      - Exhale: 6, 5, 4, 3, 2, 1
  [ ] Loop inhale/exhale until the full session time is reached.

  MVP Timing:
  [ ] Start simple:
      - inhale 4 seconds
      - exhale 6 seconds
      - repeat for 120 seconds

  After MVP Works:
  [ ] Add hold pauses:
      - hold after inhale
      - hold after exhale
  [ ] Add smoother circle animation.
  [ ] Add better visual styling.

  Completion Screen:
  [ ] When total session time reaches 120 seconds:
      - stop breathing timer
      - mark session as complete
      - show completion message
  [ ] Show completion buttons:
      - Start Again
      - Finish / Logout

  Actions:
  [ ] Start Again resets the breathing session.
  [ ] Finish / Logout calls onLogout().

  Page Blur:
  [ ] If isBlurred is true, apply a blurred class to the page.
  [ ] Style the blurred state in CSS.

  Integration:
  [ ] Make sure App.tsx passes:
      - user
      - onLogout
      - isBlurred if needed
  [ ] Test frontend ↔ backend auth flow.

  Stretch:
  [ ] Save completed breathing session to Supabase.
*/

function BreathingPage({ user, onLogout, isBlurred }) {
  const [breathe, setBreathe] = useState(false);
  const [phase, setPhase] = useState("notStarted");
  const [count, setCount] = useState(4);
  const [timeRemaining, setTimeRemaining] = useState(140);

  function goToInhale() {
    setBreathe(true);
    setPhase("inhale");
    setCount(4);
  }

  function goToPauseAfterInhale() {
    setPhase("pauseAfterInhale");
    setCount(2);
  }

  function goToExhale() {
    setPhase("exhale");
    setCount(6);
  }

  function goToPauseAfterExhale() {
    setPhase("pauseAfterExhale");
    setCount(2);
  }

  function handleStart() {
    goToInhale();
  }

  function getPhaseDisplayText() {
    if (!breathe) {
      return "Breathe, Nerd";
    } else if (phase === "pauseAfterInhale" || phase === "pauseAfterExhale") {
      return "pause";
    } else {
      return phase;
    }
  }

  function getCountDisplayText() {
    if (!breathe) {
      return "";
    } else if (phase === "pauseAfterInhale" || phase === "pauseAfterExhale") {
      return "";
    } else {
      return count;
    }
  }

  useEffect(() => {
    if (!breathe) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(timer);
          setBreathe(false);
          return 140;
        }
        console.log("currentTime", currentTime);
        return currentTime - 1;
      });
      if (count > 1) {
        setCount((currentCount) => currentCount - 1);
      } else if (phase === "inhale") {
        goToPauseAfterInhale();
      } else if (phase === "pauseAfterInhale") {
        goToExhale();
      } else if (phase === "exhale") {
        goToPauseAfterExhale();
      } else if (phase === "pauseAfterExhale") {
        goToInhale();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [breathe, count, phase]);

  return (
    <main className="breathing-page">
      <section className="breathing-content">
        <h1>{getPhaseDisplayText()}</h1>

        <div className="breathing-circle">
          <span className="breathing-count">{getCountDisplayText()}</span>
        </div>

        {!breathe && <button onClick={handleStart}>npm install calm</button>}
      </section>
    </main>
  );
}

export default BreathingPage;
