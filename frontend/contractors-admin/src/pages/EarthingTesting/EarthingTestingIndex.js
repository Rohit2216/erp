import React from "react";
import { useParams } from "react-router-dom";
import RejectedEarthingTesting from "./RejectedEarthingTesting";
import RequestedEarthingTesting from "./RequestedEarthingTesting";
import AllocateEarthingTesting from "./AllocateEarthingTesting";
import EarthingTesting from "./EarthingTesting";
import ReportEarthingTesting from "./ReportEarthingTesting";
import ApprovedEarthingTesting from "./ApprovedEarthingTesting";

const EarthingTestingIndex = () => {
  const params = useParams();
  return (
    <div>
      {params.page == "request" && <RequestedEarthingTesting />}
      {params.page == "approved" && <ApprovedEarthingTesting />}
      {params.page == "rejected" && <RejectedEarthingTesting />}
      {params.page == "allocate" && <AllocateEarthingTesting />}
      {params.page == "all" && <EarthingTesting />}
      {params.page == "report" && <ReportEarthingTesting />}
    </div>
  );
};

export default EarthingTestingIndex;
