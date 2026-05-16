import type { User } from "../types";

type BreathingPageProps = {
  user: User,
  onLogout: () => void
}

function BreathingPage({ user:_user, onLogout:_onLogout }: BreathingPageProps) {
  return <div></div>;
}

export default BreathingPage;
