import React, { useEffect, useState } from "react";
import { Button, Col, Form, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { getAllAssets, sendToRepair } from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import TooltipComponent from "../../components/TooltipComponent";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Modaljs from "../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import { useTranslation } from "react-i18next";

const AssignedAssets = () => {
  const [requestData, setRequestData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [repairAlertAndId, setRepairAlertAndId] = useState("");
  const [repairName, setRepairName] = useState("");
  const { t } = useTranslation();

  const fetchAllAssignedAssetData = async () => {
    const isDropdown = "1";
    const status = "4";
    const res = await getAllAssets({
      search,
      pageSize,
      pageNo,
      isDropdown,
      status,
    });
    if (res.status) {
      setRequestData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRequestData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllAssignedAssetData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleSendToRepair = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: repairAlertAndId,
      status: "5",
      description: values.description,
    };

    const res = await sendToRepair(sData);
    if (res.status) {
      toast.success(res.message);
      setRequestData((prev) =>
        prev.filter((data) => data.id !== repairAlertAndId)
      );
    } else {
      toast.error(res.message);
    }
    setRepairAlertAndId("");
    resetForm();
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>All Assigned Assets · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"Assigned Assets"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <div className="table-scroll  mb-2">
          <Table className="text-body  Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Asset Name")}</th>
                <th>{t("Asset Model No")}</th>
                <th>{t("uin No")}</th>
                <th>{t("Price")}</th>
                <th>{t("Purchase Date")}</th>
                <th>{t("Status")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <td colSpan={7}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt={t("Loading")}
                  />
                </td>
              ) : requestData.length > 0 ? (
                <>
                  {requestData?.map((data, idx) => (
                    <tr key={idx}>
                      <td>{serialNumber[idx]}</td>
                      <td>{data.asset_name}</td>
                      <td>{data.asset_model_number}</td>
                      <td>{data.asset_uin_number}</td>
                      <td>{data.asset_price}</td>
                      <td>{data.asset_purchase_date}</td>
                      <td className={`text-green`}>Assigned</td>
                      <td>
                        <ActionButton
                          eyelink={`/AssignedAssets/timeline-assigned-assets/${data.id}`}
                          hideDelete={"d-none"}
                          editlink={`/AllAssets/CreateAssets/${data?.id}`}
                          custom={
                            <>
                              <TooltipComponent
                                align="left"
                                title={"sent to repair"}
                              >
                                <Button
                                  className={`view-btn`}
                                  variant="light"
                                  onClick={() => {
                                    setRepairAlertAndId(data.id);
                                    setRepairName(data.asset_name);
                                  }}
                                >
                                  <HiOutlineWrenchScrewdriver
                                    className={`social-btn red-combo`}
                                  />
                                </Button>
                              </TooltipComponent>
                            </>
                          }
                        />
                      </td>
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
        </div>
        <ReactPagination
          pageSize={pageSize}
          prevClassName={
            pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
          }
          nextClassName={
            pageSize == pageDetail?.total
              ? requestData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : requestData.length < pageSize
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

      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: "",
          notes: "",
        }}
        // validationSchema={addUserIdSchema}
        onSubmit={handleSendToRepair}
      >
        {(props) => (
          <Modaljs
            open={repairAlertAndId}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"send"}
            close={() => setRepairAlertAndId(false)}
            formikProps={props}
            title={`send to repair (${repairName})`}
          >
            <Form.Group className="mt-3">
              <Form.Label>Type description</Form.Label>
              <TextareaAutosize
                minRows={2}
                className="edit-textarea"
                name={"description"}
                value={props.values.description}
                onChange={props.handleChange}
              />
            </Form.Group>
          </Modaljs>
        )}
      </Formik>
    </Col>
  );
};

export default AssignedAssets;
