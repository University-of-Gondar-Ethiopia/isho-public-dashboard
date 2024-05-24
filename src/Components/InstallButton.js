import React from "react";
import Button from "@mui/material/Button";
import useInstallPrompt from "./../hooks/useInstallPrompt";

const InstallButton = () => {
  const { isAppInstalled, promptInstall } = useInstallPrompt();

  return (
    <Button
      variant="contained"
      color={!isAppInstalled ? "primary" : "secondary"}
      sx={{ padding: "10px" }}
      onClick={promptInstall}
    >
      {isAppInstalled ? "App Already Installed" : "Install App"}
    </Button>
  );
};

export default InstallButton;