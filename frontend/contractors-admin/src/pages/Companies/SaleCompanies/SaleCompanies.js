import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../../components/ActionButton";
import CardComponent from "../../../components/CardComponent";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  deleteAdminCompanies,
  getAdminSaleCompanies,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactPagination from "../../../components/ReactPagination";
import { useTranslation } from "react-i18next";

const SaleCompanies = () => {
  const [companyData, setCompanyData] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();
  const fetchSaleCompaniesData = async () => {
    const res = await getAdminSaleCompanies(search, pageSize, pageNo);
    if (res.status) {
      setCompanyData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setCompanyData([]);
      setPageDetail({});
    }
  };

  const handleDelete = async () => {
    const res = await deleteAdminCompanies(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setCompanyData((prev) =>
        prev.filter((itm) => itm.company_id !== +idToDelete)
      );
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const viewHandler = (data) => {
    navigate(`/SaleCompanies/ViewCompany/${data.company_id}`, { state: data });
  };

  useEffect(() => {
    fetchSaleCompaniesData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );
  console.log('company data',companyData);
  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent
        title={"Sale Companies"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        icon={<BsPlus />}
        link={"/SaleCompanies/AddSaleCompanies/new"}
        tag={"Add Company"}
      >
        <div className="table-scroll">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Company Name")}</th>
                <th>{t("gst number")}</th>
                <th>{t("pan number")}</th>
                <th>{t("phone number")}</th>
                <th>{t("Company Type")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {companyData.length > 0 ? null : (
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
              {companyData.map((data, id) => (
                <tr key={id}>
                  <td>{serialNumber[id]}</td>
                  <td>{data.company_name}</td>
                  <td>
                    {data?.gst_details?.map((item) => {
                      return item?.is_default == "1" ? item?.gst_number : "";
                    })}
                  </td>
                  <td>{data.pan_number}</td>
                  <td>{data.company_mobile}</td>
                  <td>{data.company_type_name}</td>
                  <td>
                    <ActionButton
                      eyeOnclick={() => viewHandler(data)}
                      editlink={`/SaleCompanies/AddSaleCompanies/${data.company_id}`}
                      deleteOnclick={() => {
                        setIdToDelete(`${data.company_id}`);
                        setShowAlert(true);
                      }}
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
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? companyData.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : companyData.length < pageSize
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

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </Col>
  );
};

export default SaleCompanies;
