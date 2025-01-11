import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import ActionButton from "../../../components/ActionButton";
import Modaljs from "../../../components/Modal";
import { Helmet } from "react-helmet";
import { deleteAdminOutlet, getAdminOutlet } from "../../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { DELETED } from "../../../utils/constants";

const OutletsMasterdata = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [singleoutlets, setSingleOutlets] = useState(false);
  const [allOutlets, setAllOutlets] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const singleoutletsList = [
    {
      id: 1,
      type: "text",
      title: "Outlet Name",
      value: singleoutlets?.outlet_name,
    },
    {
      id: 11,
      type: "text",
      title: "Outlet Unique Id",
      value: singleoutlets?.outlet_unique_id,
    },
    {
      id: 2,
      type: "text",
      title: "Outlet Contact Person Name",
      value: singleoutlets?.outlet_contact_person_name,
    },
    {
      id: 3,
      type: "number",
      title: "Outlet Contact Number",
      value: singleoutlets?.outlet_contact_number,
    },
    {
      id: 4,
      type: "number",
      title: "Primary Number",
      value: singleoutlets?.primary_number,
    },
    {
      id: 5,
      type: "number",
      title: "Secondary Number",
      value: singleoutlets?.secondary_number,
    },
    {
      id: 6,
      type: "email",
      title: "Primary Email",
      value: singleoutlets?.primary_email,
    },
    {
      id: 7,
      type: "email",
      title: "Secondary Email",
      value: singleoutlets?.secondary_email,
    },
    {
      id: 8,
      type: "text",
      title: "Customer Code",
      value: singleoutlets?.customer_code,
    },
    {
      id: 9,
      type: "text",
      title: "Outlet Category",
      value: singleoutlets?.outlet_category,
    },
    { id: 10, type: "text", title: "Location", value: singleoutlets?.location },
    { id: 11, type: "text", title: "Address", value: singleoutlets?.address },
    {
      id: 12,
      type: "text",
      title: "Outlet ccnoms",
      value: singleoutlets?.outlet_ccnoms,
    },
    {
      id: 13,
      type: "text",
      title: "Outlet ccnohsd",
      value: singleoutlets?.outlet_ccnohsd,
    },
    {
      id: 14,
      type: "text",
      title: "Outlet resv",
      value: singleoutlets?.outlet_resv,
    },
    {
      id: 15,
      type: "text",
      title: "Outlet longitude",
      value: singleoutlets?.outlet_longitude,
    },
    {
      id: 16,
      type: "text",
      title: "Outlet lattitude",
      value: singleoutlets?.outlet_lattitude,
    },
    {
      id: 17,
      type: "image",
      title: "Outlet Image",
      src: singleoutlets?.outlet_image
        ? `${process.env.REACT_APP_API_URL}${singleoutlets?.outlet_image}`
        : "",
    },
  ];

  // Delete Outlet
  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await deleteAdminOutlet(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setAllOutlets((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchOutletsData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const fetchOutletsData = async () => {
    const res = await getAdminOutlet(search, pageSize, pageNo);
    if (res.status) {
      setAllOutlets(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllOutlets([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchOutletsData();
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
        <title>Outlets · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CardComponent
          title={"All - Outlets"}
          custom={
            <span className="position-relative">
              {" "}
              <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
              <Form.Control
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="me-2"
                aria-label="Search"
              />
            </span>
          }
          icon={<BsPlus />}
          link={"/OutletsMasterdata/AddOutlet/new"}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Outlet id",
                    "Outlet Name",
                    "Zone",
                    "Regional Office",
                    "Sales Area",
                    "District",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allOutlets.length > 0 ? null : (
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
                {allOutlets?.map((outlet, index) => (
                  <tr key={index}>
                    <td>{serialNumber[index]}</td>
                    <td>{outlet.id}</td>
                    <td>{outlet.outlet_name}</td>
                    <td>{outlet.zone_name}</td>
                    <td>{outlet.regional_office_name}</td>
                    <td>{outlet.sales_area_name}</td>
                    <td>{outlet.district_name}</td>
                    <td
                      className={`text-${
                        outlet?.status == 1 ? "green" : "danger"
                      }`}
                    >
                      {outlet?.status == 1 ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(outlet.id);
                          setShowAlert(true);
                        }}
                        eyeOnclick={() => setSingleOutlets(outlet)}
                        editlink={`/OutletsMasterdata/AddOutlet/${outlet.id}`}
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
                  ? allOutlets.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : allOutlets.length < pageSize
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

      <Modaljs
        open={singleoutlets}
        size={"md"}
        closebtn={"Cancel"}
        Savebtn={"Ok"}
        close={() => setSingleOutlets(false)}
        title={"View Outlet"}
      >
        <Row className="g-2 align-items-center">
          {singleoutletsList.map((sOutletdata, id1) =>
            sOutletdata.value || sOutletdata.src ? (
              <Fragment key={id1}>
                <Col md={4}>{sOutletdata.title}</Col>
                <Col md={8}>
                  <Form.Control
                    type={sOutletdata.type}
                    className="fw-bolder"
                    size="100"
                    src={sOutletdata.src}
                    defaultValue={sOutletdata.value}
                    disabled
                  />
                </Col>
              </Fragment>
            ) : null
          )}
        </Row>
      </Modaljs>
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

export default OutletsMasterdata;
