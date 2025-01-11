import React, { useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import TeamLevelWise from "./TeamLevelWise";
import TeamCardWise from "./TeamCardWise";
import { useTranslation } from "react-i18next";

const Teams = () => {
  const [typeData, setTypeData] = useState("Card Wise");
  const { t } = useTranslation();
  const handleClick = async (e) => {
    setTypeData(e.target.textContent);
  };
  return (
    <>
      <Helmet>
        <title>Teams · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab={"2"}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={t("Teams")} />
            <Tab className="ms-auto" title={t("Card Wise")}>
              {typeData == t("Card Wise") && <TeamCardWise />}
            </Tab>
            {/* <Tab title={["Level wise"]}>
              {typeData === "Level wise" && <TeamLevelWise />}
            </Tab> */}
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default Teams;
