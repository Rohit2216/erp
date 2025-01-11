import React, { Fragment, useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../../../components/ActionButton";
import { getAllEmployeePromotionDemotion } from "../../../../services/authapi";
import CardComponent from "../../../../components/CardComponent";
import Modaljs from "../../../../components/Modal";
import ReactPagination from "../../../../components/ReactPagination";

const EmployeePromotionDemotion = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [singlePlans, setSinglePlans] = useState(false);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchEmployeePromotionData = async () => {
    const res = await getAllEmployeePromotionDemotion(search, pageSize, pageNo);
    if (res.status) {
      setEmployeeData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setEmployeeData([]);
      setPageDetail({});
    }
  };

  const handleView = async (data) => {
    setEdit(data);
    setSinglePlans(true);
  };

  const singleoutletsList = [
    { id: 0, title: "user name", value: edit?.user_name },
    { id: 1, title: "purpose", value: edit?.purpose },
    { id: 2, title: "reason", value: edit?.reason },
    { id: 3, title: "new designation", value: edit?.role_name },
    { id: 4, title: "new team", value: edit?.team_name },
    { id: 5, title: "change in salary", value: edit?.change_in_salary },
    {
      id: 6,
      title: "change in salary type",
      value: edit?.change_in_salary_type,
    },
    {
      id: 7,
      title: "change in salary value",
      value: edit?.change_in_salary_value,
    },
    {
      id: 8,
      title: "Document",
      src: edit?.document
        ? `${process.env.REACT_APP_API_URL}${edit?.document}`
        : "",
    },
  ];

  useEffect(() => {
    fetchEmployeePromotionData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>All Employee Promotion Demotion · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Employee Promotion Demotion"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          link={`/EmployeePromotionDemotion/AddEmployeePromotionDemotion`}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "purpose",
                    "reason",
                    "change in salary",
                    "change in salary type",
                    "change in salary value",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employeeData.length > 0 ? null : (
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
                {employeeData?.map((data, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{data.purpose}</td>
                    <td>{data.reason}</td>
                    <td>{data.change_in_salary}</td>
                    <td>{data.change_in_salary_type}</td>
                    <td>
                      {data.change_in_salary_type == "amount" ? "₹" : null}
                      {data.change_in_salary_value}
                      {data.change_in_salary_type == "percentage" ? "%" : null}
                    </td>
                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        eyeOnclick={() => handleView(data)}
                        editlink={`/EmployeePromotionDemotion/AddEmployeePromotionDemotion/${data.id}`}
                      />
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
                  ? employeeData.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : employeeData.length < pageSize
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

      <Modaljs
        open={singlePlans}
        size={"md"}
        closebtn={"Cancel"}
        Savebtn={"Ok"}
        close={() => setSinglePlans(false)}
        title={"View Insurance Company Plans"}
      >
        <Row className="g-2 align-items-center">
          {singleoutletsList.map((details, id1) =>
            details?.value || details?.src ? (
              <Fragment key={id1}>
                <Col md={4}>{details.title}</Col>
                <Col md={8}>
                  <Form.Control
                    type={details.title === "Document" ? "image" : "text"}
                    className="fw-bolder"
                    size="100"
                    src={details.src}
                    value={details.value}
                    disabled
                  />
                </Col>
              </Fragment>
            ) : null
          )}
        </Row>
      </Modaljs>
    </>
  );
};

export default EmployeePromotionDemotion;
