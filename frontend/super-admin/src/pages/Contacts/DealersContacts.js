import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import {
  getAdminAllDealerContacts,
  getAdminUpdateDealerContacts,
} from "../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import CardComponent from "../../components/CardComponent";
import ReactPagination from "../../components/ReactPagination";

const DealersContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchContactsData = async () => {
    const res = await getAdminAllDealerContacts(search, pageSize, pageNo);
    if (res.status) {
      setContacts(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setContacts([]);
      setPageDetail({});
    }
  };
  const handleUpdate = (software) => {
    setStoreId(software);
    setShowAlert(true);
  };
  const handleUpdate2 = (software) => {
    setStoreId(software);
    setShowAlert2(true);
  };

  const handleRejected = async () => {
    const sData = {
      admin_id: storeId.admin_id,
      status: 2,
      user_type: storeId.user_type,
    };
    const res = await getAdminUpdateDealerContacts(sData);
    if (res.status) {
      toast.success(res.message);
      setContacts((prev) =>
        prev.filter((itm) => itm.admin_id !== +storeId.admin_id)
      );
      fetchContactsData();
    } else {
      toast.error(res.message);
    }
  };
  const handleApproved = async () => {
    const sData = {
      admin_id: storeId.admin_id,
      status: 1,
      user_type: storeId.user_type,
    };
    const res = await getAdminUpdateDealerContacts(sData);
    if (res.status) {
      toast.success(res.message);
      setContacts((prev) =>
        prev.filter((itm) => itm.admin_id !== +storeId.admin_id)
      );
      fetchContactsData();
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchContactsData();
  }, [search, pageSize, pageNo]);

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
        title={"Dealers Contacts"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <div className="overflow-auto p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                {["Sr No.", "User Name", "Email", "Phone No.", "Action"].map(
                  (thead) => (
                    <th key={thead}>{thead}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? null : (
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
              {contacts.map((software, id1) => (
                <tr key={id1}>
                  <td>{serialNumber[id1]}</td>
                  <td>{software.name}</td>
                  <td>{software.email}</td>
                  <td>{software.contact_no}</td>
                  <td>
                    <span className="d-align gap-2">
                      <TooltipComponent title={"Reject"}>
                        <span
                          onClick={() => handleUpdate(software)}
                          className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
                        >
                          <BsXLg />
                        </span>
                      </TooltipComponent>
                      <div className="vr hr-shadow"></div>
                      <TooltipComponent title={"Approve"}>
                        <span
                          onClick={() => handleUpdate2(software)}
                          className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                        >
                          <BsCheckLg />
                        </span>
                      </TooltipComponent>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

            <ConfirmAlert
              size={"sm"}
              deleteFunction={handleRejected}
              hide={setShowAlert}
              show={showAlert}
              title={"Confirm Reject"}
              description={"Are you sure you want to reject this!!"}
            />
            <ConfirmAlert
              size={"sm"}
              deleteFunction={handleApproved}
              hide={setShowAlert2}
              show={showAlert2}
              title={"Confirm Approve"}
              description={"Are you sure you want to approve this!!"}
            />
          </Table>
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? contacts.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : contacts.length < pageSize
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
  );
};

export default DealersContacts;
