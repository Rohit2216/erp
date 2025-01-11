import React, { useState, useEffect } from "react";
import { Col, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import {
  deleteSuppliersById,
  getAllSuppliers,
} from "../../services/contractorApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AllSuppliersOverview = () => {
  const [suppliersData, setSuppliersData] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchSuppliersData = async () => {
    const isDropdown = "false";
    const res = await getAllSuppliers({ search, pageSize, pageNo, isDropdown });
    if (res.status) {
      setSuppliersData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSuppliersData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteSuppliersById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setSuppliersData((prev) => prev.filter((itm) => itm.id !== idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchSuppliersData();
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
        <title>Suppliers · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"All Suppliers Overview"}
        >
          <div className="table-scroll mb-3">
            <Table className=" Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Supplier Name")}</th>
                  <th>{t("Owner Name")}</th>
                  <th>{t("Cashier Name")}</th>
                  <th>{t("Supplier Code")}</th>
                  <th>{t("Bank Name")}</th>
                  <th>{t("Account Number")}</th>
                  <th>{t("status")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8}>
                      <img
                        className="p-3"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                        alt="Loading"
                      />
                    </td>
                  </tr>
                ) : suppliersData?.length > 0 ? (
                  <>
                    {suppliersData?.map((itm, id1) => (
                      <tr key={id1}>
                        <td>{serialNumber[id1]}</td>
                        <td>
                          <Link
                            className="text-secondary text-none"
                            to={`/Suppliers/create-supplier/${itm.id}?type=view`}
                          >
                            {itm.supplier_name}
                          </Link>
                        </td>
                        <td>{itm.owner_name}</td>
                        <td>{itm.cashier_name}</td>
                        <td>{itm.supplier_code}</td>
                        <td>{itm.bank_name}</td>
                        <td>{itm.account_number}</td>
                        <td
                          className={`${
                            itm.status == "request"
                              ? "text-orange"
                              : itm.status == "approved"
                              ? "text-green"
                              : itm.status == "rejected"
                              ? "text-danger"
                              : "text-black"
                          }`}
                        >
                          {itm.status}
                        </td>

                        <td>
                          <ActionButton
                            eyelink={`/Suppliers/create-supplier/${itm.id}?type=view`}
                            hideEdit={"d-none"}
                            hideDelete={"d-none"}

                            // editlink={`/Suppliers/create-supplier/${itm.id}`}
                            // deleteOnclick={() => {
                            //   setIdToDelete(itm.id);
                            //   setShowDelete(true);
                            // }}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={8}>
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
              <ConfirmAlert
                size={"sm"}
                deleteFunction={handleDelete}
                hide={setShowDelete}
                show={showDelete}
                title={"Confirm Delete"}
                description={"Are you sure you want to delete this!!"}
              />
            </Table>
          </div>

          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? suppliersData.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : suppliersData.length < pageSize
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
        </CardComponent>
      </Col>
    </>
  );
};

export default AllSuppliersOverview;
