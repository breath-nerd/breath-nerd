import type { User } from "../types";

type BreathingPageProps = {
  user: User | null;
  onLogout: () => Promise<void>;
  isBlurred: boolean;
};

/*
  Priority Tasks

  [ ] Finish App.tsx auth/modal flow
  [ ] Build blurred landing page layout
  [ ] Build LoginModal overlay behavior
  [ ] Add start button
  [ ] Add placeholder breathing screen
  [ ] Add logout button
  [ ] Test frontend ↔ backend auth flow
*/

/*
  BreathingPage MVP Todo

  [ ] 1. Update props:
      - user: User | null
      - onLogout: () => Promise<void>
      - isBlurred: boolean

  [ ] 2. Add page blur:
      - apply "blurred" class when isBlurred is true
      - style blur in CSS

  [ ] 3. Build landing page layout:
      - static breathing circle
      - welcome/header text
      - start button

  [ ] 4. Add session state:
      - start
      - breathing
      - complete

  [ ] 5. Add breathing countdown:
      - Inhale: 4, 3, 2, 1
      - Hold: pause
      - Exhale: 6, 5, 4, 3, 2, 1
      - Hold: pause
      - repeat for about 2 minutes

  [ ] 6. Add completion screen:
      - show completed message
      - button to do it again
      - button to end session / logout

  Stretch Feature:
  [ ] Save completed session to database
*/

function BreathingPage() {
  return <div></div>;
}

export default BreathingPage;
