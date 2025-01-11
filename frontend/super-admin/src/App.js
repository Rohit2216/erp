import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/customizer.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { PublicRoutes, RequireAuth } from "./components/AuthChecker";
import { socket } from "./context/sockets";
import { useSelector } from "react-redux";
import { selectUser } from "./features/auth/authSlice";
// import ViewTimeCard from "./pages/HRManagement/ViewTimeCard";

// import ForgetPassword from './pages/Authentication/ForgetPassword';

const Home = lazy(() => import("./pages/Home"));
const Analytics = lazy(() => import("./pages/Analytics"));
const MyCompanies = lazy(() =>
  import("./pages/Companies/MyCompanies/MyCompanies")
);
const AllCompanies = lazy(() => import("./pages/Companies/AllCompanies"));
const AddAllCompanies = lazy(() => import("./pages/Companies/AddAllCompanies"));
const AddMyCompany = lazy(() =>
  import("./pages/Companies/MyCompanies/AddMyCompany")
);
const ViewAllCompanies = lazy(() =>
  import("./pages/Companies/ViewAllCompanies")
);
const ViewCompany = lazy(() => import("./pages/Companies/ViewCompany"));

const SaleCompanies = lazy(() =>
  import("./pages/Companies/SaleCompanies/SaleCompanies")
);
const AddSaleCompanies = lazy(() =>
  import("./pages/Companies/SaleCompanies/AddSaleCompanies")
);

const PurchaseCompanies = lazy(() =>
  import("./pages/Companies/PurchaseCompanies/PurchaseCompanies")
);
const AddPurchaseCompanies = lazy(() =>
  import("./pages/Companies/PurchaseCompanies/AddPurchaseCompanies")
);

const EnergyMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/EnergyMasterdata")
);
const ViewEnergyCompanyDetails = lazy(() =>
  import("./pages/MasterData/EnergyCompany/ViewEnergyCompanyDetails")
);
const AddEnergyCompany = lazy(() =>
  import("./pages/MasterData/EnergyCompany/AddEnergyCompany")
);
const ZoneMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/ZoneMasterdata")
);
const RegionalMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/RegionalMasterdata")
);
const SalesAreaMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/SalesAreaMasterdata")
);
const DistrictMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/DistrictMasterdata")
);
const OutletsMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/OutletsMasterdata")
);
const AddOutlet = lazy(() =>
  import("./pages/MasterData/EnergyCompany/AddOutlet")
);
const EnergyTeamMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyTeamMasterdata")
);
const EnergyTeamMembers = lazy(() =>
  import("./pages/MasterData/EnergyTeamMembers")
);
const DealersMasterdata = lazy(() =>
  import("./pages/MasterData/DealersMasterdata")
);
const DealerUsers = lazy(() => import("./pages/MasterData/DealerUsers"));
const ContractorUsers = lazy(() =>
  import("./pages/MasterData/ContractorUsers")
);
const ContractorsMasterdata = lazy(() =>
  import("./pages/MasterData/ContractorsMasterdata")
);
const ComplaintTypesMasterdata = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/ComplaintTypesMasterdata")
);
const CreateOrderVia = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/OrderVia/CreateOrderVia")
);
const OrderVia = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/OrderVia/OrderVia")
);
const AllComplaintsMasterdata = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/AllComplaintsMasterdata")
);
const UpdateResolved = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/UpdateResolved")
);
const AddComplaintsMasterdata = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/AddComplaintsMasterdata")
);
const ViewUserComplaint = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/ViewUserComplaint")
);
const User = lazy(() => import("./pages/UserManagement/User"));
const MyTeamManagement = lazy(() =>
  import("./pages/UserManagement/MyTeamManagement")
);
const EnergyManagement = lazy(() =>
  import("./pages/UserManagement/CompanyRolesManagement/EnergyManagement")
);
const DealersManagement = lazy(() =>
  import("./pages/UserManagement/CompanyRolesManagement/DealersManagement")
);
const ContractorManagement = lazy(() =>
  import("./pages/UserManagement/CompanyRolesManagement/ContractorManagement")
);
const RolesPermissions = lazy(() =>
  import("./pages/UserManagement/RolesPermissions")
);
const ViewRolesPermissions = lazy(() =>
  import("./pages/UserManagement/ViewRolesPermissions")
);
const TeamMembers = lazy(() => import("./pages/UserManagement/TeamMembers"));
const NoPage = lazy(() => import("./pages/Authentication/NoPage"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SuggestionsFeedbacks = lazy(() => import("./pages/SuggestionsFeedbacks"));
const ViewFeedback = lazy(() =>
  import("./components/ModalContent/ViewFeedback")
);
const SignIn = lazy(() => import("./pages/Authentication/SignIn"));
const AllNotifications = lazy(() => import("./pages/AllNotifications"));
const AllMessages = lazy(() => import("./pages/AllMessages"));
const AllSurvey = lazy(() => import("./pages/Survey/AllSurvey"));
const PurposeMaster = lazy(() => import("./pages/Survey/PurposeMaster"));
const ItemMaster = lazy(() => import("./pages/Survey/ItemMaster"));
const CreateSurvey = lazy(() => import("./pages/Survey/CreateSurvey"));
const ViewSurvey = lazy(() => import("./pages/Survey/ViewSurvey"));
const ResponseSurvey = lazy(() => import("./pages/Survey/ResponseSurvey"));
const ViewResponseSurvey = lazy(() =>
  import("./pages/Survey/ViewResponseSurvey")
);
const AssignedSurvey = lazy(() => import("./pages/Survey/AssignedSurvey"));
const RequestSurvey = lazy(() => import("./pages/Survey/RequestSurvey"));
const DocumentsLists = lazy(() => import("./pages/Documents/DocumentsLists"));
const DocumentCategoryView = lazy(() =>
  import("./pages/Documents/DocumentCategoryView")
);
const DocumentCategory = lazy(() =>
  import("./pages/Documents/DocumentCategory")
);
const CreateDocumentCategory = lazy(() =>
  import("./pages/Documents/CreateDocumentCategory")
);
const AddDocument = lazy(() => import("./pages/Documents/AddDocument"));
const TaskDashboard = lazy(() => import("./pages/TaskManager/TaskDashboard"));
const TaskCategory = lazy(() => import("./pages/TaskManager/TaskCategory"));
const TaskView = lazy(() => import("./pages/TaskManager/TaskView"));
const AllTask = lazy(() => import("./pages/TaskManager/AllTask"));
const SoftwareActivation = lazy(() =>
  import("./pages/SoftwareActivation/SoftwareActivation")
);
const ViewSoftwareDetails = lazy(() =>
  import("./pages/SoftwareActivation/ViewSoftwareDetails")
);
const AllContacts = lazy(() => import("./pages/Contacts/AllContacts"));
const ContractorsContacts = lazy(() =>
  import("./pages/Contacts/ContractorsContacts")
);
const EnergyCompaniesContacts = lazy(() =>
  import("./pages/Contacts/EnergyCompaniesContacts")
);
const DealersContacts = lazy(() => import("./pages/Contacts/DealersContacts"));
const SuperAdminContacts = lazy(() =>
  import("./pages/Contacts/SuperAdminContacts")
);
const CreateContacts = lazy(() => import("./pages/Contacts/CreateContacts"));
const ViewContact = lazy(() => import("./pages/Contacts/ViewContact"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const PlanPricing = lazy(() => import("./pages/PlanPricing"));
const Billings = lazy(() => import("./pages/Billings"));
const EnableDisableFeatures = lazy(() =>
  import("./pages/EnableDisableFeatures")
);
const TermConditions = lazy(() =>
  import("./pages/TermConditions/TermConditions")
);
const ViewTermConditions = lazy(() =>
  import("./pages/TermConditions/ViewTermConditions")
);
const AddTermConditions = lazy(() =>
  import("./pages/TermConditions/AddTermConditions")
);
const DesignationPermissions = lazy(() =>
  import("./pages/HRManagement/DesignationPermissions")
);

const AllRoles = lazy(() => import("./pages/AllRoles"));
const Teams = lazy(() => import("./pages/HRManagement/Teams/Teams"));
const CreateTeams = lazy(() =>
  import("./pages/HRManagement/Teams/CreateTeams")
);
const ViewTeamLevelWise = lazy(() =>
  import("./pages/HRManagement/Teams/ViewTeamLevelWise")
);
const HrTeamMembers = lazy(() => import("./pages/HRManagement/HrTeamMembers"));
const Employees = lazy(() => import("./pages/HRManagement/Employees"));
const AddEmployee = lazy(() => import("./components/ModalContent/AddEmployee"));
const ViewEmployee = lazy(() =>
  import("./pages/HRManagement/ViewEmployee/ViewEmployee")
);
const Attendance = lazy(() => import("./pages/HRManagement/Attendance"));
const UserAttendance = lazy(() =>
  import("./pages/HRManagement/ViewTimeCardsAttendance/UserAttendance")
);
const Leaves = lazy(() => import("./pages/HRManagement/Leaves/Leaves"));
const LeavesType = lazy(() => import("./pages/HRManagement/Leaves/LeavesType"));
const ViewEmployeeLeave = lazy(() =>
  import("./pages/HRManagement/ViewEmployee/ViewEmployeeLeave")
);
const Payroll = lazy(() => import("./pages/HRManagement/Payroll/Payroll"));
const PayrollMaster = lazy(() =>
  import("./pages/HRManagement/Payroll/PayrollMaster")
);
const TimeSheet = lazy(() => import("./pages/HRManagement/Payroll/TimeSheet"));
const InsuranceCompany = lazy(() =>
  import("./pages/HRManagement/Payroll/InsuranceCompany")
);
const InsuranceCompanyPlans = lazy(() =>
  import("./pages/HRManagement/Payroll/InsuranceCompanyPlans")
);
const GroupInsurance = lazy(() =>
  import("./pages/HRManagement/Payroll/GroupInsurance")
);
const AddGroupInsurance = lazy(() =>
  import("./pages/HRManagement/Payroll/AddGroupInsurance")
);
const ViewGroupInsurance = lazy(() =>
  import("./pages/HRManagement/Payroll/ViewGroupInsurance")
);
const SalaryDisbursal = lazy(() =>
  import("./pages/HRManagement/Payroll/SalaryDisbursal")
);
const ViewSalaryDisbursal = lazy(() =>
  import("./pages/HRManagement/Payroll/ViewSalaryDisbursal")
);
const PaySlip = lazy(() =>
  import("./pages/HRManagement/Payroll/PaySlip/PaySlip")
);
const ViewPaySlipDetails = lazy(() =>
  import("./pages/HRManagement/Payroll/PaySlip/ViewPaySlipDetails")
);
const ViewPaySlip = lazy(() => import("./components/ModalContent/ViewPaySlip"));
const Loan = lazy(() => import("./pages/HRManagement/Payroll/Loan"));
const EmployeePromotionDemotion = lazy(() =>
  import(
    "./pages/HRManagement/Payroll/EmployeePromotionDemotion/EmployeePromotionDemotion"
  )
);
const AddEmployeePromotionDemotion = lazy(() =>
  import(
    "./pages/HRManagement/Payroll/EmployeePromotionDemotion/AddEmployeePromotionDemotion"
  )
);
const EmployeeResignation = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeResignation")
);
const EmployeeRetirement = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeRetirement/EmployeeRetirement")
);
const AddEmployeeRetirement = lazy(() =>
  import(
    "./pages/HRManagement/Payroll/EmployeeRetirement/AddEmployeeRetirement"
  )
);
const EmployeeTracking = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeTracking")
);
const EmployeeLogs = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeLogs")
);
const EmployeeActivity = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeActivity")
);
const CodeTesting = lazy(() => import("./pages/CodeTesting"));

const App = () => {
  const { user } = useSelector(selectUser);
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  AOS.init();

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem("body-bg"));
    const bg = `rgba(${selected?.r || 233},${selected?.g || 233},${
      selected?.b || 240
    },${selected?.a || 1})`;
    document.documentElement.style.setProperty("--bs-indigo", bg);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log(socket.id);
    });
    if (user) {
      socket.emit("newUser", { user_id: user.id });
    }
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="vh-100 d-align">
              <img
                className="img-fluid"
                src="/assets/images/Curve-Loading.gif"
                alt="Loading"
              />
            </div>
          }
        >
          <Routes>
            <Route element={<PublicRoutes />}>
              <Route path="/" element={<SignIn />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/Analytics" element={<Analytics />} />
              <Route path="/MyCompanies" element={<MyCompanies />} />
              <Route path="/AllCompanies" element={<AllCompanies />} />
              <Route
                path="/MyCompanies/AddMyCompany"
                element={<AddMyCompany />}
              />
              <Route
                path="/MyCompanies/AddMyCompany/:id"
                element={<AddMyCompany />}
              />
              <Route
                path="/AllCompanies/AddAllCompany/:id"
                element={<AddAllCompanies />}
              />
              <Route
                path="/SaleCompanies/AddSaleCompanies"
                element={<AddSaleCompanies />}
              />
              <Route
                path="/SaleCompanies/AddSaleCompanies/:id"
                element={<AddSaleCompanies />}
              />
              <Route
                path="/PurchaseCompanies/AddPurchaseCompanies"
                element={<AddPurchaseCompanies />}
              />
              <Route
                path="/PurchaseCompanies/AddPurchaseCompanies/:id"
                element={<AddPurchaseCompanies />}
              />
              {/* <Route path="/ViewCompany" element={<ViewCompany />} /> */}
              <Route
                path="/:ViewCompany/ViewCompany/:id"
                element={<ViewCompany />}
              />
              <Route
                path="/AllCompanies/ViewAllCompanies/:id"
                element={<ViewAllCompanies />}
              />
              <Route path="/SaleCompanies" element={<SaleCompanies />} />
              <Route
                path="/PurchaseCompanies"
                element={<PurchaseCompanies />}
              />
              <Route path="/EnergyMasterdata" element={<EnergyMasterdata />} />
              <Route
                path="/EnergyMasterdata/ViewEnergyCompanyDetails/:id"
                element={<ViewEnergyCompanyDetails />}
              />
              <Route
                path="/EnergyMasterdata/AddEnergyCompany/:id"
                element={<AddEnergyCompany />}
              />
              <Route path="/ZoneMasterdata" element={<ZoneMasterdata />} />
              <Route
                path="/RegionalMasterdata"
                element={<RegionalMasterdata />}
              />
              <Route
                path="/SalesAreaMasterdata"
                element={<SalesAreaMasterdata />}
              />
              <Route
                path="/DistrictMasterdata"
                element={<DistrictMasterdata />}
              />
              <Route
                path="/OutletsMasterdata"
                element={<OutletsMasterdata />}
              />
              <Route
                path="/OutletsMasterdata/AddOutlet"
                element={<AddOutlet />}
              />
              <Route
                path="/OutletsMasterdata/AddOutlet/:id"
                element={<AddOutlet />}
              />
              <Route
                path="/EnergyTeamMasterdata"
                element={<EnergyTeamMasterdata />}
              />
              <Route
                path="/EnergyTeamMasterdata/EnergyTeamMembers:id"
                element={<EnergyTeamMembers />}
              />
              <Route
                path="/DealersMasterdata"
                element={<DealersMasterdata />}
              />
              <Route
                path="/DealersMasterdata/DealerUsers/:id"
                element={<DealerUsers />}
              />
              {/* <Route path="/DealerUsers" element={<DealerUsers />} /> */}
              <Route
                path="/ContractorsMasterdata/ContractorUsers/:id"
                element={<ContractorUsers />}
              />
              <Route
                path="/ContractorsMasterdata"
                element={<ContractorsMasterdata />}
              />
              <Route
                path="/AllComplaintsMasterdata"
                element={<AllComplaintsMasterdata />}
              />
              <Route
                path="/AllComplaintsMasterdata/update-resolved/:id"
                element={<UpdateResolved />}
              />
              <Route
                path="/ComplaintTypesMasterdata"
                element={<ComplaintTypesMasterdata />}
              />
              <Route path="/order-via" element={<OrderVia />} />
              <Route
                path="/order-via/create-order-via/:id"
                element={<CreateOrderVia />}
              />
              <Route
                path="/AllComplaintsMasterdata/AddComplaintsMasterdata/:id"
                element={<AddComplaintsMasterdata />}
              />
              <Route
                path="/AllComplaintsMasterdata/ViewUserComplaint/:id"
                element={<ViewUserComplaint />}
              />
              <Route path="/User" element={<User />} />
              <Route path="/MyTeamManagement" element={<MyTeamManagement />} />
              <Route path="/EnergyManagement" element={<EnergyManagement />} />
              <Route
                path="/DealersManagement"
                element={<DealersManagement />}
              />
              <Route
                path="/ContractorManagement"
                element={<ContractorManagement />}
              />
              <Route path="/RolesPermissions" element={<RolesPermissions />} />
              <Route
                path="/AllRoles/ViewRolesPermissions/:id"
                element={<ViewRolesPermissions />}
              />
              <Route path="/TeamMembers" element={<TeamMembers />} />
              <Route
                path="/SoftwareActivation"
                element={<SoftwareActivation />}
              />
              <Route
                path="/SoftwareActivation/ViewSoftwareDetails/:id"
                element={<ViewSoftwareDetails />}
              />
              <Route path="/AllSurvey" element={<AllSurvey />} />
              <Route path="/ItemMaster" element={<ItemMaster />} />
              <Route path="/PurposeMaster" element={<PurposeMaster />} />
              <Route
                path="/AllSurvey/CreateSurvey/:id"
                element={<CreateSurvey />}
              />
              <Route path="/ResponseSurvey" element={<ResponseSurvey />} />
              <Route
                path="/ResponseSurvey/ViewResponseSurvey/:id"
                element={<ViewResponseSurvey />}
              />
              <Route path="/AssignedSurvey" element={<AssignedSurvey />} />
              <Route path="/RequestSurvey" element={<RequestSurvey />} />
              <Route path="/DocumentCategory" element={<DocumentCategory />} />
              <Route
                path="/DocumentCategory/CreateDocumentCategory/:id"
                element={<CreateDocumentCategory />}
              />
              <Route path="/DocumentsLists" element={<DocumentsLists />} />
              <Route
                path="/DocumentCategory/DocumentCategoryView/:id"
                element={<DocumentCategoryView />}
              />
              <Route path="/AddDocument" element={<AddDocument />} />
              <Route path="/AddDocument/:id" element={<AddDocument />} />
              <Route path="/TaskDashboard" element={<TaskDashboard />} />
              <Route path="/TaskCategory" element={<TaskCategory />} />
              <Route path="/AllTask" element={<AllTask />} />
              <Route path="/AllTask/TaskView/:id" element={<TaskView />} />
              <Route
                path="/SuggestionsFeedbacks"
                element={<SuggestionsFeedbacks />}
              />
              <Route path="/ViewFeedback" element={<ViewFeedback />} />
              <Route path="/AllContacts" element={<AllContacts />} />
              <Route
                path="/contractors-contacts"
                element={<ContractorsContacts />}
              />
              <Route
                path="/energy-companies-contacts"
                element={<EnergyCompaniesContacts />}
              />
              <Route path="/dealers-contacts" element={<DealersContacts />} />
              <Route path="/CreateContacts" element={<CreateContacts />} />
              <Route path="/ViewContact" element={<ViewContact />} />
              <Route
                path="/super-admin-contacts"
                element={<SuperAdminContacts />}
              />
              <Route path="/Tutorials" element={<Tutorials />} />
              <Route path="/PlanPricing" element={<PlanPricing />} />
              <Route path="/Billings" element={<Billings />} />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/UserProfile" element={<UserProfile />} />
              <Route path="/AllNotifications" element={<AllNotifications />} />
              <Route path="/AllMessages" element={<AllMessages />} />
              <Route
                path="/EnableDisableFeatures"
                element={<EnableDisableFeatures />}
              />
              <Route path="/TermConditions" element={<TermConditions />} />
              <Route
                path="/TermConditions/ViewTermConditions/:id"
                element={<ViewTermConditions />}
              />
              <Route
                path="/TermConditions/AddTermConditions/:id"
                element={<AddTermConditions />}
              />
              <Route
                path="/DesignationPermissions"
                element={<DesignationPermissions />}
              />
              <Route path="/Teams" element={<Teams />} />
              <Route path="/Teams/create-teams/:id" element={<CreateTeams />} />
              <Route
                path="/Teams/view-team-level-wise/:id"
                element={<ViewTeamLevelWise />}
              />
              <Route path="/AllRoles" element={<AllRoles />} />
              <Route
                path="/Teams/HrTeamMembers/:id"
                element={<HrTeamMembers />}
              />
              <Route path="/Employees" element={<Employees />} />
              <Route path="/Employees/AddEmployee" element={<AddEmployee />} />
              <Route
                path="/Employees/ViewEmployee/:id"
                element={<ViewEmployee />}
              />
              <Route
                path="/Employees/AddEmployee/:id"
                element={<AddEmployee />}
              />
              <Route path="/Attendance" element={<Attendance />} />
              <Route
                path="/Attendance/UserAttendance/:id"
                element={<UserAttendance />}
              />
              <Route path="/Leaves" element={<Leaves />} />
              <Route path="/LeavesType" element={<LeavesType />} />
              <Route
                path="/ViewEmployeeLeave/:id"
                element={<ViewEmployeeLeave />}
              />
              <Route path="/Loan" element={<Loan />} />
              <Route path="/Payroll" element={<Payroll />} />
              <Route path="/PayrollMaster" element={<PayrollMaster />} />
              <Route path="/TimeSheet" element={<TimeSheet />} />
              <Route path="/TimeSheet" element={<TimeSheet />} />
              <Route path="/InsuranceCompany" element={<InsuranceCompany />} />
              <Route
                path="/InsuranceCompanyPlans"
                element={<InsuranceCompanyPlans />}
              />
              <Route path="/GroupInsurance" element={<GroupInsurance />} />
              <Route
                path="/GroupInsurance/AddGroupInsurance/:id"
                element={<AddGroupInsurance />}
              />
              <Route
                path="/GroupInsurance/ViewGroupInsurance/:id"
                element={<ViewGroupInsurance />}
              />
              <Route
                path="/GroupInsurance/AddGroupInsurance"
                element={<AddGroupInsurance />}
              />
              <Route path="/SalaryDisbursal" element={<SalaryDisbursal />} />
              <Route
                path="/SalaryDisbursal/ViewSalaryDisbursal/:id/:month"
                element={<ViewSalaryDisbursal />}
              />
              <Route path="/PaySlip" element={<PaySlip />} />
              <Route
                path="/PaySlip/ViewPaySlipDetails/:id/:month"
                element={<ViewPaySlipDetails />}
              />
              <Route path="/ViewPaySlip" element={<ViewPaySlip />} />
              <Route
                path="/EmployeePromotionDemotion"
                element={<EmployeePromotionDemotion />}
              />
              <Route
                path="/EmployeePromotionDemotion/AddEmployeePromotionDemotion/:id"
                element={<AddEmployeePromotionDemotion />}
              />
              <Route
                path="/EmployeePromotionDemotion/AddEmployeePromotionDemotion"
                element={<AddEmployeePromotionDemotion />}
              />
              <Route
                path="/EmployeeResignation"
                element={<EmployeeResignation />}
              />
              <Route
                path="/EmployeeRetirement"
                element={<EmployeeRetirement />}
              />
              <Route
                path="/EmployeeRetirement/AddEmployeeRetirement/:id"
                element={<AddEmployeeRetirement />}
              />
              <Route path="/EmployeeTracking" element={<EmployeeTracking />} />
              <Route path="/EmployeeLogs" element={<EmployeeLogs />} />
              <Route
                path="/EmployeeLogs/EmployeeActivity/:id"
                element={<EmployeeActivity />}
              />
              <Route path="/CodeTesting" element={<CodeTesting />} />

            </Route>
            {/* <Route path="/SignIn" element={<SignIn />} /> */}
            <Route path="/ViewSurvey/:id" element={<ViewSurvey />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
export default App;
