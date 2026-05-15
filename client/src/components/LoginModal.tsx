import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { User } from "../types"; 

type LoginModalProps = {
    onLoginSucccess: (user: User) => void; 
};

type AuthMode = "login" | "signup"; 

export default function LoginModal({ onLoginSucccess }: LoginModalProps) {
    const [mode, setMode] = useState<AuthMode>("login");
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(""); 
    const [isLoading, setIsLoading] = useState(false); 

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";

        const requestBody = mode === "login" ? { email, password } : { name, email, password };

        try{
            const response  = await fetch (endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", 
                body: JSON.stringify(requestBody)
            });

            const data = await response.json()

            if(!response.ok) {
                setError(data.error || "Something went wrong. please try again.");
            }
            onLoginSucccess(data.user);
        } catch (error) { 
            setError("Unable to connect. Please try again.")

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className= "modal-overlay">
            <section className="login-modal">
                <h1 className= "modal-title">
                    {mode === "login" ? "Log in" : "Create account"}
                </h1>

                <p className="modal-subtitle">
                    let go of the props that no longer serve you
                </p>
                
                <form className="auth-form">
                    {mode === "signup" && (
                        <label className="form-group">
                            Name
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </label>
                    )}

                    <label className="form-group">
                        Email
                        <input 
                            type="email" 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>

                    <label className="form-group">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </label>

                    {error && <p className="error-message">{error}</p>}
                    <button className="auth-button" type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : mode === "login"? "Log in" : "Create account"}
                    </button>
                </form>
                
                {mode === "login" ? (
                    <p className="auth-switch">
                        New here?{" "}
                        <button type="button" onClick={() => setMode("signup")}>
                            Create an account
                        </button>
                    </p>
                ):(
                    <p className="auth-switch">
                        Already have an account?{" "}
                        <button type="button" onClick={() => setMode("login")}>
                            Log in
                        </button>
                    </p>
                )}


            </section>
        </div>
    )
}



//onLoginSuccess: (user: User) => void


// interface LoginModalProps {
//   onLoginSuccess: (user: User) => void;
// }