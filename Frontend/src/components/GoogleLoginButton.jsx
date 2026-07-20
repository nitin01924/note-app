import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_SCRIPT_URL = "https://accounts.google.com/gsi/client";

function GoogleLoginButton({ onCredential, disabled = false }) {
  const buttonRef = useRef(null);
  const callbackRef = useRef(onCredential);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    // The application theme lives on the root element. Watching its class lets
    // the GIS-rendered button update when the user changes theme.
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!clientId || disabled) return undefined;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      // GIS returns an ID token to this callback. The backend—not the browser—
      // verifies its signature and audience before issuing the app's own JWT.
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => callbackRef.current(credential),
      });

      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: isDarkMode ? "filled_black" : "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: buttonRef.current.offsetWidth || 320,
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return undefined;
    }

    let script = document.getElementById(GOOGLE_SCRIPT_ID);
    if (!script) {
      script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = GOOGLE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", renderGoogleButton);
    return () => script.removeEventListener("load", renderGoogleButton);
  }, [clientId, disabled, isDarkMode]);

  if (!clientId) {
    return (
      <div className="rounded-lg dark:bg-black dark:p-2">
        <button
          type="button"
          disabled
          className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 font-semibold text-slate-500 opacity-75 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
        >
          <span className="text-lg font-bold text-blue-600">G</span>
          Continue with Google
        </button>
        <p className="mt-2 text-center text-xs text-amber-700 dark:text-amber-300">
          Add VITE_GOOGLE_CLIENT_ID to Frontend/.env, then restart Vite.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg dark:bg-black dark:p-2">
      <div
        ref={buttonRef}
        className={disabled ? "pointer-events-none opacity-60" : ""}
        aria-label="Continue with Google"
      />
    </div>
  );
}

export default GoogleLoginButton;
