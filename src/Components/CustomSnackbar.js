import { Alert, Snackbar, Button } from "@mui/material";

export default function CustomSnackbar({
  message,
  action,
  ButtonProps,
  SnackbarProps,
  customParameters,
}) {
  return (
    <Snackbar autoHideDuration={3000} {...SnackbarProps}>
      <Alert
        severity={customParameters?.type}
        action={
          action != null && (
            <Button color="inherit" size="small" {...ButtonProps}>
              {action}
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
