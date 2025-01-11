import React, { useEffect, useState } from "react";
import { Col, Form, Spinner, Table } from "react-bootstrap";
import ActionButton from "../../../components/ActionButton";
import moment from "moment";
import {
  getApprovelDataList,
  getApprovelMemberList,
  postApprovelMemberList,
} from "../../../services/authapi";
import { Formik } from "formik";
import Select from "react-select";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../../components/ReactPagination";
import { toast } from "react-toastify";

const AssignComplaint = ({ refresh }) => {
  const [approvedData, setApprovedData] = useState([]);
  const [assign, setAssign] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [checkedRowIds, setCheckedRowIds] = useState([]);

  const fetchApprovedData = async () => {
    const res = await getApprovelDataList(search, pageSize, pageNo);
    if (res.status) {
      setApprovedData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setApprovedData([]);
      setPageDetail({});
    }
  };

  const handleCheckboxChange = (id) => {
    if (checkedRowIds.includes(id)) {
      setCheckedRowIds(checkedRowIds.filter((rowId) => rowId !== id));
    } else {
      setCheckedRowIds([...checkedRowIds, id]);
    }
  };

  const handlerSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      role_id: values.role_id.value,
      complaint_list: checkedRowIds,
    };
    // return console.log('sData', sData)
    const res = await postApprovelMemberList(sData);
    if (res.status) {
      toast.success(res.message);
      fetchApprovedData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  // Only Use for Assign
  const fetchAssignData = async () => {
    const res = await getApprovelMemberList();
    if (res.status) {
      setAssign(res.data);
    } else {
      setAssign([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchApprovedData();
    fetchAssignData();
  }, [search, pageSize, pageNo, refresh]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          role_id: "",
          complaint_list: [""],
        }}
        // validationSchema={addComplaintSchema}
        onSubmit={handlerSubmit}
      >
        {(props) => (
          <Form onSubmit={props?.handleSubmit}>
            <div className="d-flex align-items-end justify-content-between mb-3 gap-3">
              <div className="d-flex align-items-end gap-3">
                <Form.Group>
                  <Form.Label>select role</Form.Label>
                  <Select
                    name={"role_id"}
                    menuPortalTarget={document.body}
                    // isMulti
                    value={props.values.role_id}
                    options={assign.map((list) => ({
                      label: list?.name,
                      value: list?.id,
                    }))}
                    onChange={(e) => props.setFieldValue("role_id", e)}
                  />
                </Form.Group>
                <button
                  type={"submit"}
                  disabled={props?.isSubmitting}
                  className="social-btn-re border-0 d-align gap-2 px-3 w-auto success-combo"
                >
                  {props?.isSubmitting ? (
                    <>
                      <Spinner animation="border" variant="primary" size="sm" />
                      PLEASE WAIT...
                    </>
                  ) : (
                    <>{"Submit"}</>
                  )}
                </button>
              </div>
              <span className="position-relative">
                <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  className="me-2 w-auto"
                  aria-label="Search"
                />
              </span>
            </div>
            <div className="overflow-auto p-2">
              <Table className="text-body bg-new Roles">
                <thead className="text-truncate">
                  <tr>
                    {[
                      "Approval",
                      "Sr No.",
                      "Energy Company Name",
                      "Complaint No",
                      "Complaint Type",
                      "Date",
                      "Status",
                      "Action",
                    ].map((thead) => (
                      <th key={thead}>{thead}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvedData?.length > 0 ? null : (
                    <tr>
                      <td colSpan={9}>
                        <img
                          className="p-3"
                          alt="no-result"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </td>
                    </tr>
                  )}
                  {approvedData?.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <Form.Check
                          checked={checkedRowIds.includes(row.id)}
                          onChange={() => handleCheckboxChange(row.id)}
                          name="complaint_list"
                          type={"checkbox"}
                          id={row.id}
                        />
                      </td>
                      <td>{serialNumber[idx]}</td>
                      <td>{row.ec_name}</td>
                      <td>{row.complaint_unique_id}</td>
                      <td>{row.complaint_type_name}</td>
                      <td>
                        {moment(row.complaint_create_date).format("DD-MM-YYYY")}
                      </td>
                      <td className="text-green">New Complaint</td>
                      <td>
                        <ActionButton
                          eyelink={`/AllComplaintsMasterdata/ViewUserComplaint/${row?.id}`}
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
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
                    ? approvedData.length - 1 < pageSize
                      ? "danger-combo-disable pe-none"
                      : "success-combo"
                    : approvedData.length < pageSize
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
          </Form>
        )}
      </Formik>
    </Col>
  );
};

export default AssignComplaint;
