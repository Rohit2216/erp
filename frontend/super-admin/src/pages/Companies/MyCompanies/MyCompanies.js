import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../../components/ActionButton";
import CardComponent from "../../../components/CardComponent";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  deleteAdminCompanies,
  getAdminMyCompanies,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPagination from "../../../components/ReactPagination";
import { checkPermission } from "../../../utils/checkPermissions";
import { DELETED } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { useTranslation } from "react-i18next";

const MyCompanies = () => {
  let { pathname } = useLocation();
  const { user, userPermission } = useSelector(selectUser);
  const [companyData, setCompanyData] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();

  const fetchMyCompaniesData = async () => {
    const res = await getAdminMyCompanies(search, pageSize, pageNo);
    if (res.status) {
      setCompanyData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setCompanyData([]);
      setPageDetail({});
    }
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await deleteAdminCompanies(idToDelete, params);
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
    navigate(`/MyCompanies/ViewCompany/${data.company_id}`, { state: data });
  };

  const checkRolesAndPermission = (module, subModule) => {
    const data = userPermission.find((itm) => itm.title == module);

    if (subModule) {
      return data.submodules.find((itm2) => itm2.title == subModule);
    } else return data;
  };

  useEffect(() => {
    fetchMyCompaniesData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent
        title={"My Companies"}
        icon={<BsPlus />}
        link={"/MyCompanies/AddMyCompany/new"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        tag={"Add Company"}
        hideButton={
          checkRolesAndPermission("Companies", "My Companies").create
            ? true
            : false
        }
      >
        <div className="overflow-auto p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                {[
                  "Sr No.",
                  "Company Name",
                  "GST No.",
                  "PAN No.",
                  "Phone No.",
                  "Company Type",
                  "Action",
                ].map((thead) => (
                  <th key={thead}>{thead}</th>
                ))}
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
                      return item?.is_default === "1" ? item?.gst_number : "";
                    })}
                  </td>
                  <td>{data.pan_number}</td>
                  <td>{data.company_mobile}</td>
                  <td>{data.company_type_name}</td>
                  <td>
                    <ActionButton
                      eyeOnclick={() => viewHandler(data)}
                      editlink={`/MyCompanies/AddMyCompany/${data.company_id}`}
                      hideEye={
                        checkRolesAndPermission("Companies", "My Companies")
                          .view
                          ? ""
                          : "d-none"
                      }
                      hideEdit={
                        checkRolesAndPermission("Companies", "My Companies")
                          .update
                          ? ""
                          : "d-none"
                      }
                      hideDelete={
                        checkRolesAndPermission("Companies", "My Companies")
                          .delete
                          ? ""
                          : "d-none"
                      }
                      deleteOnclick={() => {
                        setIdToDelete(`${data.company_id}`);
                        setShowAlert(true);
                      }}
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

export default MyCompanies;
