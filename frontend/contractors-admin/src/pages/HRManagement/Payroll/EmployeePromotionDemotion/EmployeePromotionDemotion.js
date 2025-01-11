import React, { Fragment, useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../../../components/ActionButton";
import { getAllEmployeePromotionDemotion, getAllModuleByRoleId } from "../../../../services/authapi";
import CardComponent from "../../../../components/CardComponent";
import Modaljs from "../../../../components/Modal";
import ReactPagination from "../../../../components/ReactPagination";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const EmployeePromotionDemotion = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [singlePlans, setSinglePlans] = useState(false);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);

  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: false,
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);


  const fetchPermissions = async () => {
    try {
      const userID = user.user_type; // Assuming `user_type` is the user's role identifier
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "HR Management");
        if (hrModule && hrModule.submodules) {
          const employeesSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "Payroll"
          );
          if (employeesSubmodule && employeesSubmodule.modulesOfSubModule.length > 0) {
            const employeeModuleOfSubModule = employeesSubmodule.modulesOfSubModule.find(
              (moduleOfSubModule) => moduleOfSubModule.title === "Employee Promotion Demotion"
            )
            if (employeeModuleOfSubModule) {
              setPermissions({
                create: Boolean(employeeModuleOfSubModule.create),
                update: Boolean(employeeModuleOfSubModule.update),
                delete: Boolean(employeeModuleOfSubModule.delete),
                view: true, // Ensure view is set explicitly to true
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setIsPermissionsLoading(false);
    }
  };

  console.log("permissions check kro kya hai", permissions.create, permissions.delete, permissions.update);


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
    { id: 0, title: t("user name"), value: edit?.user_name },
    { id: 1, title: t("Purpose"), value: edit?.purpose },
    { id: 2, title: t("Reason"), value: edit?.reason },
    { id: 3, title: t("new designation"), value: edit?.role_name },
    { id: 4, title: t("new team"), value: edit?.team_name },
    { id: 5, title: t("change in salary"), value: edit?.change_in_salary },
    {
      id: 6,
      title: t("Change in Salary Type"),
      value: edit?.change_in_salary_type,
    },
    {
      id: 7,
      title: t("Change in Salary Value"),
      value: edit?.change_in_salary_value,
    },
    {
      id: 8,
      title: t("Document"),
      src: edit?.document
        ? `${process.env.REACT_APP_API_URL}${edit?.document}`
        : "",
    },
  ];

  useEffect(() => {
    fetchEmployeePromotionData();
    fetchPermissions();
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
          link={`/EmployeePromotionDemotion/AddEmployeePromotionDemotion/new`}
          tag={permissions.create ? "Create" : undefined}
          >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Purpose")}</th>
                  <th>{t("Reason")}</th>
                  <th>{t("Change in Salary")}</th>
                  <th>{t("Change in Salary Type")}</th>
                  <th>{t("Change in Salary Value")}</th>
                  <th>{t("Action")}</th>
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
                        hideDelete={permissions.delete === true ? "" : "d-none"}
                        hideEdit={permissions.update === true ? "" : "d-none"} // Hide if no delete permission

                         // Hide if no delete permission
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
        title={t("View Insurance Company Plans")}
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
