import { useState, useEffect } from "react";
import type { User } from "./types";
import LoginModal from "./components/LoginModal";
import BreathingPage from "./components/BreathingPage";

/*
  App.tsx Todo
  [x] 1. Imports — done!
  [x] 2. State: user (User | null), loading (boolean, starts true) — drop showLogin, derive it from user being null
  [ ] 3. Auth check on load: useEffect calling GET /auth/verify, sets user or null, sets loading to false either way
  [ ] 4. Logout handler: calls POST /auth/logout, on success sets user to null
  [ ] 5. Render logic: loading → return null, no user → <LoginModal onLoginSuccess />, user → <BreathingPage user onLogout />
*/

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function authCheck() {
      try {
        const res = await fetch("/auth/verify", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    }
    authCheck();
  }, []);

  return <div></div>;
}

export default App;
