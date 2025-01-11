import React, { Fragment, useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../../../components/ActionButton";
import {
  DeletePensionRetirment,
  getAllPensionRetirment,
  getAllModuleByRoleId,
} from "../../../../services/authapi";
import CardComponent from "../../../../components/CardComponent";
import Modaljs from "../../../../components/Modal";
import moment from "moment";
import ConfirmAlert from "../../../../components/ConfirmAlert";
import { toast } from "react-toastify";
import ReactPagination from "../../../../components/ReactPagination";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const EmployeeRetirement = () => {
  const [retirement, setRetirementData] = useState([]);
  const [singlePlans, setSinglePlans] = useState(false);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
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

  const fetchRetirementData = async () => {
    const res = await getAllPensionRetirment(search, pageSize, pageNo);
    if (res.status) {
      setRetirementData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRetirementData([]);
      setPageDetail({});
    }
  };

  const handleView = async (data) => {
    setEdit(data);
    setSinglePlans(true);
  };

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
              (moduleOfSubModule) => moduleOfSubModule.title === "Employee Retirement"
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

  const singleoutletsList = [
    { id: 0, title: t("Name"), value: edit?.name },
    {
      id: 1,
      title: t("retirement date"),
      value: moment(edit?.retirement_date).format("DD-MM-YYYY"),
    },
    { id: 2, title: t("asset recovery"), value: edit?.asset_recovery },
    {
      id: 3,
      title: t("pension status"),
      value: edit?.pension_status == "1" ? "Active" : "Inactive",
    },
    { id: 4, title: t("pension amount"), value: edit?.pension_amount },
    { id: 5, title: t("Pension Duration"), value: edit?.pension_duration },
    {
      id: 6,
      title: t("allow commutation"),
      value: Boolean(edit?.allow_commutation) == false ? "No" : "Yes",
    },
    { id: 7, title: t("commute percentage"), value: edit?.commute_percentage },
    {
      id: 8,
      title: t("retirement gratuity"),
      value: edit?.retirement_gratuity,
    },
    { id: 9, title: t("service gratuity"), value: edit?.service_gratuity },
  ];

  const handleDelete = async () => {
    const res = await DeletePensionRetirment(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRetirementData((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchRetirementData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchRetirementData();
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
        <title>All Employee Retirement · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Employee Retirement"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          link={`/EmployeeRetirement/AddEmployeeRetirement/new`}
          tag={permissions.create ? "Create" : undefined}
          >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("User Name")}</th>
                  <th>{t("Retirement Date")}</th>
                  <th>{t("Pension Amount")}</th>
                  <th>{t("Pension Duration")}</th>
                  <th>{t("Commute Percentage")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {retirement.length > 0 ? null : (
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
                {retirement?.map((data, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{data.name}</td>
                    <td>{moment(data.retirement_date).format("YYYY-MM-DD")}</td>
                    <td>{data.pension_amount}</td>
                    <td>{data.pension_duration}</td>
                    <td>{data.commute_percentage}</td>
                    <td>
                      <ActionButton
                        hideDelete={permissions.delete === true ? "" : "d-none"} // Hide if no delete permission
                        hideEdit={permissions.update === true ? "" : "d-none"} // Hide if no delete permission
                        hideEye={permissions.view === true ? "" : "d-none"} // Hide if no delete permission

                        deleteOnclick={() => {
                          setIdToDelete(data.id);
                          setShowAlert(true);
                        }}
                        eyeOnclick={() => handleView(data)}
                        editlink={`/EmployeeRetirement/AddEmployeeRetirement/${data.id}`}
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
                  ? retirement.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : retirement.length < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
              }
              title={`Showing ${pageDetail?.pageStartResult || 0} to ${pageDetail?.pageEndResult || 0
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
            details?.value ? (
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

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default EmployeeRetirement;
