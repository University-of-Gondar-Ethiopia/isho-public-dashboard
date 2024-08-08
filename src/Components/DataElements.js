import React from "react";
import { useEffect } from "react";
import {
  TableContainer,
  TableBody,
  Table,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  Typography,
  Stack,
} from "@mui/material";

import theme from "../theme";

console.log(theme.palette["phase1"], "color");

const getRows = (dataElement) => {
  const attributesNumberic = dataElement?.attributeValues
    ?.filter(
      (attributeValue) =>
        attributeValue.attribute.name in ["1", "2", "3", "4", "5", "6", "7"]
    )
    .sort((a, b) => a.attribute.name - b.attribute.name);

  console.log(attributesNumberic, "attributesNumberic", dataElement);
  return attributesNumberic.map((attributeValue, i) => {
    return (
      <TableRow key={attributeValue.attribute.name}>
        <TableCell
          sx={{
            backgroundColor:
              theme.palette["phase" + attributeValue.attribute.name]?.main,
          }}
        >
          {attributeValue.attribute.name}
        </TableCell>
        <TableCell>{attributeValue.value}</TableCell>
      </TableRow>
    );
  });
};

export default function DataElements(props) {
  const [dataElements, setDataelements] = React.useState([]);

  useEffect(() => {
    const baseuri = process.env.REACT_APP_BASE_URI;
    const url =
      baseuri +
      "api/dataElementGroups/" +
      props?.group?.id +
      ".json?fields=dataElements[id,description,name,code,attributeValues[:all,attribute[id,name]]]";
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        let jsonData = JSON.parse(data);
        setDataelements(jsonData.dataElements);
      });
  }, []);

  console.log(dataElements, "dataelemetns");

  return (
    <Stack spacing={2}>
      {dataElements &&
        dataElements.map((dataElement, i) => {
          return (
            <div key={i}>
              <Typography textAlign={"center"}></Typography>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" colSpan={2}>
                        {dataElement.attributeValues.find(
                          (att) => att.attribute?.name == "CEE"
                        )?.value +
                          " - " +
                          dataElement.name}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <caption>{dataElement.description}</caption>

                  <TableBody>{getRows(dataElement)}</TableBody>
                </Table>
              </TableContainer>
            </div>
          );
        })}
    </Stack>
  );
}
