import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BsEyeFill, BsPencilSquare, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import TooltipComponent from "./TooltipComponent";

const ActionButton = ({
  className,
  eyelink,
  editlink,
  hideEdit,
  custom,
  hideDelete,
  editOnclick,
  deleteOnclick,
  eyeOnclick,
  hideEye,
}) => {
  const { t } = useTranslation();
  return (
    <span className={`d-align gap-2 ${className}`}>
      <TooltipComponent title={t("View")}>
        <Button
          className="view-btn"
          variant="light"
          as={eyelink ? Link : null}
          to={eyelink}
        >
          <BsEyeFill
            onClick={eyeOnclick}
            className={`social-btn success-combo ${hideEye}`}
          />
        </Button>
      </TooltipComponent>
      <div className={`vr hr-shadow ${hideEye} ${hideEdit}`}></div>
      <TooltipComponent title={t("Edit")}>
        <Button
          className="view-btn"
          variant="light"
          as={editlink ? Link : null}
          to={editlink}
        >
          <BsPencilSquare
            onClick={editOnclick}
            className={`social-btn danger-combo ${hideEdit}`}
          />
        </Button>
      </TooltipComponent>
      <div className={`vr hr-shadow ${hideDelete}`}></div>
      <TooltipComponent title={t("Delete")}>
        <BsTrash
          onClick={deleteOnclick}
          className={`social-btn red-combo ${hideDelete}`}
        />
      </TooltipComponent>
      {custom}
    </span>
  );
};

export default ActionButton;
