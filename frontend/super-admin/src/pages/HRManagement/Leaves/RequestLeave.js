import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsCheckLg, BsEyeFill, BsXLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import TooltipComponent from "../../../components/TooltipComponent";
import {
  approvedLeaveRequest,
  getAllAppliedLeaves,
} from "../../../services/authapi";
import moment from "moment/moment";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";

const RequestLeave = ({ search, pageSize, pageNo, handleEdit, setRefresh, refresh }) => {
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  // const [refresh, setRefresh] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertOne, setShowAlertOne] = useState(false);
  const [idToApprove, setIdToApprove] = useState({
    id: "",
    status: "",
  });
  const [idToReject, setIdToReject] = useState({
    id: "",
    status: "",
  });

  const fetchData = async () => {
    const res = await getAllAppliedLeaves(search, pageSize, pageNo);
    if (res.status) {
      const rData = res.data.filter((e) => e.status === "pending");
      setAppliedLeaves(rData);
    } else {
      setAppliedLeaves([]);
    }
  };

  const handleApproveRequest = async () => {
    const rData = {
      id: idToApprove.id,
      status: idToApprove.status === "pending" ? "approved" : "pending",
    };
    const res = await approvedLeaveRequest(rData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIdToApprove("");
    setShowAlert(false);
    setRefresh(!refresh);
  };

  const handleRejectRequest = async () => {
    const rData = {
      id: idToReject.id,
      status: idToReject.status === "pending" ? "rejected" : "pending",
    };
    const res = await approvedLeaveRequest(rData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIdToReject("");
    setShowAlertOne(false);
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchData();
  }, [search, refresh]);

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <div className="overflow-auto p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                {[
                  "Id",
                  "Employee Name",
                  "Duration",
                  "Start Date",
                  "End Date",
                  "Leave Type",
                  "Action",
                ].map((thead) => (
                  <th key={thead}>{thead}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {
                appliedLeaves.length > 0 ? null : <tr><td colSpan={7}><img className='p-3' alt="no-result" width="280" src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`} /></td></tr>
              }
              {appliedLeaves?.map((ele) => (
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
                  <td>
                    {ele?.total_days}.00 Days {ele?.total_hours} Hours
                  </td>
                  <td>{moment(ele?.start_date).format("DD/MM/YYYY")}</td>
                  <td>{moment(ele?.end_date).format("DD/MM/YYYY")}</td>
                  <td>{ele?.leave_type}</td>
                  <td>
                    <span className="d-align gap-2">
                      <TooltipComponent title={"View Details"}>
                        {/* <Link to={`/ViewEmployeeLeave/${ele?.id}`}> */}
                        <span onClick={() => handleEdit(ele)} className="social-btn-re d-align gap-2 px-3 w-auto success-combo">
                          <BsEyeFill />
                        </span>
                        {/* </Link> */}
                      </TooltipComponent>
                      <div className="vr hr-shadow"></div>
                      {/* <TooltipComponent title={"Reject"}> */}
                      <span
                        onClick={() => {
                          setIdToReject({
                            id: ele?.id,
                            status: ele?.status,
                          });
                          setShowAlertOne(true);
                        }}
                        className="social-btn-re d-align gap-2 px-3 w-auto red-combo">
                        <BsXLg />
                      </span>
                      {/* </TooltipComponent> */}
                      <div className="vr hr-shadow"></div>

                      <span
                        onClick={() =>
                        // handleApproveRequest(ele?.id, ele?.status)
                        {
                          setIdToApprove({
                            id: ele?.id,
                            status: ele?.status,
                          });
                          setShowAlert(true);
                        }
                        }
                        className="social-btn-re d-align gap-2 px-3 w-auto success-combo">
                        <BsCheckLg />
                      </span>
                      {/* </TooltipComponent> */}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Col>
      <ConfirmAlert
        size={"sm"}
        icon={<BsCheckLg />}
        deleteFunction={handleApproveRequest}
        hide={setShowAlert}
        show={showAlert}
        title={"Approved?"}
        description={"Are you sure you want to Approve Leave Request!!"}
      />
      <ConfirmAlert
        size={"sm"}
        icon={<BsCheckLg />}
        deleteFunction={handleRejectRequest}
        hide={setShowAlertOne}
        show={showAlertOne}
        title={"Rejected?"}
        description={"Are you sure you want to Reject Leave Request!!"}
      />
    </>
  );
};

export default RequestLeave;
