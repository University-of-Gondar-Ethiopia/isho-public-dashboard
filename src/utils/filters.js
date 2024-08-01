import { getObjectItems } from "./common";

const getFilters = function (dataFilter, orgunitFilter) {
  let filters = "";

  for (const filter of dataFilter) {
    if (
      filter.dimension == "ou" &&
      (orgunitFilter?.orgunits?.length > 0 ||
        orgunitFilter?.orgunitGroup?.length > 0 ||
        orgunitFilter?.orgunitLevel?.length > 0)
    ) {
      console.log("hit");
      continue;
    }

    filters += "&filter=" + filter.dimension;
    if (filter.items.length > 0) {
      let filterItemsId = getObjectItems(filter, "id");

      let filterDimensionItems = getObjectItems(filter, "dimensionItem");
      if (filterItemsId.length > 0) {
        filters += ":" + filterItemsId.join(";");
      }
      if (filterDimensionItems.length > 0) {
        filters += ":" + filterDimensionItems.join(";");
      }
    }
  }

  if (orgunitFilter) {
    filters += "&filter=ou:";

    filters += orgunitFilter.orgunitGroup.map((g) => "OU_GROUP-" + g).join(";");

    filters += orgunitFilter.orgunitLevel.map((l) => "LEVEL-" + l).join(";");

    filters += orgunitFilter.orgunits.join(";");
  }
};

const getDimensions = function (data) {
  let dimension = "";
  for (const col of data.columns) {
    dimension += "dimension=";
    dimension += col.dimension;

    if (col.filter) {
      dimension += ":" + col.filter;
    }

    if (col.items.length > 0) {
      let colItemsId = getObjectItems(col, "id", data.dataDimensionItems);

      let colDimensionItems = getObjectItems(col, "dimensionItem");
      if (colItemsId.length > 0) {
        dimension += ":" + colItemsId.join(";");
      }
      if (colDimensionItems.length > 0) {
        dimension += ":" + colDimensionItems.join(";");
      }
    }
  }

  for (const row of data.rows) {
    dimension += "&dimension=";
    dimension += row.dimension;

    if (row.filter) {
      dimension += ":" + row.filter;
    }

    if (row.items.length > 0) {
      let rowItemsId = getObjectItems(row, "id");
      let rowDimensionItems = getObjectItems(row, "dimensionItem");

      if (rowItemsId.length > 0) {
        dimension += ":" + rowItemsId.join(";");
      }
      if (rowDimensionItems.length > 0) {
        dimension += ":" + rowDimensionItems.join(";");
      }
    }
  }

  return dimension;
};

const getOuDimensions = function (rows, item) {
  let ou_dimension;
  for (const row of rows) {
    if (row.items.length > 0) {
      let rowItemsId = getObjectItems(row, "id");
      if (rowItemsId.length > 0) {
        if (row.dimension == "ou" && item.type == "MAP") {
          ou_dimension = "ou:" + rowItemsId.join(";");
        } // orgunit dimentions loading shapes from the API
      }
    }
  }
  return ou_dimension;
};

export { getFilters, getDimensions, getOuDimensions };
