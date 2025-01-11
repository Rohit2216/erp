import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import { getAllExpenseRequest } from "../../services/contractorApi";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";

const ExpenseRequest = () => {
  const [StockRequest, setStockRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchStockRequestData = async () => {
    const res = await getAllExpenseRequest(search, pageSize, pageNo);
    if (res.status) {
      setStockRequest(res.data);
      setPageDetail(res?.pageDetails);
    } else {
      setStockRequest([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  // set Delay time to get data on search
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    fetchStockRequestData();
  }, [debounceValue, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const getDate = (inputDate) => {
    const [year, month] = inputDate.split("-");
    const date = new Date(`${month}-01-${year}`);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);

    return formattedDate;
  };

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Expense Request · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"All Expense Request"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        backButton={false}
      >
        <div className="table-scroll">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Employee Id")}</th>
                <th>{t("User Name")}</th>
                <th>{t("Total complain")}</th>
                <th>{t("Total Amount")}</th>
                <th>{t("Transfer Amount")}</th>
                <th>{t("Balance")}</th>
                <th>{t("Requested Month")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <td colSpan={10}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              ) : StockRequest.length > 0 ? (
                <>
                  {StockRequest?.map((data, idx) => (
                    <tr key={idx}>
                      <td className="text-secondary text-none">
                        {data.employee_id || "--"}
                      </td>
                      <td>{data.name}</td>
                      <td>{data?.totalPunch ?? "-"}</td>
                      <td className="text-green"> ₹ {data.totalSum ?? "--"}</td>

                      <td className="text-green">
                        ₹ {data.total_expense_amount ?? "--"}
                      </td>
                      <td className="text-green">₹ {data.balance ?? "--"}</td>
                      <td>{getDate(data?.month)}</td>
                      <td>
                        <ActionButton
                          eyelink={`/view-expense-request/${data.id}`}
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <td colSpan={10}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              )}
            </tbody>
            <tfoot>
              <td colSpan={10}>
                <ReactPagination
                  pageSize={pageSize}
                  prevClassName={
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? StockRequest.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : StockRequest.length < pageSize
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
              </td>
            </tfoot>
          </Table>
        </div>
      </CardComponent>
    </Col>
  );
};

export default ExpenseRequest;
