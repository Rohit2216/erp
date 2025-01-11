import React from "react";
import moment from "moment";
import { Col, Table } from "react-bootstrap";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { getAdminChangeClockTime } from "../../../services/authapi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const MemberClockOut = ({ clockOut, setRefresh, refresh }) => {
  const { t } = useTranslation();
  const handleClockOut = async (clockData) => {
    const sData = {
      id: clockData.id,
      type: "clock in",
    };
    const res = await getAdminChangeClockTime(sData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setRefresh(!refresh);
  };
  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <div className="table-scroll p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Employee Name")}</th>
                <th>{t("Date")}</th>
                <th>{t("Status")}</th>
                <th>{t("Clock Out")}</th>
              </tr>
            </thead>
            <tbody>
              {clockOut.length > 0 ? null : (
                <tr>
                  <td colSpan={5}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="230"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}
              {clockOut?.map((clockData, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <div className="text-truncate">
                      <img
                        className="avatar me-2"
                        src={
                          clockData?.user_image
                            ? `${process.env.REACT_APP_API_URL}${clockData?.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />
                      {clockData?.user_name}
                    </div>
                  </td>
                  <td>{moment(clockData?.date).format("YYYY-MM-DD")}</td>
                  <td>{clockData?.status}</td>
                  <td className="text-center">
                    <span className="d-align gap-2">
                      <span
                        onClick={() => handleClockOut(clockData)}
                        className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                      >
                        <BsBoxArrowInLeft /> {t("Clock In")}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Col>
    </>
  );
};

export default MemberClockOut;
