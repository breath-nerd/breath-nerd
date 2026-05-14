import { useState, useEffect } from "react";
import { User } from "./types";
import LoginModal from "./components/LoginModal";
import BreathingPage from "./components/BreathingPage";

/*
  App.tsx Todo
  [x] 1. Imports — done!
  [ ] 2. State: user (User | null), loading (true), showLogin (boolean)
  [ ] 3. Auth check on load: useEffect calling GET /auth/verify, sets user or null, sets loading to false either way
  [ ] 4. Logout handler: calls POST /auth/logout, on success sets user to null
  [ ] 5. Render logic: loading → null, no user → <LoginModal onLogin />, user → <BreathingPage handleLogout />
*/
