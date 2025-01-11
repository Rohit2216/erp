import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import { getDetailsofComplaintsInMeasurement } from "../../services/contractorApi";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, Image, Row } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

export default function ViewMeasurementDetails() {
  const params = useParams();
  const complaint_id = params?.complaint_id;
  const [edit, setEdit] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchExpenseRequestData = async () => {
    const res = await getDetailsofComplaintsInMeasurement(complaint_id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit();
    }
  };

  useEffect(() => {
    fetchExpenseRequestData();
  }, []);

  function MyCard({ children }) {
    return (
      <Card className="bg-new h-100">
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  return (
    <>
      <CardComponent showBackButton={true} title={"view measurements details"}>
        <Col md={12} className="my-1">
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Complaint Details")}</strong>

            <ul className="list-unstyled m-2">
              <li>
                {t("company Name")}
                <span className="fw-bold">
                  :{edit?.complaints_Details?.companyDetails?.company_name}
                </span>
              </li>
              <li>
                {t("Complaint raiser Details")}
                <span className="fw-bold">
                  : {edit?.complaints_Details?.complaintRaiserDetails?.name}
                </span>{" "}
              </li>
              <li>
                {t("complain type")}
                <span className="fw-bold">
                  :{edit?.complaints_Details?.complaint_type}
                </span>
              </li>
            </ul>
            {edit && (
              <button
                className="shadow border-0  cursor-pointer px-4 py-1 purple-combo"
                onClick={() =>
                  navigate(`/attach-hard-copies`, {
                    state: {
                      complaint_id,
                      type: "update",
                    },
                  })
                }
              >
                {t("Edit")}
              </button>
            )}
          </div>
        </Col>

        <Row>
          <h4 className="my-3 text-center"> {t("attachment details")}</h4>
          {edit?.attachment_details?.[0]?.filePath.length > 0 ? (
            edit?.attachment_details?.[0]?.filePath.map((data, index) => {
              return (
                <>
                  <Col key={index} md={4} className="my-2">
                    <MyCard className="">
                      <div className="mb-3"></div>
                      <div className="object-fit bg-new-re p-2">
                        {data?.fileFormat === "jpg" ||
                        data.fileFormat == "png" ? (
                          <div className="position-relative">
                            <ImageViewer
                              src={process.env.REACT_APP_API_URL + data.file}
                              size={"xl"}
                              // downloadIcon={true}
                            >
                              <Image
                                style={{
                                  height: "100px",
                                  width: "100%",
                                  maxWidth: "100%",
                                }}
                                className=" mt-1"
                                src={process.env.REACT_APP_API_URL + data.file}
                              />
                            </ImageViewer>
                          </div>
                        ) : null}

                        {data?.fileFormat === "pdf" ? (
                          <a
                            href={`${process.env.REACT_APP_API_URL}${data.file}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Card.Img
                              width={200}
                              height={130}
                              className="object-fit"
                              src={`/assets/images/pdf.jpg`}
                            />
                          </a>
                        ) : null}
                        {data?.fileFormat === "docx" ||
                        data?.fileFormat === "doc" ? (
                          <a
                            href={`${process.env.REACT_APP_API_URL}${data.file}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Card.Img
                              width={200}
                              height={130}
                              className="object-fit"
                              src={`/assets/images/docs.png`}
                            />
                          </a>
                        ) : null}
                      </div>

                      <p className="small mb-0 text-truncate2 line-clamp-2">
                        {data?.title}
                      </p>
                    </MyCard>
                  </Col>
                </>
              );
            })
          ) : (
            <span className="text-center">{t("No Files Attach")} </span>
          )}
        </Row>
      </CardComponent>
    </>
  );
}
