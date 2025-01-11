import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Table, Row } from "react-bootstrap";
import { BsArrowLeftRight, BsCalendarEvent, BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import Modaljs from "../../components/Modal";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteFinancialYearsById,
  getAllFinancialYears,
  postFinancialYears,
  updateFinancialYears,
} from "../../services/contractorApi";
import { addFinancialYearSchema } from "../../utils/formSchema";
import { useTranslation } from "react-i18next";

const FinancialYear = () => {
  const [financialYearShow, setFinancialYearShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();

  const fetchFinancialYearData = async () => {
    const res = await getAllFinancialYears(search, pageSize, pageNo);
    if (res.status) {
      setAllFinancialYear(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllFinancialYear([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleEdit = (itm) => {
    setEdit(itm);
    setFinancialYearShow(true);
  };

  const handleDelete = async () => {
    const res = await deleteFinancialYearsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllFinancialYear((prev) =>
        prev.filter((dlt) => dlt.id !== idToDelete)
      );
      fetchFinancialYearData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      start_date: values.start_date,
      end_date: values.end_date,
    };

    const res = edit.id
      ? await updateFinancialYears(edit?.id, sData)
      : await postFinancialYears(sData);
    if (res.status) {
      fetchFinancialYearData();
      toast.success(res.message);
    } else {
      if (res.message.includes("Financial Year already exists")) {
        toast.warn(res.message);
      } else {
        toast.error(res.message);
      }
    }
    resetForm();
    setSubmitting(false);
    setFinancialYearShow(false);
  };

  useEffect(() => {
    fetchFinancialYearData();
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
        <title>Financial Year · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"All - Financial Year"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          link={`/financial-year/create-financial-year/new`}
          tag={"Create"}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Start Date")}</th>
                  <th>{t("Financial Year")}</th>
                  <th>{t("End Date")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={5}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt={t("Loading")}
                    />
                  </td>
                ) : allFinancialYear.length > 0 ? (
                  <>
                    {allFinancialYear?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{serialNumber[idx]}</td>
                        <td>{itm?.start_date}</td>
                        <td>{itm?.year_name}</td>
                        <td>{itm?.end_date}</td>
                        <td>
                          <ActionButton
                            hideEye={"d-none"}
                            deleteOnclick={() => {
                              setIdToDelete(itm.id);
                              setShowAlert(true);
                            }}
                            editlink={`/financial-year/create-financial-year/${itm?.id}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={5}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                )}
              </tbody>
              <tfoot>
                <td colSpan={10}>
                  <ReactPagination
                    pageSize={pageSize}
                    prevClassName={
                      pageNo === 1
                        ? "danger-combo-disable pe-none"
                        : "red-combo"
                    }
                    nextClassName={
                      pageSize == pageDetail?.total
                        ? allFinancialYear.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : allFinancialYear.length < pageSize
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
                </td>
              </tfoot>
            </Table>
          </div>
        </CardComponent>
      </Col>
      <Formik
        enableReinitialize={true}
        initialValues={{
          start_date: edit.start_date || "",
          end_date: edit.end_date || "",
        }}
        validationSchema={addFinancialYearSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={financialYearShow}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "ADD"}
            close={() => setFinancialYearShow(false)}
            title={"Financial Year"}
            formikProps={props}
          >
            <Row className="g-3 py-2 align-items-center">
              <Form.Group as={Col} md="5">
                <Form.Label>{t("Start Date")}</Form.Label>
                <Form.Control
                  type="date"
                  name={"start_date"}
                  value={props.values.start_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.start_date && props.errors.start_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.start_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="2" className="text-center">
                <BsArrowLeftRight />
              </Form.Group>
              <Form.Group as={Col} md="5">
                <Form.Label>{t("End Date")}</Form.Label>
                <Form.Control
                  type="date"
                  name={"end_date"}
                  value={props.values.end_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.end_date && props.errors.end_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.end_date}
                </Form.Control.Feedback>
              </Form.Group>
              {edit?.id && (
                <Form.Group as={Col} md="12">
                  <div className="float-end purple-combo p-1 px-2 rounded">
                    <BsCalendarEvent /> {t("Financial Year")} -{" "}
                    {edit?.year_name}
                  </div>
                </Form.Group>
              )}
            </Row>
          </Modaljs>
        )}
      </Formik>
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

export default FinancialYear;
