import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSingleEarthingTestingById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ViewEarthingTesting = () => {
  const [earthingTestingData, setEarthingTestingData] = useState([]);
  const location = useLocation();
  const id = location.state.id;
  const { t } = useTranslation();

  const fetchViewEarthingTestingById = async () => {
    const res = await getSingleEarthingTestingById(id);
    console.log(res.data, "earthing data");
    if (res.status) {
      setEarthingTestingData(res.data);
    } else {
      setEarthingTestingData([]);
    }
  };

  useEffect(() => {
    if (id) fetchViewEarthingTestingById();
  }, []);
  return (
    <CardComponent showBackButton={true} title={"view Earthing Testing"}>
      <div className="mb-3">
        <Col md={12}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">Details</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("Complaint Type")} :</th>
                    <td>{earthingTestingData?.complaint_type_name}</td>
                  </tr>
                  <tr>
                    <th>{t("Complaint id")} :</th>
                    <td>{earthingTestingData?.complaint_unique_id}</td>
                  </tr>
                  <tr>
                    <th>{t("created by")} :</th>
                    <td>{earthingTestingData?.created_by}</td>
                  </tr>
                  <tr>
                    <th>{t("Outlet Data")} :</th>
                    <td>
                      {earthingTestingData?.outletData?.map((data) => (
                        <span className="shadow px-1 me-2">
                          {data.outlet_name}
                        </span>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("User Data")} :</th>
                    <td>
                      {earthingTestingData?.user_data?.map((data) => (
                        <span className="shadow px-1 me-2">{data.name}</span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </div>
    </CardComponent>
  );
};

export default ViewEarthingTesting;
