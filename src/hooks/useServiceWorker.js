import { useEffect } from "react";

const useServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerServiceWorker = () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          })
          .catch((err) => {
            console.log("ServiceWorker registration failed: ", err);
          });
      };

      window.addEventListener("load", registerServiceWorker);

      return () => {
        window.removeEventListener("load", registerServiceWorker);
      };
    }
  }, []);
};

export default useServiceWorker;
