import moment from "moment";
import React from "react";
import { Col, Table } from "react-bootstrap";
import TooltipComponent from "../../../components/TooltipComponent";
import { BsEyeFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const LeaveHistory = ({ data = [], handleEdit }) => {
  const { t } = useTranslation();

  return (
    <Col md={12} data-aos={"fade-up"}>
      <div className="table-scroll p-2">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              <th>{t("Id")}</th>
              <th>{t("Employee Name")}</th>
              <th>{t("Duration")}</th>
              <th>{t("Start Date")}</th>
              <th>{t("End Date")}</th>
              <th>{t("Leave Type")}</th>
              <th>{t("Status")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  <img
                    className="p-3"
                    alt="no-result"
                    width="280"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                  <p>{t("No leave history available.")}</p>
                </td>
              </tr>
            ) : (
              data.map((ele) => (
                <tr key={ele.id}>
                  <td>{ele.id}</td>
                  <td>
                    <div className="text-truncate">
                      <img
                        className="avatar me-2"
                        src={
                          ele.image
                            ? `${process.env.REACT_APP_API_URL}/${ele.image}`
                            : "./assets/images/default-image.png"
                        }
                        alt="user-img"
                      />
                      {ele?.applicant_name || t("N/A")}
                    </div>
                  </td>
                  <td>
                    {ele?.total_days || 0} {t("Days")}{" "}
                    {ele?.total_hours || 0} {t("Hours")}
                  </td>
                  <td>{ele?.start_date ? moment(ele.start_date).format("DD/MM/YYYY") : t("N/A")}</td>
                  <td>{ele?.end_date ? moment(ele.end_date).format("DD/MM/YYYY") : t("N/A")}</td>
                  <td>{ele?.leave_type || t("N/A")}</td>
                  <td
                    className={`fw-bold ${
                      ele?.status === "rejected" ? "text-danger" : ""
                    }`}
                  >
                    {ele?.status
                      ? t(ele.status.charAt(0).toUpperCase() + ele.status.slice(1))
                      : t("N/A")}
                  </td>
                  <td>
                    <span className="d-align gap-2">
                      <TooltipComponent title={t("View")}>
                        <BsEyeFill
                          onClick={() => handleEdit(ele)}
                          className="social-btn success-combo"
                        />
                      </TooltipComponent>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Col>
  );
};

export default LeaveHistory;
