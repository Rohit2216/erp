// import React, { useState, useEffect } from "react";
// import { Col, Table } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import moment from "moment";
// import { getAllLeaveBalance } from "../../../services/authapi";

// const LeaveBalance = () => {
//   const { t } = useTranslation();

//   // States for year and month filters
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch leave balance data
//   const fetchLeaveBalance = async () => {
//     setLoading(true);
//     try {
//       const response = await getAllLeaveBalance(selectedYear, selectedMonth);
//       if (response.status) {
//         setData(response.leaveStatuses || []);
//       } else {
//         setData([]);
//         console.error(response.message);
//       }
//     } catch (error) {
//       console.error("Error fetching leave balance:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data on year or month change
//   useEffect(() => {
//     fetchLeaveBalance();
//   }, [selectedYear, selectedMonth]);

//   return (
//     <Col md={12} data-aos={"fade-up"}>
//       <div className="mb-3 d-flex align-items-center gap-3">
//         {/* Year filter */}
//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//           className="form-select"
//           aria-label="Select Year"
//         >
//           <option value="">{t("Select Year")}</option>
//           <option value={new Date().getFullYear()}>{t("Current Year")}</option>
//         </select>

//         {/* Month filter */}
//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="form-select"
//           aria-label="Select Month"
//         >
//           <option value="">{t("Select Month")}</option>
//           {Array.from({ length: 12 }, (_, i) => (
//             <option key={i} value={i + 1}>
//               {t(moment().month(i).format("MMMM"))}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="table-scroll p-2">
//         {loading ? (
//           <p className="text-center">{t("Loading...")}</p>
//         ) : (
//           <Table className="text-body bg-new Roles">
//             <thead className="text-truncate">
//               <tr>
//                 <th>{t("Employee Name")}</th>
//                 <th>{t("Pending Leaves")}</th>
//                 <th>{t("Approved Leaves")}</th>
//                 <th>{t("Paid Leaves")}</th>
//                 <th>{t("Unpaid Leaves")}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="text-center">
//                     <img
//                       className="p-3"
//                       alt="no-result"
//                       width="280"
//                       src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//                     />
//                     <p>{t("No leave data available.")}</p>
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((ele, index) => (
//                   <tr key={index}>
//                     <td>
//                       <div className="d-flex align-items-center">
//                         <img
//                           className="avatar me-2"
//                           src={
//                             ele.user_image
//                               ? `${process.env.REACT_APP_API_URL}/${ele.user_image}`
//                               : "./assets/images/default-image.png"
//                           }
//                           alt="user-img"
//                         />
//                         {ele.user_name || t("N/A")}
//                       </div>
//                     </td>
//                     <td>{ele.pending_leaves || 0}</td>
//                     <td>{ele.approved_leaves || 0}</td>
//                     <td>{ele.paid_leaves || 0}</td>
//                     <td>{ele.unpaid_leaves || 0}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>
//         )}
//       </div>
//     </Col>
//   );
// };

// export default LeaveBalance;



import React, { useState, useEffect } from "react";
import { Col, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { getAllLeaveBalance } from "../../../services/authapi";

const LeaveBalance = () => {
  const { t } = useTranslation();

  // States for year and month filters
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch leave balance data
  const fetchLeaveBalance = async () => {
    setLoading(true);
    try {
      const response = await getAllLeaveBalance(selectedYear, selectedMonth);
      if (response.status) {
        setData(response.leaveStatuses || []);
      } else {
        setData([]);
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on year or month change
  useEffect(() => {
    fetchLeaveBalance();
  }, [selectedYear, selectedMonth]);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <div className="mb-3 d-flex align-items-center gap-3">
        {/* Year filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="form-select form-select-sm"
          aria-label="Select Year"
          style={{ maxWidth: "150px" }} // Smaller size for dropdown
        >
          <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
          <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
          <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
        </select>

        {/* Month filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="form-select form-select-sm"
          aria-label="Select Month"
          style={{ maxWidth: "150px" }} // Smaller size for dropdown
        >
          <option value="">{t("Select Month")}</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {t(moment().month(i).format("MMMM"))}
            </option>
          ))}
        </select>
      </div>

      <div className="table-scroll p-2">
        {loading ? (
          <p className="text-center">{t("Loading...")}</p>
        ) : (
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Employee Name")}</th>
                <th>{t("Pending Leaves")}</th>
                <th>{t("Approved Leaves")}</th>
                <th>{t("Paid Leaves")}</th>
                <th>{t("Unpaid Leaves")}</th>
                <th>{t("Remaining Paid Leaves")}</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    <img
                      className="p-3"
                      alt="no-result"
                      width="280"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                    <p>{t("No leave data available.")}</p>
                  </td>
                </tr>
              ) : (
                data.map((ele, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          className="avatar me-2"
                          src={
                            ele.user_image
                              ? `${process.env.REACT_APP_API_URL}/${ele.user_image}`
                              : "./assets/images/default-image.png"
                          }
                          alt="user-img"
                        />
                        {ele.user_name || t("N/A")}
                      </div>
                    </td>
                    <td>{ele.pending_leaves || 0}</td>
                    <td>{ele.approved_leaves || 0}</td>
                    <td>{ele.paid_leaves || 0}</td>
                    <td>{ele.unpaid_leaves || 0}</td>
                    <td>{ele.remaining_leaves || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
    </Col>
  );
};

export default LeaveBalance;
