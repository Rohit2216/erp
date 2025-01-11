import React, { useEffect, useState } from "react";
import { Col, Form, Spinner, Table } from "react-bootstrap";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import { Formik } from "formik";
import Select from "react-select";
import { BsSearch } from "react-icons/bs";
import moment from "moment";
import {
  getAdminAllPendingComplaint,
  getAdminZone,
  getRoOnZoneId,
} from "../../../services/authapi";
import { toast } from "react-toastify";

const PendingComplaint = () => {
  const [pendingData, setPendingData] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchPendingData = async () => {
    const sData = {
      custom_date: "",
      regional_id: 0,
      zone_id: 0,
    };
    const res = await getAdminAllPendingComplaint(
      search,
      pageSize,
      pageNo,
      sData
    );
    if (res.status) {
      setPendingData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPendingData([]);
      setPageDetail({});
    }
  };

  const handlerSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      custom_date: moment(values.custom_date).format("DD-MM-YYYY"),
      regional_id: values.regional_id.value,
      zone_id: values.zone_id.value,
    };
    // return console.log('sData', sData)
    const res = await getAdminAllPendingComplaint(
      search,
      pageSize,
      pageNo,
      sData
    );
    if (res.status) {
      setPendingData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPendingData([]);
      setPageDetail({});
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  const handleZoneChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("zone_id", val);
    }
    if (!val) return false;
    fetchRoData(val.value);
  };

  // Only Use for Zone Name
  const fetchZoneData = async () => {
    const res = await getAdminZone();
    if (res.status) {
      setAllZones(res.data);
      // setEdit
    } else {
      setAllZones([]);
    }
  };

  // Only Use for Regional Office
  const fetchRoData = async (zone_id) => {
    const res = await getRoOnZoneId(zone_id);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchPendingData();
    fetchZoneData();
  }, [search, pageSize, pageNo]);

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
          custom_date: "",
          regional_id: "",
          zone_id: "",
        }}
        // validationSchema={addComplaintSchema}
        onSubmit={handlerSubmit}
      >
        {(props) => (
          <Form
            onSubmit={props?.handleSubmit}
            className="d-flex align-items-end justify-content-between mb-3 gap-3"
          >
            <div className="d-flex align-items-end gap-3">
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  value={props.values.custom_date}
                  type="date"
                  name={"custom_date"}
                  onChange={props.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Zone Name</Form.Label>
                <Select
                  name={"zone_id"}
                  menuPortalTarget={document.body}
                  onChange={(e) => handleZoneChange(e, props.setFieldValue)}
                  value={props.values.zone_id}
                  options={allZones.map((zone) => ({
                    label: zone?.zone_name,
                    value: zone?.zone_id,
                  }))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Regional Office Name</Form.Label>
                <Select
                  name={"regional_id"}
                  menuPortalTarget={document.body}
                  value={props.values.regional_id}
                  options={allRo.map((ro) => ({
                    label: ro?.regional_office_name,
                    value: ro?.ro_id,
                  }))}
                  onChange={(e) => props.setFieldValue("regional_id", e)}
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
          </Form>
        )}
      </Formik>
      <div className="overflow-auto p-2">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              {[
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
            {pendingData?.length > 0 ? null : (
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
            {pendingData?.map((complaint, idx) => (
              <tr key={idx}>
                <td>{serialNumber[idx]}</td>
                <td>{complaint.ec_name}</td>
                <td>{complaint.complaint_unique_id}</td>
                <td>{complaint.complaint_type_name}</td>
                <td>{complaint.complaint_create_date}</td>
                <td className="text-warning">Pending</td>
                <td>
                  <ActionButton
                    eyelink={`/AllComplaintsMasterdata/ViewUserComplaint/${complaint?.id}`}
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
              ? pendingData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : pendingData.length < pageSize
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
    </Col>
  );
};

export default PendingComplaint;
