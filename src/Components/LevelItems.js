import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid, Paper } from "@mui/material";
import DataElements from "./DataElements";

export default function LevelItems(props) {
  const [expanded, setExpanded] = React.useState(false);

  console.log(props);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid item xs={12} md={10} lg={10}>
      {props.groupset &&
        props.groupset.items?.map((item) => (
          <Accordion
            expanded={expanded === item.id}
            onChange={handleChange(item.id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                {item.description}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {item.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DataElements group={item}></DataElements>
            </AccordionDetails>
          </Accordion>
        ))}
    </Grid>
  );
}
