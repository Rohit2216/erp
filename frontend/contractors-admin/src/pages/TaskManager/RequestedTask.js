import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";

import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import {
  getAdminAllTasklist,
  getAdminDeleteTask,
} from "../../services/authapi";
import moment from "moment";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RequestedTask = () => {
  const [taskList, setTaskList] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchTaskListData = async () => {
    const status = 1;
    const res = await getAdminAllTasklist(search, pageSize, pageNo, status);
    console.log("tasklist", res.data);
    if (res.status) {
      setTaskList(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setTaskList([]);
      setPageDetail({});
    }
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteTask(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setTaskList((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchTaskListData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchTaskListData();
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
        <title>Task Manager · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Request Task"}
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
                  <th>{t("Task Category")}</th>
                  <th>{t("Task Name")}</th>
                  <th>{t("Project Name")}</th>
                  <th>{t("Task Assign")}</th>
                  <th>{t("Start Date")}</th>
                  <th>{t("End Date")}</th>
                  <th>{t("status")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {taskList.length > 0 ? null : (
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
                {taskList.map((list, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td
                      className={
                        list.start_date > list.end_date && "text-danger"
                      }
                    >
                      {list.category_name}
                    </td>
                    <td>{list.title}</td>
                    <td>{list.project_name}</td>
                    <td>{list.assign_user_name}</td>
                    <td>{moment(list.start_date).format("MM-DD-YYYY")}</td>
                    <td>{moment(list.end_date).format("MM-DD-YYYY")}</td>
                    <td
                      className={
                        list.start_date > list.end_date && "text-danger"
                      }
                    >
                      {list.status}
                    </td>
                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(list.id);
                          setShowAlert(true);
                        }}
                        eyelink={`/AllTask/TaskView/${list.id}`}
                        editOnclick={() =>
                          navigate(`/task/create/${list.id}`, {
                            state: {
                              list: list,
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
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
                ? taskList.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : taskList.length < pageSize
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

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleDelete}
          hide={setShowAlert}
          show={showAlert}
          title={"Confirm Delete"}
          description={"Are you sure you want to delete this!!"}
        />
      </Col>
    </>
  );
};

export default RequestedTask;
