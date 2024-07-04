import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ShareModal = ({ open, onClose, url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };
  return (
    <Box minHeight="2rem">
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Share this URL</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            {/* <Typography
              sx={{ fontWeight: "light", fontSize: "1.2rem", overflowWrap: "anywhere" }}
            > */}
            {url}
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <IconButton onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color={"inherit"} onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

ShareModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default ShareModal;
