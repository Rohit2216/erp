import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { getSingleResponseSurvey } from "../../services/authapi";
import { useParams } from "react-router-dom";

const ViewResponseSurvey = () => {
  const [survey, setSurvey] = useState([]);
  const { id } = useParams();

  const fetchAllSurveyData = async () => {
    const res = await getSingleResponseSurvey(id);
    if (res.status) {
      setSurvey(res.data);
    } else {
      setSurvey([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAllSurveyData();
    }
  }, []);

  return (
    <Col md={12}>
      <CardComponent title={"View Response Survey"}>
        <div className="d-grid gap-2">
          {survey?.length > 0 ? null : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
          {survey[0]?.question_list?.map((data, idx) => (
            <div
              className="border-orange border-5 border-start border-end rounded-4 shadow p-3"
              key={idx}
            >
              {survey[0].format === "Add General Field" ? (
                <>
                  <p className="mb-2 text-secondary">
                    {data?.question?.question?.title}
                  </p>
                  <div className="d-grid gap-2">
                    {data?.question?.question?.answers.map((answer, ide) => (
                      <Form.Control
                        className={`text-${!answer && "muted"}`}
                        key={ide}
                        type="text"
                        value={answer ? answer : "No Response"}
                        disabled
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-2 text-secondary">
                    item -{" "}
                    <span className="text-gray">
                      {data?.question?.item?.label}
                    </span>
                  </p>
                  <p className="mb-2 text-secondary">
                    purpose -{" "}
                    <span className="text-gray">
                      {data?.question?.purpose?.label}
                    </span>
                  </p>
                  <p className="mb-2 text-secondary">
                    minqty -{" "}
                    <span className="text-gray">{data?.question?.minqty}</span>
                  </p>
                  <p className="mb-2 text-secondary">
                    userinput -{" "}
                    <span className="text-gray">
                      {data?.question?.userinput}
                    </span>
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </CardComponent>
    </Col>
  );
};

export default ViewResponseSurvey;
