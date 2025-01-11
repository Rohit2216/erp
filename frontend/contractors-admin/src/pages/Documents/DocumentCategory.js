import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import ActionButton from "../../components/ActionButton";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { addDocumentSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  getAdminAllDocument,
  getAdminCreateDocument,
  getAdminDeleteDocument,
  getAdminUpdateDocument,
} from "../../services/authapi";
import ReactPagination from "../../components/ReactPagination";
import { useTranslation } from "react-i18next";

const DocumentCategory = () => {
  const [documents, setDocuments] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();

  const fetchDocumentData = async () => {
    const res = await getAdminAllDocument(search, pageSize, pageNo);
    if (res.status) {
      setDocumentData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setDocumentData([]);
      setPageDetail({});
    }
  };

  const handleEdit = async (document) => {
    setEdit(document);
    setDocuments(true);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteDocument(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setDocumentData((prev) => prev.filter((itm) => itm.id !== idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    fetchDocumentData();
    setShowAlert(false);
  };

  useEffect(() => {
    fetchDocumentData();
  }, [search, pageSize, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const sData = {
      title: values.title,
      description: values.description,
      category: values.category,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // console.log('sData', sData)
    const res = edit.id
      ? await getAdminUpdateDocument(sData)
      : await getAdminCreateDocument(sData);
    if (res.status) {
      fetchDocumentData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setDocuments(false);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Document Category · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Document Category"}
          icon={<BsPlus />}
          link={`/DocumentCategory/CreateDocumentCategory/new`}
          tag={"Create"}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Document Category")}</th>
                  <th>{t("Document Title")}</th>
                  <th>{t("Document Description")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {documentData.length > 0 ? null : (
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
                {documentData.map((document, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{document.category}</td>
                    <td>{document.title}</td>
                    <td>{document.description}</td>
                    <td>
                      <ActionButton
                        hideEye={"d-none"}
                        eyelink={`/DocumentCategory/DocumentCategoryView/${document.id}`}
                        deleteOnclick={() => {
                          setIdToDelete(document.id);
                          setShowAlert(true);
                        }}
                        editlink={`/DocumentCategory/CreateDocumentCategory/${document.id}`}
                      />
                    </td>
                  </tr>
                ))}
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
                        ? documentData.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : documentData.length < pageSize
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
          id: edit?.id || "",
          title: edit?.title || "",
          category: edit?.category || "",
          description: edit?.description || "",
        }}
        validationSchema={addDocumentSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={documents}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "CREATE"}
            close={() => setDocuments(false)}
            title={
              edit.id ? "Update Document Category" : "Create Document Category"
            }
          >
            <Row className="g-2">
              <Form.Group as={Col} md={6}>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name={"title"}
                  value={props.values.title}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.title && props.errors.title)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Category")}</Form.Label>
                <Form.Control
                  type="text"
                  name={"category"}
                  value={props.values.category}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.category && props.errors.category
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Label>{t("Description")}</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  onChange={props.handleChange}
                  value={props.values.description}
                  name="description"
                  className="edit-textarea"
                />
              </Form.Group>
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

export default DocumentCategory;
