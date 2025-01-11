import React from "react";
import { Card, Col, Form, Image, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import "simplebar-react/dist/simplebar.min.css";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getSingleSalesOrderById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import {
  BsChevronDown,
  BsChevronUp,
  BsDownload,
  BsSearch,
  BsThreeDotsVertical,
} from "react-icons/bs";
import ReactPagination from "../../components/ReactPagination";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const ViewSalesOrder = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [ViewDetails, setViewDetails] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const { t } = useTranslation();

  const [collapsedRows, setCollapsedRows] = useState("");

  const toggleRow = (index) => {
    if (collapsedRows === index) setCollapsedRows("");
    else setCollapsedRows(index);
  };

  const fetchSingleDetailsData = async () => {
    const res =
      type === "sales-order"
        ? await getSingleSalesOrderById(id, pageSize, pageNo, search)
        : await getSingleSalesOrderById(id, pageSize, pageNo, search);
    if (res.status) {
      setViewDetails(res.data);
      setPageDetail(res.data.sales_order_item.pageDetails);
    } else {
      setViewDetails({});
      setPageDetail({});
    }
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const documentLink = (file) => {
    const type = file?.name ? "new" : "edit";
    if (type == "new") {
      const url = URL.createObjectURL(file);
      if (
        file?.name.split(".")?.[1] == "png" ||
        file?.name.split(".")?.[1] == "jpeg" ||
        file?.name.split(".")?.[1] == "jpg" ||
        file?.name.split(".")?.[1] == "jfif"
      )
        return { url, type: "image" };
      else if (file?.name.split(".")?.[1] == "pdf") return { url, type: "pdf" };
      else if (
        file?.name.split(".")?.[1] == "doc" ||
        file?.name.split(".")?.[1] == "docx"
      )
        return { url, type: "document" };
    } else {
      const url = `${process.env.REACT_APP_API_URL}${file}`;
      if (
        file?.split(".")?.[1] == "png" ||
        file?.split(".")?.[1] == "jpeg" ||
        file?.split(".")?.[1] == "jpg" ||
        file?.split(".")?.[1] == "jfif"
      )
        return { url, type: "image" };
      else if (file?.split(".")?.[1] == "pdf") return { url, type: "pdf" };
      else if (
        file?.split(".")?.[1] == "doc" ||
        file?.split(".")?.[1] == "docx"
      )
        return { url, type: "document" };
    }
  };

  useEffect(() => {
    fetchSingleDetailsData();
  }, [pageSize, pageNo, search]);
  return (
    <>
      <Helmet>
        <title>View Details - · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={"shadow after-bg-light"}
          title={"view sales order details"}
        >
          {type === "sales-order" ? (
            <Row className="g-3 py-1">
              <Col md={6}>
                <div className="p-20 shadow rounded h-100">
                  <strong className="text-secondary">{t("SO Details")}</strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        <tr>
                          <th>{t("so date")} :</th>
                          <td>{ViewDetails?.so_date}</td>
                        </tr>
                        <tr>
                          <th>{t("So regional office")} :</th>
                          <td>{ViewDetails?.regional_office_name}</td>
                        </tr>
                        <tr>
                          <th>{t("state")} :</th>
                          <td>{ViewDetails?.state_name}</td>
                        </tr>
                        <tr>
                          <th>{t("so number")} :</th>
                          <td>{ViewDetails?.so_number}</td>
                        </tr>

                        <tr>
                          <th> {t("so limit")} :</th>
                          <td>₹ {ViewDetails?.limit}</td>
                        </tr>
                        <tr>
                          <th>{t("remaining amount")} :</th>
                          <td className="text-green">
                            ₹ {+ViewDetails?.remaining_so_amount}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("security deposit date")} :</th>
                          <td>{ViewDetails?.security_deposit_date}</td>
                        </tr>

                        <tr>
                          <th>{t("overall gst type")} :</th>
                          <td>{ViewDetails?.gst_title}</td>
                        </tr>

                        <tr>
                          <th>{t("overall gst type")} :</th>
                          <td>{ViewDetails?.gst_percent}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-20 shadow rounded h-100">
                  <strong className="text-secondary">{t("Details")}</strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        <tr>
                          <th>{t("tender date")} :</th>
                          <td>{ViewDetails?.tender_date}</td>
                        </tr>
                        <tr>
                          <th>{t("tender number")} :</th>
                          <td>{ViewDetails?.tender_number}</td>
                        </tr>
                        <tr>
                          <th>{t("bank Name")} :</th>
                          <td>{ViewDetails?.bank_name}</td>
                        </tr>
                        <tr>
                          <th>{t("dd bg number")} :</th>
                          <td>{ViewDetails?.dd_bg_number}</td>
                        </tr>
                        <tr>
                          <th>{t("security deposit amount")} :</th>
                          <td>₹ {ViewDetails?.security_deposit_amount}</td>
                        </tr>
                        <tr>
                          <th>{t("cr date")} :</th>
                          <td>{ViewDetails?.cr_date}</td>
                        </tr>
                        <tr>
                          <th>{t("cr number")} :</th>
                          <td>{ViewDetails?.cr_number}</td>
                        </tr>
                        <tr>
                          <th>{t("cr code")} :</th>
                          <td>{ViewDetails?.cr_code}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
              {ViewDetails?.sales_order_item?.data.length > 0 && (
                <Col md={12}>
                  <div className="p-20 mb-5 shadow rounded h-100">
                    <strong className="text-secondary">{t("Items")}</strong>
                    <span className="d-align mt-1 mb-4 me-3 justify-content-end gap-2">
                      <span className="position-relative">
                        <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                        <Form.Control
                          type="text"
                          placeholder={t("Search")}
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                          className="me-2"
                          aria-label="Search"
                        />
                      </span>
                    </span>
                    <div className="mt-2">
                      <Table className="table-sm table Roles">
                        <thead>
                          <tr>
                            <th>{t("Order Line Number")}</th>
                            <th>{t("Name")}</th>
                            <th>{t("Hsn Code")}</th>
                            <th>{t("Unit")}</th>
                            <th>{t("Gst Title")}</th>
                            <th>{t("Gst %")}</th>
                            <th>{t("Rate")}</th>
                            <th>{t("Quantity")}</th>
                            <th>{t("Amount")}</th>
                            <th>
                              <BsThreeDotsVertical />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ViewDetails.sales_order_item.data.map(
                            (item, index) => (
                              <>
                                <tr key={index}>
                                  <td>{item.OrderLineNumber}</td>
                                  <td>{item?.Name}</td>
                                  <td>{item?.HsnCode}</td>
                                  <td>{item.Unit}</td>

                                  {item.change_gst_type == "1" ? (
                                    <>
                                      <td>{item?.gst_type}</td>
                                      <td>{item?.gst_percent}</td>
                                    </>
                                  ) : (
                                    <>
                                      <td></td>
                                      <td></td>
                                    </>
                                  )}
                                  <td>₹ {item?.Rate}</td>

                                  <td>{item?.Qty}</td>
                                  <td>₹ {item?.Amount}</td>
                                  <td>
                                    <span
                                      className={`mx-2 cursor-pointer  text-${
                                        collapsedRows === index
                                          ? "danger"
                                          : "green"
                                      }`}
                                      onClick={() => toggleRow(index)}
                                    >
                                      {collapsedRows === index ? (
                                        <BsChevronUp fontSize="15px" />
                                      ) : (
                                        <BsChevronDown fontSize="15px" />
                                      )}
                                    </span>
                                  </td>
                                </tr>
                                {collapsedRows === index && (
                                  <tr>
                                    <td className="fw-bold">
                                      {" "}
                                      {t("Item description")}
                                    </td>
                                    <td>{item.description || "---"}</td>
                                  </tr>
                                )}
                              </>
                            )
                          )}
                        </tbody>
                      </Table>

                      <ReactPagination
                        className="my-3"
                        pageSize={pageSize}
                        prevClassName={
                          pageNo === 1
                            ? "danger-combo-disable pe-none"
                            : "red-combo"
                        }
                        nextClassName={
                          pageSize == pageDetail?.total
                            ? ViewDetails.sales_order_item.data.length - 1 <
                              pageSize
                              ? "danger-combo-disable pe-none"
                              : "success-combo"
                            : ViewDetails.sales_order_item.data.length <
                              pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                        }
                        title={`Showing ${
                          pageDetail?.pageStartResult || 0
                        } to ${pageDetail?.pageEndResult || 0} of ${
                          pageDetail?.total || 0
                        }`}
                        handlePageSizeChange={handlePageSizeChange}
                        prevonClick={() => setPageNo(pageNo - 1)}
                        nextonClick={() => setPageNo(pageNo + 1)}
                      />
                    </div>
                  </div>
                </Col>
              )}
              <Col md={12}>
                <div className="p-20 shadow rounded">
                  <strong className="text-secondary">
                    {t("External Field")}
                  </strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        <tr>
                          <th>{t("created at")} :</th>
                          <td>{ViewDetails?.created_at}</td>
                        </tr>
                        <tr>
                          <th>{t("created by")} :</th>
                          <td>{ViewDetails?.created_by}</td>
                        </tr>
                        <tr>
                          <th>{t("cr copy")} :</th>
                          <td>
                            {documentLink(ViewDetails?.cr_copy) ? (
                              <Form.Group as={Col} md={4}>
                                <div className=" position-relative d-flex">
                                  {documentLink(ViewDetails?.cr_copy)?.type ==
                                    "image" && (
                                    <ImageViewer
                                      src={
                                        documentLink(ViewDetails?.cr_copy).url
                                      }
                                    >
                                      <Image
                                        style={{
                                          height: "120px",
                                          width: "100%",
                                          maxWidth: "100%",
                                        }}
                                        className="object-fit mt-1"
                                        src={
                                          documentLink(ViewDetails?.cr_copy).url
                                        }
                                      />
                                    </ImageViewer>
                                  )}

                                  {documentLink(ViewDetails?.cr_copy)?.type ==
                                    "pdf" && (
                                    <a
                                      href={
                                        documentLink(ViewDetails?.cr_copy).url
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Card.Img
                                        width={200}
                                        height={100}
                                        className="object-fit"
                                        src={`/assets/images/pdf.jpg`}
                                      />
                                    </a>
                                  )}

                                  {documentLink(ViewDetails?.cr_copy)?.type ==
                                    "document" && (
                                    <a
                                      href={
                                        documentLink(ViewDetails?.cr_copy).url
                                      }
                                      download={true}
                                    >
                                      <Card.Img
                                        width={200}
                                        height={130}
                                        className="object-fit"
                                        src={`/assets/images/docs.png`}
                                      />
                                    </a>
                                  )}
                                </div>
                              </Form.Group>
                            ) : (
                              <Form.Group as={Col} md={6}></Form.Group>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("sd letter")} :</th>
                          <td>
                            {documentLink(ViewDetails?.sd_letter) ? (
                              <Form.Group as={Col} md={4}>
                                <div className=" position-relative d-flex">
                                  {documentLink(ViewDetails?.sd_letter)?.type ==
                                    "image" && (
                                    <ImageViewer
                                      src={
                                        documentLink(ViewDetails?.sd_letter).url
                                      }
                                    >
                                      <Image
                                        style={{
                                          height: "120px",
                                          width: "100%",
                                          maxWidth: "100%",
                                        }}
                                        className="object-fit mt-1"
                                        src={
                                          documentLink(ViewDetails?.sd_letter)
                                            .url
                                        }
                                      />
                                    </ImageViewer>
                                  )}

                                  {documentLink(ViewDetails?.sd_letter)?.type ==
                                    "pdf" && (
                                    <a
                                      href={
                                        documentLink(ViewDetails?.sd_letter).url
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Card.Img
                                        width={200}
                                        height={100}
                                        className="object-fit"
                                        src={`/assets/images/pdf.jpg`}
                                      />
                                    </a>
                                  )}

                                  {documentLink(ViewDetails?.sd_letter)?.type ==
                                    "document" && (
                                    <a
                                      href={
                                        documentLink(ViewDetails?.sd_letter).url
                                      }
                                      download={true}
                                    >
                                      <Card.Img
                                        width={200}
                                        height={130}
                                        className="object-fit"
                                        src={`/assets/images/docs.png`}
                                      />
                                    </a>
                                  )}
                                </div>
                              </Form.Group>
                            ) : (
                              <Form.Group as={Col} md={6}></Form.Group>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("work")} :</th>
                          <td>{ViewDetails?.work}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="g-3 py-1">
              <Col md={12}>
                <div className="p-20 shadow rounded h-100">
                  <strong className="text-secondary">{t("Details")}</strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        {ViewDetails?.regional_office_name && (
                          <tr>
                            <th>{t("regional office name")} :</th>
                            <td>{ViewDetails?.regional_office_name}</td>
                          </tr>
                        )}
                        {ViewDetails?.po_number && (
                          <tr>
                            <th>{t("po Number")} :</th>
                            <td>{ViewDetails?.po_number}</td>
                          </tr>
                        )}
                        {ViewDetails?.tender_date && (
                          <tr>
                            <th>{t("Tender Date")} :</th>
                            <td>{ViewDetails?.tender_date}</td>
                          </tr>
                        )}
                        {ViewDetails?.tender_number && (
                          <tr>
                            <th>{t("Tender Number")} :</th>
                            <td>{ViewDetails?.tender_number}</td>
                          </tr>
                        )}
                        {ViewDetails?.security_deposit_date && (
                          <tr>
                            <th>{t("security deposit date")} :</th>
                            <td>{ViewDetails?.security_deposit_date}</td>
                          </tr>
                        )}
                        {ViewDetails?.security_deposit_amount && (
                          <tr>
                            <th>{t("security deposit amount")} :</th>
                            <td>{ViewDetails?.security_deposit_amount}</td>
                          </tr>
                        )}
                        {ViewDetails?.bank_name && (
                          <tr>
                            <th>{t("bank name")} :</th>
                            <td>{ViewDetails?.bank_name}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </CardComponent>
      </Col>
    </>
  );
};

export default ViewSalesOrder;
