import React, { Fragment, useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../../../components/ActionButton";
import {
  DeletePensionRetirment,
  getAllPensionRetirment,
} from "../../../../services/authapi";
import CardComponent from "../../../../components/CardComponent";
import Modaljs from "../../../../components/Modal";
import moment from "moment";
import ConfirmAlert from "../../../../components/ConfirmAlert";
import { toast } from "react-toastify";
import ReactPagination from "../../../../components/ReactPagination";
import { checkPermission } from "../../../../utils/checkPermissions";
import { DELETED } from "../../../../utils/constants";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/auth/authSlice";

const EmployeeRetirement = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [retirement, setRetirementData] = useState([]);
  const [singlePlans, setSinglePlans] = useState(false);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

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

  const singleoutletsList = [
    { id: 0, title: "Name", value: edit?.name },
    {
      id: 1,
      title: "retirement date",
      value: moment(edit?.retirement_date).format("DD-MM-YYYY"),
    },
    { id: 2, title: "asset recovery", value: edit?.asset_recovery },
    {
      id: 3,
      title: "pension status",
      value: edit?.pension_status == "1" ? "Active" : "Inactive",
    },
    { id: 4, title: "pension amount", value: edit?.pension_amount },
    { id: 5, title: "pension duration", value: edit?.pension_duration },
    {
      id: 6,
      title: "allow commutation",
      value: Boolean(edit?.allow_commutation) == false ? "No" : "Yes",
    },
    { id: 7, title: "commute percentage", value: edit?.commute_percentage },
    { id: 8, title: "retirement gratuity", value: edit?.retirement_gratuity },
    { id: 9, title: "service gratuity", value: edit?.service_gratuity },
  ];

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await DeletePensionRetirment(idToDelete, params);
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
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "User Name",
                    "retirement date",
                    "pension amount",
                    "pension duration",
                    "commute percentage",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
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
