// require('dotenv').config();

import React, { useState, useRef } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import emailjs from "@emailjs/browser";
const Form = () => {
  const form = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [request, setRequest] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAffiliationChange = (event) => {
    setAffiliation(event.target.value);
  };

  const handleRequestChange = (event) => {
    setRequest(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const recipient = process.env.REACT_APP_EMAIL_ADRESS;

    window.location.href = `mailto:${recipient}?subject=Request on ${affiliation}&body=${request}`;
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      padding={4}
      rowSpacing={2}
      spacing={4}
      sx={{ padding: "10px", marginTop: "5rem" }}
    >
      <Paper elevation={3}>
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ padding: "10px" }}
        >
          Request Form
        </Typography>
        <form ref={form} onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ padding: "15px" }}>
            <Grid item xs={12}>
              <TextField
                sx={{ padding: "10px" }}
                name="name"
                label="Full Name"
                variant="outlined"
                required
                fullWidth
                value={name}
                onChange={handleNameChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ padding: "10px" }}
                name="email"
                label="Email"
                variant="outlined"
                required
                fullWidth
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ padding: "10px" }}
                name="affiliation"
                label="Affiliation"
                variant="outlined"
                required
                fullWidth
                value={affiliation}
                onChange={handleAffiliationChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ padding: "10px" }}
              >
                <InputLabel htmlFor="request">Request</InputLabel>
                <OutlinedInput
                  name="request"
                  id="request"
                  multiline
                  rows={4}
                  required
                  label="Request"
                  value={request}
                  onChange={handleRequestChange}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ padding: "10px" }}
              >
                Submit Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default Form;
