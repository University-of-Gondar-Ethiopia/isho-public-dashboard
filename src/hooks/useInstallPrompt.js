import { useState, useEffect } from "react";

const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(() => {
    // Check localStorage to persist install state across sessions
    const storedValue = localStorage.getItem("isAppInstalled");
    return storedValue === "true" || window.matchMedia("(display-mode: standalone)").matches;
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt event triggered");
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("beforeinstallprompt event fired and deferred prompt is set");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Clean up the event listener
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const promptInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
          setIsAppInstalled(true);
          localStorage.setItem("isAppInstalled", "true"); // Persist the state
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    } else if (isAppInstalled) {
      alert("The app is already installed.");
    } else {
      console.log("Deferred prompt is not set");
    }
  };

  return { isAppInstalled, promptInstall };
};

export default useInstallPrompt;
