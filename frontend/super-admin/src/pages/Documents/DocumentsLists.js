import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import {
  SearchAllDocumentList,
  getAdminAllDocumentList,
  getAdminDeleteDocumentList,
} from "../../services/authapi";
import moment from "moment";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import ImageViewer from "../../components/ImageViewer";

const DocumentCategory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchDocumentData = async () => {
    const res = await getAdminAllDocumentList(search, pageSize, pageNo);
    if (res.status) {
      setDocument(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setDocument([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const searchDocumentData = async () => {
    try {
      const response = await SearchAllDocumentList();
      if (response.status) {
        setSearchData(response.data);
      } else {
        setSearchData([]);
      }
    } catch (error) {
      setSearchData([]);
    }
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteDocumentList(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setDocument((prev) =>
        prev.filter((itm) => itm.document_id !== idToDelete)
      );
      fetchDocumentData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchDocumentData();
    searchDocumentData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleSearchChange = (selectedOption) => {
    if (selectedOption) {
      setSearch(selectedOption.label);
    } else {
      setSearch(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Documents Lists · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Documents Lists"}
          // search={true}
          // searchOnChange={(e) => { setSearch(e.target.value) }}
          custom2={
            <Select
              isClearable
              className="text-primary"
              placeholder="--Select Category--"
              menuPortalTarget={document.body}
              value={searchData.find((types) => types.label === search)}
              name={"category_type"}
              options={searchData?.map((types) => ({
                label: types.title,
                value: types.id,
              }))}
              onChange={handleSearchChange}
            />
          }
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Title",
                    "Document Date",
                    <>User's Name</>,
                    "Attachment",
                    "Remark",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={7}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : document.length > 0 ? (
                  <>
                    {document?.map((docs, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{docs.title}</td>
                        <td>
                          {moment(docs.created_at).format(
                            "DD/MM/YYYY | h:mm:ss a"
                          )}
                        </td>
                        <td className="d-grid gap-2">
                          {docs?.users?.map((itm) => (
                            <div className="shadow px-1">{itm.user_name}</div>
                          ))}
                        </td>
                        <td>
                          {JSON.parse(docs?.image)?.map((img, idx) => {
                            return docs?.fileExtension === "pdf" ||
                              docs?.fileExtension === "docx" ? (
                              <a
                                key={idx}
                                download
                                target="_blank"
                                className="small text-decoration-none d-block text-secondary"
                                href={
                                  process.env.REACT_APP_API_URL + img?.storePath
                                }
                              >
                                {idx + 1}. Attachment
                              </a>
                            ) : (
                              <ImageViewer
                                downloadIcon
                                href={
                                  process.env.REACT_APP_API_URL + img?.storePath
                                }
                                src={
                                  img?.storePath
                                    ? `${process.env.REACT_APP_API_URL}${img?.storePath}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  className="shadow p-1 m-1"
                                  width={35}
                                  height={35}
                                  src={
                                    img?.storePath
                                      ? `${process.env.REACT_APP_API_URL}${img?.storePath}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                />
                              </ImageViewer>
                            );
                          })}
                        </td>
                        <td>{docs.remark}</td>
                        <td>
                          <ActionButton
                            deleteOnclick={() => {
                              setIdToDelete(docs.document_id);
                              setShowAlert(true);
                            }}
                            hideEye={"d-none"}
                            editlink={`/AddDocument/${docs.document_id}`}
                          />
                        </td>
                        {/* // return <img src={`${process.env.REACT_APP_API_URL}/assets/images/image.png`} />  */}
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
            </Table>
            <ReactPagination
              pageSize={pageSize}
              prevClassName={
                pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
              }
              nextClassName={
                document.length < pageSize
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

export default DocumentCategory;
