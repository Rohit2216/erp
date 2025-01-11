import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus, BsSearch } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import ActionButton from "../../../components/ActionButton";
import {
  getAdminAllEnergy,
  getAdminAllTypesComplaint,
  getAdminCreateTypesComplaint,
  getAdminUpdateTypesComplaint,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addTypesComplaintSchema } from "../../../utils/formSchema";
import moment from "moment/moment";
import Select from "react-select";
import ReactPagination from "../../../components/ReactPagination";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

const ComplaintTypesMasterdata = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [companyData, setCompanyData] = useState([]);
  const [complaint, setComplaint] = useState(false);
  const [complaintsType, setComplaintsType] = useState([]);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchTypesComplaintData = async () => {
    const res = await getAdminAllTypesComplaint(search, pageSize, pageNo);
    if (res.status) {
      setComplaintsType(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setComplaintsType([]);
      setPageDetail({});
    }
  };

  const fetchMyCompaniesData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.energy_company_id,
          label: itm.name,
        };
      });
      setCompanyData(rData);
    } else {
      setCompanyData([]);
    }
  };

  const handleEdit = async (complaint) => {
    setEdit(complaint);
    setComplaint(true);
  };

  useEffect(() => {
    fetchMyCompaniesData();
    fetchTypesComplaintData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      complaint_type_name: values.complaint_type_name,
      energy_company_id: values.energy_company_id.value,
    };

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    if (edit?.id) {
      sData["id"] = edit?.id;
    }
    // console.log('sData', sData)
    const res = edit?.id
      ? await getAdminUpdateTypesComplaint(sData, params)
      : await getAdminCreateTypesComplaint(sData, params);
    if (res.status) {
      fetchTypesComplaintData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setComplaint(false);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Complaint Types · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Complaint Types"}
          icon={<BsPlus />}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          onclick={() => {
            setEdit({});
            setComplaint(true);
          }}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Complaint Type",
                    "Company Name",
                    "Date",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaintsType.length > 0 ? null : (
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
                {complaintsType.map((complaint, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{complaint.complaint_type_name}</td>
                    <td>{complaint.energy_company_name}</td>
                    <td>
                      {moment(complaint.created_at).format(
                        "DD/MM/YYYY | h:mm:ss a"
                      )}
                    </td>
                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        editOnclick={() => handleEdit(complaint)}
                        hideEye={"d-none"}
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
                  ? complaintsType.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : complaintsType.length < pageSize
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

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit?.id || "",
          complaint_type_name: edit?.complaint_type_name || "",
          energy_company_id: edit?.energy_company_id
            ? {
                label: edit?.energy_company_name,
                value: edit?.energy_company_id,
              }
            : "",
        }}
        validationSchema={addTypesComplaintSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={complaint}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit?.id ? "Update" : "Save"}
            close={() => setComplaint(false)}
            title={
              edit?.id ? "Update Complaint Types" : "Create Complaint Types"
            }
          >
            <Form.Group className="mb-2" as={Col} md={12}>
              <Form.Label>
                Energy Company Name <span className="text-danger">*</span>
              </Form.Label>
              <Select
                menuPosition="fixed"
                className="text-primary"
                name="energy_company_id"
                value={props.values.energy_company_id}
                onChange={(val) =>
                  props.setFieldValue("energy_company_id", val)
                }
                options={companyData}
              />
              <ErrorMessage
                name="energy_company_id"
                component="small"
                className="text-danger"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Complaint Type Name <span className="text-danger">*</span>
              </Form.Label>
              <TextareaAutosize
                onChange={props.handleChange}
                value={props.values.complaint_type_name}
                name="complaint_type_name"
                className="edit-textarea"
              />
              <ErrorMessage
                name="complaint_type_name"
                component="small"
                className="text-danger"
              />
            </Form.Group>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default ComplaintTypesMasterdata;
