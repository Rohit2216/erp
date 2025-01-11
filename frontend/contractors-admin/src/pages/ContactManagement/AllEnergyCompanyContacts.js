import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import Select from "react-select";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  deleteEnergyCompanyById,
  getAreaManagerInEnergyCompanyById,
} from "../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { useTranslation } from "react-i18next";
import { getAllEneryComnies } from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { FaClipboardCheck } from "react-icons/fa";

const AllEnergyCompanyContacts = () => {
  const [allManager, setAllManager] = useState([]);
  const [allManagerId, setAllManagerId] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [energyId, setEnergyId] = useState({ label: "", value: "" });
  const [allEnergy, setAllEnergy] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchEnergyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      setAllEnergy(res.data);
    } else {
      setAllEnergy([]);
    }
  };
  const fetchAllManagerData = async () => {
    const id = "";
    const res = await getAreaManagerInEnergyCompanyById(
      energyId.value,
      id,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setAllManager(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllManager([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteEnergyCompanyById(allManagerId);
    if (res.status) {
      toast.success(res.message);
      setAllManager((prev) => prev.filter((data) => data.id != allManagerId));
    } else {
      toast.error(res.message);
    }
    setAllManagerId("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchEnergyData();
    fetchAllManagerData();
  }, [energyId.value, allManagerId]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );
  const handleSelect = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((item) => item !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const handleSelectAll = (check) => {
    if (check) {
      const allItemId = allManager.map((item) => item.user_id);
      setSelectedInvoices(allItemId);
    } else setSelectedInvoices([]);
  };
  return (
    <>
      <Helmet>
        <title>Outlet Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          showBackButton={true}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"All Energy Company Overview"}
        >
          <Col md={3} className="mb-3">
            <Select
              placeholder={t("select energy")}
              menuPortalTarget={document.body}
              options={allEnergy?.map((data) => ({
                label: data?.name,
                value: data?.energy_company_id,
              }))}
              value={energyId.value && energyId}
              onChange={(e) => {
                if (e) {
                  setEnergyId({ value: e?.value, label: e?.label });
                } else {
                  setEnergyId({});
                }
              }}
              isClearable
            />
          </Col>
          <div className="d-flex mb-3 justify-content-end">
            {selectedInvoices.length > 0 && (
              <button
                className="shadow border-0 purple-combo cursor-pointer px-4 py-1 me-4"
                onClick={() =>
                  navigate(`/contacts/energy/send-messages/new`, {
                    state: {
                      id: selectedInvoices,
                      data: allManager,
                    },
                  })
                }
              >
                <FaClipboardCheck />
                {t("Send Messages")}
              </button>
            )}
          </div>
          <div className="table-scroll mb-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>
                    {allManager.length > 0 && (
                      <Form.Check
                        onClick={(e) => handleSelectAll(e.target.checked)}
                        checked={allManager.every((item) =>
                          selectedInvoices.includes(item.user_id)
                        )}
                      ></Form.Check>
                    )}
                  </th>
                  <th>{t("Sr No.")}</th>
                  <th>{t("username")}</th>
                  <th>{t("Mobile")}</th>
                  <th>{t("email")}</th>
                  <th>{t("country")}</th>
                  <th>{t("city")}</th>
                  <th>{t("pincode")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt={t("Loading")}
                    />
                  </td>
                </tr>
              ) : allManager.length > 0 ? (
                <>
                  {allManager.map((data, id1) => (
                    <tr key={id1}>
                      <td>
                        <Form.Check
                          checked={selectedInvoices.includes(data.user_id)}
                          onClick={() => handleSelect(data.user_id)}
                        ></Form.Check>
                      </td>
                      <td>{serialNumber[id1]}</td>
                      <td>{data.username}</td>
                      <td>{data.mobile}</td>
                      <td>{data.email}</td>
                      <td>{data.country}</td>
                      <td>{data.city}</td>
                      <td>{data.pin_code}</td>
                      <td>
                        <ActionButton
                          eyeOnclick={() =>
                            navigate(`/team/view-energy-team`, {
                              state: {
                                id: data.user_id,
                                energy_company_id: data?.energy_company_id,
                              },
                            })
                          }
                          editOnclick={() =>
                            navigate(
                              `/team/create-energy-team/${data.user_id}`,
                              {
                                state: {
                                  energy_company_id: data?.energy_company_id,
                                },
                              }
                            )
                          }
                          deleteOnclick={() => {
                            setAllManagerId(data.user_id);
                            setShowDelete(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={9}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}

              <tfoot>
                <tr>
                  <td colSpan={10}>
                    <ConfirmAlert
                      size={"sm"}
                      deleteFunction={handleDelete}
                      hide={setShowDelete}
                      show={showDelete}
                      title={"Confirm Delete"}
                      description={"Are you sure you want to delete this!!"}
                    />
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? allManager.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : allManager.length < pageSize
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

export default AllEnergyCompanyContacts;
