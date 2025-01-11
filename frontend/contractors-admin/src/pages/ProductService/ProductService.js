import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import Switch from "../../components/Switch";
import ReactPagination from "../../components/ReactPagination";
import {
  deleteProductDetailsById,
  getAllProductDetails,
  postPublishStatusUpdate,
} from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const ProductService = () => {
  const [allHrEmployees, setAllHrEmployees] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchAllHrEmployeesData = async () => {
    const res = await getAllProductDetails(search, pageSize, pageNo);
    if (res.status) {
      setAllHrEmployees(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllHrEmployees([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handlePublish = async (e, event) => {
    const sData = {
      product_id: e.id,
      value: event.target.checked === true ? "1" : "0",
    };
    // return console.log("changeStatus", sData);
    const res = await postPublishStatusUpdate(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async () => {
    const res = await deleteProductDetailsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllHrEmployees((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllHrEmployeesData();
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
          <title>Product Service · CMS Electricals</title>
        </Helmet>
        <CardComponent
          title={t("Product Service")}
          icon={<BsPlus />}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          link={"/ProductService/AddProducts/new"}
          tag={"Create"}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr className="text-center">
                  <th>{t("Sr No.")}</th>
                  <th>{t("Product Name")}</th>
                  <th>{t("Category")}</th>
                  <th>{t("Category Name")}</th>
                  <th>{t("Price")}</th>
                  <th>{t("Supplier Name")}</th>
                  <th>{t("availability status")}</th>
                  <th>{t("Quantity")}</th>
                  <th>{t("Published")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={10}>
                      <img
                        className="p-3"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                        alt="Loading"
                      />
                    </td>
                  </tr>
                ) : allHrEmployees.length > 0 ? (
                  <>
                    {allHrEmployees?.map((e, idx) => (
                      <tr>
                        <td>{serialNumber[idx]}</td>
                        <td>{e.product_name}</td>
                        <td>
                          <ImageViewer
                            src={
                              e.image_url
                                ? `${process.env.REACT_APP_API_URL}${e.image_url}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              width={50}
                              height={50}
                              className="my-bg object-fit p-1 rounded"
                              src={
                                e.image_url
                                  ? `${process.env.REACT_APP_API_URL}${e.image_url}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                              alt={e.product_name}
                            />
                          </ImageViewer>
                        </td>
                        <td>{e.category_name}</td>
                        <td>{e.price}</td>
                        <td>{e.supplier_name}</td>
                        <td
                          className={`text-${
                            e.availability_status === "1" ? "green" : "orange"
                          }`}
                        >
                          {e.availability_status === "1"
                            ? "In Stock"
                            : "Out Stock"}
                        </td>
                        <td>{e.quantity}</td>
                        <td className="text-green text-center">
                          <Switch
                            checked={e.is_published === "1" ? true : false}
                            onChange={(event) => handlePublish(e, event)}
                          />
                        </td>
                        <td>
                          <ActionButton
                            eyelink={`/ProductService/AddProducts/${e.id}?type=view`}
                            editlink={`/ProductService/AddProducts/${e.id}`}
                            deleteOnclick={() => {
                              setIdToDelete(e.id);
                              setShowAlert(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={10}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
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
                          ? allHrEmployees.length - 1 < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                          : allHrEmployees.length < pageSize
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

export default ProductService;
