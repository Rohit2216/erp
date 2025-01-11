import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import ActionButton from "../../../components/ActionButton";
import { DeleteGroupInsurance } from "../../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { getAllGroupInsurance } from "../../../services/authapi";
import ReactPagination from "../../../components/ReactPagination";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { DELETED } from "../../../utils/constants";

const GroupInsurance = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [groupData, setGroupData] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchGroupInsuranceData = async () => {
    const res = await getAllGroupInsurance(search, pageSize, pageNo);
    if (res.status) {
      setGroupData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setGroupData([]);
      setPageDetail({});
    }
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await DeleteGroupInsurance(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setGroupData((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchGroupInsuranceData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchGroupInsuranceData();
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
        <title>All Group Insurance · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Group Insurance"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          link={`/GroupInsurance/AddGroupInsurance`}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "insu. for",
                    "insu. company name",
                    "insu. plan name",
                    "insu. applied on",
                    "insu. deduction amt.",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupData.length > 0 ? null : (
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
                {groupData?.map((group, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{group.insurance_for}</td>
                    <td>{group.insurance_company_name}</td>
                    <td>{group.insurance_plan_name}</td>
                    <td>
                      {group?.insurance_applied_on?.map((itm, id2) => {
                        return (
                          <>
                            <span key={itm?.id} className="d-block">
                              <span className="fw-bold pe-1">{id2 + 1}.</span>
                              {itm?.employee_name || itm?.designation_name}
                            </span>
                          </>
                        );
                      })}
                    </td>
                    <td>₹ {group.insurance_deduction_amount}</td>
                    <td>
                      <ActionButton
                        eyelink={`/GroupInsurance/ViewGroupInsurance/${group.id}`}
                        deleteOnclick={() => {
                          setIdToDelete(group.id);
                          setShowAlert(true);
                        }}
                        editlink={`/GroupInsurance/AddGroupInsurance/${group.id}`}
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
                  ? groupData.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : groupData.length < pageSize
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

export default GroupInsurance;
