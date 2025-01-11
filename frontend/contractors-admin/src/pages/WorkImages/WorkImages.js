import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import {
  deleteWorkImagesById,
  getAllWorkImages,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WorkImages = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allWorkImages, setAllWorkImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchWorkImagesData = async () => {
    const res = await getAllWorkImages({ search, pageSize, pageNo });
    if (res.status) {
      setAllWorkImages(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllWorkImages([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteWorkImagesById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllWorkImages((prev) => prev.filter((dlt) => dlt.id !== idToDelete));
      fetchWorkImagesData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchWorkImagesData();
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
        <title>Work Images · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"All - Work Images"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Complaint id")}</th>
                  <th>{t("Complaint Name")}</th>
                  <th>{t("Image Upload By")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      width="320"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : allWorkImages.length > 0 ? (
                  <>
                    {allWorkImages?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{serialNumber[idx]}</td>
                        <td>{itm?.complaint_unique_id}</td>
                        <td>{itm?.complaint_type_name}</td>
                        <td>{itm?.image_upload_by_name}</td>
                        <td
                          className={`${
                            itm.status == "1"
                              ? "text-orange"
                              : itm.status == "2"
                              ? "text-green"
                              : itm.status == "3"
                              ? "text-danger"
                              : "text-black"
                          }`}
                        >
                          {itm.status == "1"
                            ? "requested"
                            : itm.status == "2"
                            ? "approved"
                            : itm.status == "3"
                            ? "rejected"
                            : ""}
                        </td>
                        <td>
                          <ActionButton
                            deleteOnclick={() => {
                              setIdToDelete(itm.id);
                              setShowAlert(true);
                            }}
                            eyeOnclick={() =>
                              navigate(`/WorkImages/view`, {
                                state: {
                                  id: itm?.id,
                                },
                              })
                            }
                            editlink={`/WorkImages/create/${itm?.id}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={8}>
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
                <tr>
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
                          ? allWorkImages.length - 1 < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                          : allWorkImages.length < pageSize
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
                </tr>
              </tfoot>
            </Table>
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

export default WorkImages;
