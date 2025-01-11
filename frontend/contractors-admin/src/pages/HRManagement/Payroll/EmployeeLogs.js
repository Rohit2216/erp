import React, { useEffect } from "react";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import TooltipComponent from "../../../components/TooltipComponent";
import { useState } from "react";
import { getAllEmployeeLogs } from "../../../services/authapi";
import moment from "moment";
import ReactPagination from "../../../components/ReactPagination";
import { useTranslation } from "react-i18next";

const EmployeeLogs = () => {
  const [employeeLogs, setEmployeeLogs] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();

  const fetchEmployeeLogsData = async () => {
    const res = await getAllEmployeeLogs(search, pageSize, pageNo);
    if (res.status) {
      setEmployeeLogs(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setEmployeeLogs([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchEmployeeLogsData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Employee Logs · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"Employee Logs"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <div className="table-scroll p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Employee Name")}</th>
                <th>{t("Activity Time")}</th>
                <th>{t("Activity Description")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {employeeLogs.length > 0 ? null : (
                <tr>
                  <td colSpan={7}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}
              {employeeLogs?.map((data, idx) => (
                <tr key={idx}>
                  <td>{serialNumber[idx]}</td>
                  <td>
                    <div className="text-truncate">
                      <img
                        className="avatar me-2"
                        src={
                          data?.image
                            ? `${process.env.REACT_APP_API_URL}${data?.image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />
                      {data?.user_name}
                    </div>
                  </td>
                  <td>{moment.unix(data?.timestamp).format("DD-MM-YYYY")}</td>
                  <td>
                    <div className="text-truncate2">{data?.action}</div>
                  </td>
                  <td>
                    <TooltipComponent title={"View"}>
                      <Link to={`/EmployeeLogs/EmployeeActivity/${data?.id}`}>
                        <BsEyeFill className="social-btn success-combo" />
                      </Link>
                    </TooltipComponent>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? employeeLogs.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : employeeLogs.length < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
            }
            title={`Showing ${pageDetail?.pageStartResult || 0} to ${
              pageDetail?.pageEndResult || 0
            } of ${pageDetail?.total || 0}`}
            handlePageSizeChange={handlePageSizeChange}
            prevonClick={() => setPageNo(pageNo - 1)}
            nextonClick={() => setPageNo(pageNo + 1)}
          />
        </div>
      </CardComponent>
    </Col>
  );
};

export default EmployeeLogs;
