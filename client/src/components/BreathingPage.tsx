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

  Done:
  [x] Accept props from App.tsx:
      - user: User | null
      - onLogout: () => Promise<void>
      - isBlurred?: boolean

  [x] Build initial landing view:
      - title
      - static breathing circle
      - start button

  [x] Add breathing state:
      - breathe
      - phase
      - count
      - timeRemaining

  [x] Add start behavior:
      - Start button begins session
      - session starts with inhale
      - count starts at 4

  [x] Add breathing loop:
      - inhale: 4, 3, 2, 1
      - pause after inhale
      - exhale: 6, 5, 4, 3, 2, 1
      - pause after exhale
      - repeat cycle

  [x] Display both pause phases as "pause"

  [x] Hide countdown number during pause phases

  [x] Stop session timer after 140 seconds

  Tomorrow:
  [ ] Replace temporary end behavior:
      - instead of returning to landing screen when timeRemaining reaches 0
      - set phase/session state to complete

  [ ] Build completion screen:
      - show completed message
      - show Start Again button
      - show Finish / Logout button

  [ ] Add Start Again behavior:
      - reset timeRemaining to 140
      - reset count
      - restart at inhale

  [ ] Add Finish / Logout behavior:
      - call onLogout()

  [ ] Clean up display helpers:
      - keep internal phase values specific
      - keep user-facing text simple

  [ ] Review unused props/state:
      - user
      - isBlurred
      - any temporary console logs

  [ ] Test full flow:
      - landing screen
      - start session
      - breathing loop
      - automatic completion after 140 seconds
      - start again
      - logout

  /*
  Stretch:
  [ ] Animate the breathing circle:
      - grow during inhale
      - hold during pause
      - shrink during exhale
      - hold during pause

  [ ] Personalize the welcome screen:
      - display the user's name after login
      - fallback gracefully if name is missing
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
