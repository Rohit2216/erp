import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Select from "react-select";

const ReactPagination = ({
  pageSize,
  handlePageSizeChange,
  prevonClick,
  nextonClick,
  nextClassName,
  prevClassName,
  title,
  className = "rounded",
}) => {
  return (
    <div
      className={`d-grid bg-blue d-md-flex justify-content-center align-items-center gap-md-4 gap-3 ${className}`}
    >
      <span className="d-align gap-2">
        <small className="d-md-block d-none">Rows Per Page:</small>
        <Select
          menuPortalTarget={document.body}
          menuPlacement={"auto"}
          className="social-btn-re purple-combo w-auto"
          name={"rows_per_page"}
          // menuIsOpen={true}
          options={[
            { value: 8, label: "8" },
            { value: 15, label: "15" },
            { value: 25, label: "25" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
          ]}
          value={{ value: pageSize, label: pageSize }}
          onChange={handlePageSizeChange}
        />
      </span>
      <small>{title}</small>
      <span className="d-align gap-2">
        <span
          onClick={prevonClick}
          className={`social-btn-re d-align gap-2 px-3 w-auto ${prevClassName}`}
        >
          <BsChevronLeft /> <span className="d-md-block d-none">Prev</span>
        </span>
        <div className="vr hr-shadow"></div>
        <span
          onClick={nextonClick}
          className={`social-btn-re d-align gap-2 px-3 w-auto ${nextClassName}`}
        >
          <span className="d-md-block d-none">Next</span> <BsChevronRight />
        </span>
      </span>
    </div>
  );
};

export default ReactPagination;
