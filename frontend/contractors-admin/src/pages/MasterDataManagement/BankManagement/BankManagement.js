import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { BsDownload, BsPlus, BsUpload } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import { Helmet } from "react-helmet";
import ReactDropzone from "../../../components/ReactDropzone";
import ActionButton from "../../../components/ActionButton";
import { toast } from "react-toastify";
import ReactPagination from "../../../components/ReactPagination";
import { Formik } from "formik";
import TooltipComponent from "../../../components/TooltipComponent";
import {
  getAllBankList,
  postImportBankList,
} from "../../../services/contractorApi";
import Modaljs from "../../../components/Modal";
import ImageViewer from "../../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const BankManagement = () => {
  const [allBank, setAllBank] = useState([]);
  const [showImports, setShowImports] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchAllBankData = async () => {
    const res = await getAllBankList(search, pageSize, pageNo);
    if (res.status) {
      setAllBank(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllBank([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("data", e.target.files[0]);
    }
  };

  const handleUploadEmployees = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    const formData = new FormData();
    formData.append("data", values.data);
    const res = await postImportBankList(formData);
    if (res.status) {
      toast.success(res.message);
      fetchAllBankData();
    } else {
      toast.error(res.message);
    }
    setShowImports(false);
    resetForm();
    setSubmitting(false);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    element.href = `/assets/images/sample-bank-import.csv`;
    element.download = "sample-bank-import.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    fetchAllBankData();
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
      <Col md={12} data-aos={"fade-up"}>
        <Helmet>
          <title>All Bank Data · CMS Electricals</title>
        </Helmet>
        <CardComponent
          title={"All Bank Data"}
          icon={<BsPlus />}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          custom={
            <TooltipComponent align={"left"} title={"Import Bank Data"}>
              <span
                onClick={() => setShowImports(true)}
                className="social-btn-re d-align gap-2 px-3 w-auto danger-combo"
              >
                <BsUpload />
              </span>
            </TooltipComponent>
          }
          link={"/bank-management/create-bank-management/new"}
          tag={"Create"}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr className="text-center">
                  <th>{t("Sr No.")}</th>
                  <th>{t("Bank Name")}</th>
                  <th>{t("Website")}</th>
                  <th>{t("Logo")}</th>
                  <th>{t("Created At")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={7}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt={t("Loading")}
                    />
                  </td>
                ) : allBank.length > 0 ? (
                  <>
                    {allBank?.map((e, idx) => (
                      <tr>
                        <td>{serialNumber[idx]}</td>
                        <td>{e.bank_name}</td>
                        <td>
                          <a
                            target="_blank"
                            className="text-secondary text-none"
                            href={e.website}
                          >
                            {e.website}
                          </a>
                        </td>
                        <td>
                          <ImageViewer
                            src={
                              e?.logo
                                ? `${process.env.REACT_APP_API_URL}/${e?.logo}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              className="avatar me-2"
                              src={
                                e?.logo
                                  ? `${process.env.REACT_APP_API_URL}/${e?.logo}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />
                          </ImageViewer>
                        </td>
                        <td>{e.created_at}</td>
                        <td>
                          <ActionButton
                            editlink={`/bank-management/create-bank-management/${e.id}`}
                            hideDelete={"d-none"}
                            hideEye={"d-none"}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={7}>
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
                        ? allBank.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : allBank.length < pageSize
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
          data: "",
        }}
        onSubmit={handleUploadEmployees}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showImports}
            newButtonType={"button"}
            newButtonOnclick={handleDownload}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setShowImports(false)}
            newButtonClass={"success-combo"}
            newButtonTitle={<BsDownload />}
            title={"Import Employees"}
          >
            <Form.Group>
              <ReactDropzone
                name="data"
                value={props.values.data}
                onChange={(e) => handleFileChange(e, props.setFieldValue)}
                title={`Upload Employees`}
              />
            </Form.Group>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default BankManagement;
