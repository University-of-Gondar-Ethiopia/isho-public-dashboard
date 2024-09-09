// orgunit selector component
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useEffect } from "react";
import React from "react";

const OrgunitSelector = ({ filters, handelFilterSelect }) => {
  let apiBase = process.env.REACT_APP_BASE_URI;
  let [orgunits, setOrgunits] = React.useState([]);
  let [selectedOrgunit, setSelectedOrgunit] = React.useState(null);
  let [inputText, setInputText] = React.useState("");
  let [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputText) {
        setLoading(true);
        setOrgunits([]);
        fetch(
          encodeURI(
            apiBase +
              "api/organisationUnits?fields=id,displayName,path,attributeValues[attribute[code,id],value]&query=" +
              inputText +
              "&pageSize=10"
          )
        )
          .then((response) => {
            return response.text();
          })
          .then((data) => {
            let jsonData = JSON.parse(data);
            setOrgunits(jsonData.organisationUnits);
            setLoading(false);
          });
      }
    }, 500); // Delay in milliseconds (500ms in this case)

    return () => clearTimeout(delayDebounceFn);
  }, [inputText, selectedOrgunit, fetch]);

  return (
    <FormControl fullWidth>
      <Autocomplete
        id="CountrySelect"
        filterOptions={(x) => x}
        freeSolo
        options={orgunits}
        getOptionLabel={(option) => option.displayName}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Orgunits"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
        onChange={(event, newValue) => {
          setOrgunits(newValue ? [newValue, ...orgunits] : orgunits);
          setSelectedOrgunit(newValue);
          console.log("selected orgunit: ", newValue);
          handelFilterSelect(
            newValue ? [newValue?.id] : undefined,
            filters?.orgunitGroup,
            filters?.orgunitLevel,
            filters?.hideEmptyCharts,
            filters?.indicator,
            filters?.phase,
            filters?.filters
          );
        }}
        value={selectedOrgunit}
        onInputChange={(event, newInputValue) => {
          setInputText(newInputValue);
        }}
      />
    </FormControl>
  );
};

export default OrgunitSelector;
