import React from "react";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact Theme
import "primereact/resources/primereact.min.css"; // PrimeReact Core CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS

export default function MultiSelectVisibility({
  headerNames,
  setColumn,
  column,
}) {
  return (
    <MultiSelect
      value={column}
      onChange={(e) => setColumn(e.value)}
      options={headerNames}
      optionLabel="name"
      //   filter  //for search functionality
      placeholder="Select column"
      maxSelectedLabels={3}
      className="w-100 w-md-50 my-bg"
    />
  );
}
