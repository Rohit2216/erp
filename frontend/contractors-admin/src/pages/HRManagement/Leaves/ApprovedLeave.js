import moment from "moment";
import React from "react";
import { Col, Table } from "react-bootstrap";
import { BsEyeFill } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
const ApprovedLeave = ({ data, handleEdit }) => {
  const { t } = useTranslation();
  return (
    <Col md={12} data-aos={"fade-up"}>
      <div className="table-scroll p-2">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              <th>{t("Id")}</th>
              <th>{t("Employee Name")}</th>
              <th>{t("Start Date")}</th>
              <th>{t("End Date")}</th>
              <th>{t("Leave Type")}</th>
              <th>{t("Status")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? null : (
              <tr>
                <td colSpan={7}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="280"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              </tr>
            )}
            {data?.map((ele) => (
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
                    {ele?.applicant_name}
                  </div>
                </td>
                {/* <td>
                  {ele?.total_days}.00 Days {ele?.total_hours} Hours
                </td> */}
                <td>{moment(ele?.start_date).format("DD/MM/YYYY")}</td>
                <td>{moment(ele?.end_date).format("DD/MM/YYYY")}</td>
                <td>{ele?.leave_type}</td>
                <td className="text-green fw-bold">
                  {ele?.status === "approved" && "Approved"}
                </td>
                <td>
                  <span className="d-align gap-2">
                    <TooltipComponent title={"View"}>
                      <BsEyeFill
                        onClick={() => handleEdit(ele)}
                        className="social-btn success-combo"
                      />
                    </TooltipComponent>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Col>
  );
};

export default ApprovedLeave;
