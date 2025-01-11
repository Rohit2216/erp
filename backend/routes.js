const express = require('express')
/** * validation helper  */

const { verifySuperAdminToken, verifyContractorToken, verifyEnergyCompanyToken, verifyDealerToken, verifySubUserToken, permissionCheck } = require('./helpers/verifyToken')

/** * Super Admin Api Controller and Method  */
const { superAdminLogin, getProfileDetails, updateProfile, changePassword, createEnergyCompany, getAllSubUserForSuperAdmin, getAllSuperAdminAndUsersWithPendingAccountStatus, superAdminAccountStatusAction, markAsResolvedComplaints } = require('./controllers/superAdminController');

const { createRole, getAllRoles, editRole, updateRole, deleteRole, getAllRolesForDropdown } = require('./controllers/roleController')
const { createZone, getAllZones, getAllActiveZones, editZone, updateZone, deleteZone, getEnergyCompanyAssignZones } = require('./controllers/zoneController')
const { createRegionalOffice, getAllRegionalOffices, getRegionalOfficeById, getActiveRegionalOffices, editRegionalOffice, updateRegionalOffice, deleteRegionalOffice, getRegionalOfficesOnZoneId, getRegionalOfficersOnRo } = require('./controllers/regionalOfficeController')
const { addSalesArea, getSalesArea, getSalesAreaById, getActiveSalesArea, editSalesArea, updateSalesArea, deleteSalesArea, getSaleAreaOnRoId } = require('./controllers/salesAreaController')
const { addDistrict, getDistricts, getDistrictById, getActiveDistricts, editDistrictById, updateDistrictById, removeDistrictById, getAllDistrictBySaleAreaId } = require('./controllers/districtController')
const { addOutlet, getAllOutlet, getOutletById, editOutlet, updateOutlet, removeOutletById, getOutletByDistrictId, getOutletByEnergyCompanyId } = require('./controllers/outletController')

const { addSaleCompany, getSaleCompanies, getSaleCompanyById, editSalesCompany, updateSalesCompany, removeSalesCompanyById } = require('./controllers/saleCompanyController')
const { addPurchaseCompany, getPurchaseCompany, getPurchaseCompanyById, editPurchaseCompany, updatePurchaseCompanyById, deletePurchaseCompanyById } = require('./controllers/purchaseCompanyController')

const { createCompany, getMyCompany, getMyCompanySingleDetailsById, updateMyCompanyDetails, deleteMyCompany, getCompanyTypes, getAllCompany, getCompanySingleDetailsById, updateCompanyDetails, getAllCompanyForDropdown, getCompanyDetailsById } = require('./controllers/companyController')

const { getAllModule } = require('./controllers/moduleController')
const { getAllSubModule, getSubModuleWithModuleName, getSubModuleByModuleId } = require('./controllers/subModuleController')



const { setPermissionOnRoleBasis, setPermissionOnRole, checkPermittedModuleOnRoleBasis, getAllPermittedModuleNameOnRoleBasis, updatePermissionOnRoleBasis, setPermission } = require('./controllers/permissionController')

const { addComplaintType, getAllComplaintTypes, getComplaintTypeById, updateComplaintType, updateComplaintStatus, complaintFlitter, allNewComplaints, allPendingComplaints, allApprovedComplaints, allRejectedComplaints, allResolvedComplaints, complaintAssignTo, getApprovelList, setComplaintApproval, notApprovalSetComplaint, getComplaintsById } = require('./controllers/complaintTypeController')

const { addComplaintSubType, getAllComplaintSubTypes, getComplaintSubTypeById, updateComplaintSubType } = require('./controllers/complaintSubTypeController')

const { createTeam, getParentTeamHead, getTeamDetailsById, updateTeamDetails, getTeamGroup } = require('./controllers/teamController')

const { getAllPendingRequests, viewSinglePendingRequestDetails, approvedSoftwareActivationRequest, rejectedSoftwareActivationRequest, deleteSoftwareActivationRequest, getAllApprovedRequests, getAllRejectedRequests } = require('./controllers/softwareActivationRequestController')

const { getAllFeedbackAndSuggestions } = require('./controllers/feedbackAndSuggestionController')

const { getEnergyCompanies, getEnergyCompaniesContacts, getEnergyCompanyZoneSubUsers, getEnergyCompanyRegionalOfficeSubUsers, getEnergyCompanySaleAreaSubUsers, getEnergyCompanySubUserDetailById, getEnergyCompanyUserDetailsById } = require('./controllers/contactController')

const { createEnergyCompanyUser, createSubUsersForEnergyCompanyZoneUser, createSubUsersForEnergyCompanyRegionalOfficeUser, createSubUsersForEnergyCompanySaleAreaUser, getEnergyCompanyDetailsById, updateEnergyCompanyDetails, updateEnergyCompanyUserDetails, updateEnergyCompanySubUserDetails, deleteEnergyCompany, deleteEnergyCompanyUser, energyCompanyDeleteSubUser, getAllActiveEnergyCompany, getAllCreatedEnergyCompany, getAllCreatedEnergyCompanyWithSoftDelete, getAllEnergyCompanyAndUsersWithPendingAccountStatus, energyCompanyAccountStatusAction, getAllZoneByEnergyCompanyId, checkRelatedDataForEnergyCompany, deleteRelatedDataForEnergyCompany, getEnergyCompanySubSidiaries } = require('./controllers/energyCompanyController');

const { contractorCreate, getContractorById, updateContractorDetailsById, createContractorUser, getAllContractorAndUsers, getContractorAndUsersFullDetailByIdAndType, deleteContractorAndUsers, getAllContractorAndUsersWithPendingAccountStatus, contractorAccountStatusAction, getContractorSidebar, getContractorSidebarTest } = require('./controllers/contractorController')

const { createTutorial, getTutorials, getTutorialByFormat, updateTutorials, deleteTutorialsById } = require('./controllers/tutorialController')
const { createPlan, getAllPlans, getPlanById, updatePlanDetails, deletePlan, buyPlan } = require('./controllers/planController')

const { createNotifications, getNotifications, getLoggedUserNotifications, countLoggedUserUnreadNotifications, markAsReadNotifications } = require('./controllers/notificationController')

const { createItemMaster, getAllItemMasters, getSingleItemMaster, updateItemMaster, deleteItemMaster, getAllItemMastersForDropdown, addItemFromStockRequest, checkItemUniqueIdExist, addItemFromFundRequest, approvedAddItemFromFundRequest, byNameToHsnCode, getAllItemsBySupplierId } = require('./controllers/itemMasterController')

const { createPurposeMaster, getAllPurposeMaster, getSinglePurposeMasterById, updatePurposeMaster, deletePurposeMasterById } = require('./controllers/purposeMasterController')

const { createSurvey, getAllSurvey, getSurveyById, editSurveyDetails, updateSurveyDetails, deleteSurvey, getAssignedSurvey, getRequestedSurvey, getSurveyQuestionResponse, assignToSurvey, updateRequestedSurveyStatus, surveyQuestionFormResponse, otpSendSurvey, VerifyOtpSurvey, getSurveyResponseById } = require('./controllers/surveyController')

const { createDocumentCategory, getAllDocumentCategory, getDocumentCategoryById, updateDocumentCategory, removeDocumentCategoryById, addDocuments, getAllDocuments, viewDocuments, getDocumentOnCategoryById, removeDocumentById, updateDocuments } = require('./controllers/documentController')

const { createTask, getAllTaskList, getTaskById, updateTaskDetails, deleteTask, taskDashboard, updateMainTaskStatus, getAllTaskByStatus } = require('./controllers/taskManagerController')

const { createTaskCategory, getAllTaskCategory, getSingleTaskCategory, updateTaskCategoryDetails, removeTaskCategoryById } = require('./controllers/taskCategoryController')

const { createTaskComment, updateTaskComment, getTaskCommentDetailsById } = require('./controllers/taskActionController')

const { sendMessage, getMessages, getSenderAllMessages, addNewUserToChat, getTotalUnreadMessages, markAllMessagesRead, markReadSenderAllMessages, startChatWIthNewUser } = require('./controllers/messageController')

//HR Management
const { createHrTeam, getAllHrTeamWithMember, getHrTeamDetailsById, updateHrTeamDetails, deleteHrTeam, removeSpecificUserFromTeam, addNewMemberInTeam, getMemberListToAddInTeam, getMemberListWithoutTeam, getLoggedUserDetails, getUsersOnRoleId, saveUserHierarchyLevel } = require('./controllers/hrTeamController')

const { importData, importUserData } = require('./controllers/importDataController')

const { createBreaks, getAllBreaks, getBreakOnId, updateBreaks, deleteBreak } = require('./controllers/breakController')

const { getAllStoredEmployeeDetails, getSingleEmployeeDetailById, updateEmployeeDetails, deleteEmployee, getEmployeeTaskById } = require('./controllers/employeeController')

const { clockIn, clockOut, checkClockInToday, startBreak, endBreak, timeSheet, getAttendanceChartById, checkTodayMarkBreakAndAttendance, getMonthsTotalWorkHour, checkTotalUsersTimeSheet, checkTotalUsersTimeSheetNew, getAllUsersTodayClockIn, getAllUsersTodayClockOut, markUserClockInClockOutBySuperAdmin, createManuallyClockInClockOut, getTimeSheetOfAllUserForSuperAdmin, markAttendance, getAllUserTimeSheetInCalendarView, getSingleUserAttendanceTimeSheetInCalendarView, markAttendanceInBulk, getClockInStatus, getPastDaysAttendance, getPastDaysAttendanceUsers, downloadCsvFileForUsers, downloadPdfFileForUsers, getTodayAttendance } = require('./controllers/attendanceController')

const { createLeaveType, getAllLeaveType, getAllActiveLeaveType, getAllLeaveTypeById, updateLeaveType, deleteLeaveType } = require('./controllers/leaveTypeController')

const { applyLeave, getAllLeaveApplications, updateLeaveApplication, getSingleLeaveApplication, leaveApplicationSoftDelete, getCountLeaves, getAllLeaveBalance } = require('./controllers/leaveApplicationController')

const { registerInsuranceCompany, getAllInsuranceCompanyList, getSingleInsuranceCompanyDetails, updateInsuranceCompanyDetails, deleteInsuranceCompanyById } = require('./controllers/insuranceCompanyController')

const { registerInsuranceCompanyPlan, getAllInsurancePlans, getInsurancePlanById, updateInsurancePlanDetails, deleteInsurancePlanById, getInsuranceCompanyWithPlansById } = require('./controllers/insuranceCompanyPlanController')

const { employeeAddAction, getAllEmployeePromotionDemotion, getAllEmployeePromotionDemotionById, updateEmployeePromotionDemotionDetails } = require('./controllers/employeePromotionDemotionController');

const { registerResignation, getPendingResignationRequests, getApprovedResignationRequests, getRejectedResignationRequests, getResignationDetailsById, updateResignationDetails, resignationRequestViewed, resignationStatusUpdateByAdmin, generateFnFStatement, getFnfStatement } = require('./controllers/employeeResignationController');

const { registerPensionForEmployee, getAllRegisteredPension, getRegisteredPensionById, updatePensionDetails, deletePensionById } = require('./controllers/employeeRetirementController');

const { createGroupInsurance, getAllGroupInsurance, getSingleGroupInsuranceDetails, updateGroupInsuranceDetails, deleteGroupInsurance } = require('./controllers/groupInsuranceController');

const { createUsers, updateUsers, getAllManagerUsers, getEmployeeDocumentsById, getEmployeeLoginDetailsById, sendLoginCredentialsViaEmail, sendLoginCredentialsViaWhatsApp, changeUserStatus, getUsersByRoleId, getAdminsByRoleId, getUsersByAdminId, userStatusTimeLine, allUserFromAdmin } = require('./controllers/userController')

const { createTermsAndConditions, getAllCreateTermsAndConditions, getCreateTermsAndConditionsDetailsById, updateTermsConditionsDetails, deleteTermsAndConditions } = require('./controllers/termsAndConditionsController')

const { addDetailsSalary, getAllCreatedSalaryDetails, getCreatedSalaryDetailsById, updateSalaryDetails, deleteSalaryDetails } = require('./controllers/salaryController')

const { getAllUserSalaryForDisbursal, getUserSalaryDisbursalDetailsById, markSalaryDisbursed } = require('./controllers/salaryDisbursalController')

const { getUsersPaySlip, getUserPayslipDetailsById } = require('./controllers/paySlipController')

const { createLoan, getAllLoanRequests, getAllActiveLoan, getAllRejectedLoan, getAllClosedLoan, getLoanDetailById, updateLoanDetails, updateLoanStatus, deleteLoanDetailById } = require('./controllers/loanController')

const { getAllActivityLog, getActivityLogDetails } = require('./controllers/activityLogController')

const { trackEmployeeHistory } = require('./controllers/employeeTrackingController')

const { addPayrollMasterSettingLabel, getAllPayRollMasterSettings, updatePayrollSettings, updatePayrollSettingLabel } = require('./controllers/payrollMasterSettingController')

const { createAllowances, getAllCreatedAllowances, updateAllowances, deleteAllowance, getSingleAllowancesDetails } = require('./controllers/allowanceController')

const { createDeductionsType, getAllCreatedDeductionTypes } = require('./controllers/deductionsController')

const { reschduleTransferFund } = require('./controllers/fundRequestController');

/**Admin API Controller and Method */
const { adminLogin, getAdminProfileDetails, updateAdminProfile, adminChangePassword } = require('./controllers/adminController');


const { createDealer, createDealerUser, getDealersAndUsers, getDealerAndUserSingleRecordByIdAndType, updateDealerDetails, deleteDealerAndUsers, getAllDealersAndUsersWithPendingAccountStatus, dealersAccountStatusAction } = require('./controllers/dealerController')

/** * user controller  */
const { createUser, login, getAllUsers, getUserById } = require('./controllers/userController');

/** Sub users Controller and method */
const { createSubUser, subUserLoggedIn, getSubUserProfileDetails, updateSubUserProfileDetails, subUserChangePassword } = require('./controllers/subUserController');

const { createOrder, updateOrder, getAllData, getOrderById, deleteOrderById, getAllOrderWithPagination } = require("./controllers/orderController");

const { contractorLogin, renewPlan, resetLogin } = require('./controllers/contractorLoginController');
const { getAllRequestedComplaints, getComplaintsDetailsById, getAllApprovedComplaints, getAllRejectedComplaints, getAllResolvedComplaints, getApprovedComplaintsDetailsById, approvedComplaints, getAllComplaints, getAllApprovedAssignComplaints, getAllApprovedUnAssignComplaints, reworkForResolvedComplaints, getOutletByIdNew, getRegionalByIdNew, getSaleByIdNew, getOrderByIdNew, reActiveToRejectedComplaints, getAreaManagerOfAssign, getSuperVisorOfAssign, getEndUsersOfAssign, holdAndTransferComplaints, allocateComplaintsToResolve, userToManagerArea, getManagerToComplaints, getRegionalOfficeToComplaints, assignedComplaintToUsers, getAllComplaintsExceptPending, getAllComplaintsById } = require('./controllers/contractorComplaintController');

/** Bank account Details */
const { addAccountDetails, getAllAccountsDetails, updateAccountDetails, deleteAccountDetails, accountDetailsbyId, getTransactionByUser, deleteTransactionDetails, transactionList, addAmountToBankAccount, getBankBalance, bankAccountNumbertoBalance, getBankToAccount, getBankTransactions, getBankTransactionsForStock, checklastBalanceOfWallets, checkLastBalanceOfEmployee, lastBalanceOfEmployeeInExpense, getUserExpenseTransaction, getUserWalletDetails } = require('./controllers/accountsController');

const { transferFundAmount, rescheduledTransferFund } = require('./controllers/transferFundController');

const { getALLmanagersWIthTeamMembers, getSuperVisorOnManagerId, getFreeEndUsersOnSuperVisorId } = require('./controllers/assignController');



const Router = express.Router()

/** * Super Admin Routes */
Router.post('/super-admin/login', superAdminLogin)
Router.get('/super-admin/profile', verifySuperAdminToken, getProfileDetails)
Router.post('/super-admin/profile-update', verifySuperAdminToken, updateProfile)
Router.post('/super-admin/change-password', verifySuperAdminToken, changePassword)
Router.post('/super-admin/create-energy-company', verifySuperAdminToken, permissionCheck, createEnergyCompany)
Router.get('/super-admin/all-sub-users', verifySuperAdminToken, getAllSubUserForSuperAdmin)
Router.get('/super-admin/get-all-pending-account-status-of-admins-and-users-details', verifySuperAdminToken, getAllSuperAdminAndUsersWithPendingAccountStatus)
Router.post('/super-admin/update-account-status-of-admins-and-users', verifySuperAdminToken, superAdminAccountStatusAction)
Router.get('/super-admin/roles', verifySuperAdminToken, getAllRoles);
Router.get('/super-admin/get-all-roles-for-dropdown', verifySuperAdminToken, getAllRolesForDropdown);
Router.post('/super-admin/create-role', verifySuperAdminToken, permissionCheck, createRole)
Router.get('/super-admin/edit-role/:id', editRole)
Router.post('/super-admin/update-role', verifySuperAdminToken, permissionCheck, updateRole)
Router.delete('/super-admin/delete-role/:id', verifySuperAdminToken, permissionCheck, deleteRole)
Router.post('/super-admin/create-zone', verifySuperAdminToken, permissionCheck, createZone)
Router.get('/super-admin/all-zone', verifySuperAdminToken, getAllZones)
Router.get('/super-admin/all-active-zone', verifySuperAdminToken, getAllActiveZones)
Router.get('/super-admin/edit-zone/:id', verifySuperAdminToken, editZone)
Router.post('/super-admin/update-zone', verifySuperAdminToken, permissionCheck, updateZone)
Router.delete('/super-admin/delete-zone/:id', verifySuperAdminToken, permissionCheck, deleteZone)
Router.get('/super-admin/get-energy-company-assign-zones/:id', verifySuperAdminToken, getEnergyCompanyAssignZones)
Router.post('/super-admin/create-regional-office', verifySuperAdminToken, permissionCheck, createRegionalOffice)
Router.get('/super-admin/all-regional-offices', verifySuperAdminToken, getAllRegionalOffices)
Router.get('/super-admin/get-regional-office/:id', verifySuperAdminToken, getRegionalOfficeById)
Router.get('/super-admin/active-regional-offices', verifySuperAdminToken, getActiveRegionalOffices)
Router.get('/super-admin/edit-regional-office/:id', verifySuperAdminToken, editRegionalOffice)
Router.post('/super-admin/update-regional-office', verifySuperAdminToken, permissionCheck, updateRegionalOffice)
Router.delete('/super-admin/delete-regional-office/:id', verifySuperAdminToken, permissionCheck, deleteRegionalOffice)
Router.get('/super-admin/get-all-regional-office-on-zone-id/:id', verifySuperAdminToken, getRegionalOfficesOnZoneId)
Router.post('/super-admin/add-sales-area', verifySuperAdminToken, permissionCheck, addSalesArea)
Router.get('/super-admin/sales-area', verifySuperAdminToken, getSalesArea)
Router.get('/super-admin/sales-area-by-id/:id', verifySuperAdminToken, getSalesAreaById);
Router.get('/super-admin/active-sales-area', verifySuperAdminToken, getActiveSalesArea);
Router.get('/super-admin/edit-sales-area/:id', verifySuperAdminToken, editSalesArea);
Router.post('/super-admin/update-sales-area', verifySuperAdminToken, permissionCheck, updateSalesArea)
Router.delete('/super-admin/delete-sales-area/:id', verifySuperAdminToken, permissionCheck, deleteSalesArea)
Router.get('/super-admin/get-all-sales-area-on-ro-id/:id', verifySuperAdminToken, getSaleAreaOnRoId)
Router.post('/super-admin/add-district', verifySuperAdminToken, permissionCheck, addDistrict)
Router.get('/super-admin/all-districts', verifySuperAdminToken, getDistricts)
Router.get('/super-admin/get-district/:id', verifySuperAdminToken, getDistrictById)
Router.get('/super-admin/active-districts', verifySuperAdminToken, getActiveDistricts)
Router.get('/super-admin/edit-district/:id', verifySuperAdminToken, editDistrictById)
Router.post('/super-admin/update-district', verifySuperAdminToken, permissionCheck, updateDistrictById)
Router.delete('/super-admin/delete-district/:id', verifySuperAdminToken, permissionCheck, removeDistrictById)
Router.get('/super-admin/get-all-district-on-sale-area-id/:id', verifySuperAdminToken, getAllDistrictBySaleAreaId)
Router.post('/super-admin/add-outlet', verifySuperAdminToken, permissionCheck, addOutlet)
Router.get('/super-admin/all-outlets', verifySuperAdminToken, getAllOutlet)
Router.get('/super-admin/get-outlet/:id', verifySuperAdminToken, getOutletById)
Router.get('/super-admin/edit-outlet/:id', verifySuperAdminToken, editOutlet)
Router.post('/super-admin/update-outlet', verifySuperAdminToken, permissionCheck, updateOutlet)
Router.delete('/super-admin/delete-outlet/:id', verifySuperAdminToken, permissionCheck, removeOutletById)
Router.get('/super-admin/get-outlet-by-district-id/:id', verifySuperAdminToken, getOutletByDistrictId)
Router.get('/super-admin/get-outlet-by-energy-company-id/:id', verifySuperAdminToken, getOutletByEnergyCompanyId)
Router.post('/super-admin/add-sale-company', verifySuperAdminToken, permissionCheck, addSaleCompany)
Router.get('/super-admin/all-sale-companies', verifySuperAdminToken, getSaleCompanies)
Router.get('/super-admin/get-sale-company/:id', verifySuperAdminToken, getSaleCompanyById)
Router.get('/super-admin/edit-sale-company/:id', verifySuperAdminToken, editSalesCompany)
Router.post('/super-admin/update-sale-company', verifySuperAdminToken, permissionCheck, updateSalesCompany)
Router.delete('/super-admin/delete-sale-company/:id', verifySuperAdminToken, permissionCheck, removeSalesCompanyById)
Router.post('/super-admin/create-company', verifySuperAdminToken, permissionCheck, createCompany)
Router.get('/super-admin/get-my-company-list', verifySuperAdminToken, getMyCompany)
Router.get('/super-admin-get-my-company-single-details/:id', verifySuperAdminToken, getMyCompanySingleDetailsById)
Router.post('/super-admin/update-my-company-details', verifySuperAdminToken, permissionCheck, updateMyCompanyDetails)
Router.delete('/super-admin/delete-my-company/:id', verifySuperAdminToken, permissionCheck, deleteMyCompany)
Router.get('/super-admin/get-company-types', verifySuperAdminToken, getCompanyTypes)
Router.get('/super-admin/get-all-companies', verifySuperAdminToken, getAllCompany)
Router.get('/super-admin/get-company-details-by-id/:id', verifySuperAdminToken, getCompanySingleDetailsById)
Router.post('/super-admin/update-all-company-details', verifySuperAdminToken, permissionCheck, updateCompanyDetails);
Router.get('/super-admin/get-all-company-details', verifySuperAdminToken, getAllCompanyForDropdown);
Router.get('/super-admin/get-company-details-by-company-id/:id', verifySuperAdminToken, getCompanyDetailsById);
Router.post('/super-admin/add-purchase-company', verifySuperAdminToken, permissionCheck, addPurchaseCompany)
Router.get('/super-admin/all-purchase-companies', verifySuperAdminToken, getPurchaseCompany)
Router.get('/super-admin/get-purchase-company/:id', verifySuperAdminToken, getPurchaseCompanyById)
Router.get('/super-admin/edit-purchase-company/:id', verifySuperAdminToken, editPurchaseCompany)
Router.post('/super-admin/update-purchase-company', verifySuperAdminToken, permissionCheck, updatePurchaseCompanyById)
Router.delete('/super-admin/delete-purchase-company/:id', verifySuperAdminToken, permissionCheck, deletePurchaseCompanyById)
Router.post('/super-admin/create-sub-user', verifySuperAdminToken, createSubUser)
Router.get('/super-admin/get-all-module/:role_id', verifySuperAdminToken, getAllModule)
Router.get('/super-admin/get-all-module', verifySuperAdminToken, getAllModule)
Router.get('/super-admin/get-all-sub-module', verifySuperAdminToken, getAllSubModule)
Router.get('/super-admin/get-sub-module-with-module-name', verifySuperAdminToken, getSubModuleWithModuleName)
Router.get('/super-admin/get-sub-module-by-module-id/:id', verifySuperAdminToken, getSubModuleByModuleId)
Router.post('/super-admin/set-permission-on-role-basis', verifySuperAdminToken, setPermissionOnRoleBasis)
Router.post('/super-admin/set-permission-on-role', verifySuperAdminToken, setPermissionOnRole)
Router.post('/super-admin/set-permission', verifySuperAdminToken, setPermission)

Router.post('/super-admin/create-complaint-type', verifySuperAdminToken, permissionCheck, addComplaintType)
Router.get('/super-admin/all-complaint-types', verifySuperAdminToken, getAllComplaintTypes)
Router.get('/super-admin/get-complaint-type/:id', verifySuperAdminToken, getComplaintTypeById)
Router.post('/super-admin/update-complaint-type', verifySuperAdminToken, permissionCheck, updateComplaintType)
Router.post('/super-admin/update-complaint-status', verifySuperAdminToken, updateComplaintStatus)
Router.post('/super-admin/create-complaint-sub-type', verifySuperAdminToken, permissionCheck, addComplaintSubType)
Router.get('/super-admin/get-all-complaints-sub-types', verifySuperAdminToken, getAllComplaintSubTypes)
Router.get('/super-admin/get-single-complaint-sub-type/:id', verifySuperAdminToken, getComplaintSubTypeById)
Router.post('/super-admin/update-complaint-sub-types-details', verifySuperAdminToken, permissionCheck, updateComplaintSubType)
Router.post('/super-admin/complaint-flitter', verifySuperAdminToken, complaintFlitter)
Router.post('/super-admin/complaint-assign', verifySuperAdminToken, complaintAssignTo)
Router.get('/super-admin/get-approvel-member-list', verifySuperAdminToken, getApprovelList)
Router.post('/super-admin/set-complaint-approval', verifySuperAdminToken, setComplaintApproval)
Router.get('/super-admin/not-approval-set-complaint', verifySuperAdminToken, notApprovalSetComplaint)
Router.post('/super-admin/assign-complaint-to-user', verifyContractorToken, assignedComplaintToUsers);


Router.post('/super-admin/create-team', verifySuperAdminToken, createTeam)
Router.get('/super-admin/get-parent-team-head', verifySuperAdminToken, getParentTeamHead)
Router.get('/super-admin/get-team-details/:id', verifySuperAdminToken, getTeamDetailsById)
Router.post('/super-admin/update-team-details', verifySuperAdminToken, updateTeamDetails)
Router.get('/super-admin/get-team-group', verifySuperAdminToken, getTeamGroup)
Router.get('/super-admin/pending-software-activation-request', verifySuperAdminToken, getAllPendingRequests)
Router.get('/super-admin/view-pending-request-details/:id', verifySuperAdminToken, viewSinglePendingRequestDetails)
Router.post('/super-admin/approved-software-activation-request/:id', verifySuperAdminToken, approvedSoftwareActivationRequest)
Router.post('/super-admin/rejected-software-activation-request/:id', verifySuperAdminToken, rejectedSoftwareActivationRequest)
Router.delete('/super-admin/delete-software-activation-request/:id', verifySuperAdminToken, deleteSoftwareActivationRequest)
Router.get('/super-admin/get-all-approved-software-activation-requests', verifySuperAdminToken, getAllApprovedRequests)
Router.get('/super-admin/get-all-rejected-software-activation-requests', verifySuperAdminToken, getAllRejectedRequests)
Router.get('/super-admin/feedback-and-suggestions', verifySuperAdminToken, getAllFeedbackAndSuggestions)
Router.get('/super-admin/get-all-energy-companies', verifySuperAdminToken, getEnergyCompanies)
Router.get('/super-admin/energy-companies-contacts-details/:id', verifySuperAdminToken, getEnergyCompaniesContacts)
Router.get('/super-admin/get-energy-company-zone-sub-users/:zone_id/:user_id', verifySuperAdminToken, getEnergyCompanyZoneSubUsers)
Router.get('/super-admin/get-energy-company-regional-office-sub-users/:regional_id/:user_id', verifySuperAdminToken, getEnergyCompanyRegionalOfficeSubUsers)
Router.get('/super-admin/get-energy-company-sale-area-sub-users/:sale_area_id/:user_id', verifySuperAdminToken, getEnergyCompanySaleAreaSubUsers)
Router.get('/super-admin/get-energy-company-user-details/:id', verifySuperAdminToken, getEnergyCompanyUserDetailsById)
Router.get('/super-admin/get-energy-company-sub-user-details/:id', verifySuperAdminToken, getEnergyCompanySubUserDetailById)
Router.get('/super-admin/get-energy-company-details/:id', verifySuperAdminToken, getEnergyCompanyDetailsById)
Router.post('/super-admin/update-energy-company-details', verifySuperAdminToken, permissionCheck, updateEnergyCompanyDetails)
Router.post('/super-admin/update-energy-company-user-details', verifySuperAdminToken, updateEnergyCompanyUserDetails)
Router.post('/super-admin/update-energy-company-sub-user-details', verifySuperAdminToken, updateEnergyCompanySubUserDetails)
Router.post('/super-admin/energy-company-delete/:id', verifySuperAdminToken, permissionCheck, deleteEnergyCompany)
Router.post('/super-admin/energy-company-delete-user/:id', verifySuperAdminToken, deleteEnergyCompanyUser)
Router.delete('/super-admin/energy-company-delete-sub-user/:id', verifySuperAdminToken, energyCompanyDeleteSubUser)
Router.get('/super-admin/get-active-energy-companies', verifySuperAdminToken, getAllActiveEnergyCompany)
Router.get('/super-admin/get-all-energy-company', verifySuperAdminToken, getAllCreatedEnergyCompany);
Router.get('/super-admin/get-all-energy-company-with-soft-delete', verifySuperAdminToken, getAllCreatedEnergyCompanyWithSoftDelete);
Router.get('/super-admin/get-all-pending-account-status-of-energy-company-and-users', verifySuperAdminToken, getAllEnergyCompanyAndUsersWithPendingAccountStatus)
Router.post('/super-admin/update-account-status-of-energy-company-and-users', verifySuperAdminToken, energyCompanyAccountStatusAction)
Router.get('/super-admin/get-energy-company-zones/:id', verifySuperAdminToken, getAllZoneByEnergyCompanyId)
Router.post('/super-admin/create-contractor', verifySuperAdminToken, contractorCreate)
Router.get('/super-admin/get-single-contractor-details/:id', verifySuperAdminToken, getContractorById)
Router.post('/super-admin/update-contractor-details', verifySuperAdminToken, permissionCheck, updateContractorDetailsById)
Router.post('/super-admin/create-contractor-users', verifySuperAdminToken, permissionCheck, createContractorUser)
Router.get('/super-admin/get-all-contractors-and-users', verifySuperAdminToken, getAllContractorAndUsers)
Router.get('/super-admin/get-contractors-and-users-details/:id/:type', verifySuperAdminToken, getContractorAndUsersFullDetailByIdAndType)
Router.delete('/super-admin/delete-contractors-and-users/:id/:type', verifySuperAdminToken, permissionCheck, deleteContractorAndUsers)
Router.get('/super-admin/get-all-pending-account-status-contractors-and-users', verifySuperAdminToken, getAllContractorAndUsersWithPendingAccountStatus)
Router.post('/super-admin/contractors-and-users-set-account-status', verifySuperAdminToken, contractorAccountStatusAction)
Router.post('/super-admin/create-dealer-account', verifySuperAdminToken, createDealer)
Router.post('/super-admin/create-dealer-users', verifySuperAdminToken, createDealerUser)
Router.get('/super-admin/get-all-dealers-and-users', verifySuperAdminToken, getDealersAndUsers)
Router.get('/super-admin/get-dealers-and-users-details/:id/:type', verifySuperAdminToken, getDealerAndUserSingleRecordByIdAndType)
Router.post('/super-admin/update-dealers-and-users-details', verifySuperAdminToken, updateDealerDetails)
Router.get('/super-admin/get-all-pending-account-status-of-dealers-and-users-details', verifySuperAdminToken, getAllDealersAndUsersWithPendingAccountStatus)
Router.post('/super-admin/update-account-status-of-dealers-and-users', verifySuperAdminToken, dealersAccountStatusAction)
Router.delete('/super-admin/delete-dealer-and-user/:id/:type', verifySuperAdminToken, deleteDealerAndUsers)
Router.post('/super-admin/create-tutorial', verifySuperAdminToken, createTutorial)
Router.get('/super-admin/get-all-tutorials', verifySuperAdminToken, getTutorials)
Router.get('/super-admin/get-single-tutorial-details/:format', verifySuperAdminToken, getTutorialByFormat)
Router.post('/super-admin/update-tutorial-details', verifySuperAdminToken, updateTutorials)
Router.delete('/super-admin/delete-tutorial/:id', verifySuperAdminToken, deleteTutorialsById)
Router.post('/super-admin/create-plan', verifySuperAdminToken, permissionCheck, createPlan)
Router.get('/super-admin/get-all-plans', verifySuperAdminToken, getAllPlans)
Router.get('/super-admin/get-plan-details/:id', verifySuperAdminToken, getPlanById)
Router.post('/super-admin/update-plan-details', verifySuperAdminToken, permissionCheck, updatePlanDetails)
Router.delete('/super-admin/delete-plan/:id', verifySuperAdminToken, permissionCheck, deletePlan)
Router.post('/super-admin/create-notifications', verifySuperAdminToken, createNotifications)
Router.get('/super-admin/get-all-notifications', verifySuperAdminToken, getNotifications)
Router.get('/super-admin/get-logged-user-notifications', verifySuperAdminToken, getLoggedUserNotifications)
Router.get('/super-admin/count-logged-user-unread-notifications', verifySuperAdminToken, countLoggedUserUnreadNotifications)
Router.post('/super-admin/mark-as-read-notifications', verifySuperAdminToken, markAsReadNotifications)
Router.post('/super-admin/create-item-master', verifySuperAdminToken, permissionCheck, createItemMaster);
Router.get('/super-admin/get-all-item-masters', verifySuperAdminToken, getAllItemMasters)
Router.get('/super-admin/get-item-master-details/:id', verifySuperAdminToken, getSingleItemMaster)
Router.post('/super-admin/update-item-master-details', verifySuperAdminToken, permissionCheck, updateItemMaster);
Router.delete('/super-admin/delete-item-master/:id', verifySuperAdminToken, permissionCheck, deleteItemMaster);
Router.post('/super-admin/create-purpose-master', verifySuperAdminToken, permissionCheck, createPurposeMaster);
Router.get('/super-admin/get-all-purpose-master', verifySuperAdminToken, getAllPurposeMaster)
Router.get('/super-admin/get-single-purpose-master/:id', verifySuperAdminToken, getSinglePurposeMasterById)
Router.post('/super-admin/update-purpose-master', verifySuperAdminToken, permissionCheck, updatePurposeMaster);
Router.delete('/super-admin/delete-purpose-master/:id', verifySuperAdminToken, permissionCheck, deletePurposeMasterById);
Router.post('/super-admin/create-survey', verifySuperAdminToken, permissionCheck, createSurvey)
Router.get('/super-admin/get-all-surveys', verifySuperAdminToken, getAllSurvey)
Router.get('/super-admin/get-survey-by-id/:id', verifySuperAdminToken, getSurveyById)
Router.get('/super-admin/edit-survey-details/:id', verifySuperAdminToken, editSurveyDetails)
Router.post('/super-admin/update-survey-details', verifySuperAdminToken, permissionCheck, updateSurveyDetails);
Router.post('/super-admin/delete-survey-details/:id', verifySuperAdminToken, deleteSurvey)
Router.get('/super-admin/get-assign-survey', verifySuperAdminToken, getAssignedSurvey)
Router.post('/super-admin/assign-survey', verifySuperAdminToken, assignToSurvey)
Router.post('/super-admin/changed-survey-status', verifySuperAdminToken, updateRequestedSurveyStatus)
Router.post('/super-admin/submit-survey-question-response', verifySuperAdminToken, surveyQuestionFormResponse);
Router.get('/super-admin/get-requested-survey', verifySuperAdminToken, getRequestedSurvey)
Router.get('/super-admin/get-all-survey-response', verifySuperAdminToken, getSurveyQuestionResponse)
Router.post('/super-admin/create-document-category', verifySuperAdminToken, createDocumentCategory)
Router.get('/super-admin/get-all-document-categories', verifySuperAdminToken, getAllDocumentCategory)
Router.get('/super-admin/get-document-category-details/:id', verifySuperAdminToken, getDocumentCategoryById)
Router.post('/super-admin/update-document-category-details', verifySuperAdminToken, updateDocumentCategory)
Router.delete('/super-admin/delete-document-category/:id', verifySuperAdminToken, removeDocumentCategoryById)
Router.post('/super-admin/add-documents', addDocuments);
Router.get('/super-admin/get-all-document', verifySuperAdminToken, getAllDocuments);
Router.get('/super-admin/view-document/:id', verifySuperAdminToken, viewDocuments);
Router.get('/super-admin/get-document-on-category-id/:id', verifySuperAdminToken, getDocumentOnCategoryById);
Router.delete('/super-admin/delete-document/:id', verifySuperAdminToken, removeDocumentById);
Router.post('/super-admin/update-document', updateDocuments);
Router.post('/super-admin/create-task', verifySuperAdminToken, createTask)
Router.get('/super-admin/get-task-lists', verifySuperAdminToken, getAllTaskList)
Router.get('/super-admin/get-task-single-list/:id', verifySuperAdminToken, getTaskById)
Router.post('/super-admin/update-task-list', verifySuperAdminToken, updateTaskDetails)
Router.delete('/super-admin/delete-task/:id', verifySuperAdminToken, deleteTask)
Router.get('/super-admin/get-task-status-for-dashboard', verifySuperAdminToken, taskDashboard)
Router.post('/super-admin/update-main-task-status', verifySuperAdminToken, updateMainTaskStatus)
Router.get('/super-admin/get-all-task-by-status', verifySuperAdminToken, getAllTaskByStatus)
Router.post('/super-admin/create-task-category', verifySuperAdminToken, createTaskCategory)
Router.get('/super-admin/get-all-task-category', verifySuperAdminToken, getAllTaskCategory)
Router.get('/super-admin/get-single-task-category/:id', verifySuperAdminToken, getSingleTaskCategory)
Router.post('/super-admin/update-task-category', verifySuperAdminToken, updateTaskCategoryDetails)
Router.delete('/super-admin/delete-task-category/:id', verifySuperAdminToken, removeTaskCategoryById)
Router.post('/super-admin/add-task-comment', verifySuperAdminToken, createTaskComment)
Router.post('/super-admin/update-task-comment', verifySuperAdminToken, updateTaskComment)
Router.get('/super-admin/get-task-comment-details/:id', verifySuperAdminToken, getTaskCommentDetailsById)
Router.get('/super-admin/all-apply-leave', verifySuperAdminToken, getAllLeaveApplications)

//HR management
Router.post('/super-admin/create-hr-team', verifySuperAdminToken, permissionCheck, createHrTeam)
Router.get('/super-admin/get-all-hr-teams', verifySuperAdminToken, getAllHrTeamWithMember)
Router.get('/super-admin/get-single-hr-team-detail/:id', verifySuperAdminToken, getHrTeamDetailsById)
Router.post('/super-admin/update-hr-team-details', verifySuperAdminToken, permissionCheck, updateHrTeamDetails)
Router.delete('/super-admin/delete-hr-team/:team_id', verifySuperAdminToken, permissionCheck, deleteHrTeam)
Router.post('/super-admin/remove-specific-user-from-team', verifySuperAdminToken, removeSpecificUserFromTeam)
Router.post('/super-admin/add-specific-user-to-team', verifySuperAdminToken, addNewMemberInTeam)
Router.get('/super-admin/get-users-list-to-add-in-team/:team_id', verifySuperAdminToken, getMemberListToAddInTeam)
Router.get('/super-admin/get-users-list-without-team', verifySuperAdminToken, getMemberListWithoutTeam);

//break hr

Router.post('/super-admin/create-break', verifySuperAdminToken, createBreaks)
Router.get('/super-admin/get-all-breaks', verifySuperAdminToken, getAllBreaks)
Router.get('/super-admin/get-single-break-details/:id', verifySuperAdminToken, getBreakOnId)
Router.post('/super-admin/update-break', verifySuperAdminToken, updateBreaks)
Router.delete('/super-admin/delete-breaks/:id', verifySuperAdminToken, deleteBreak)


//HR management attendance management
Router.post('/super-admin/clock-in', verifySuperAdminToken, clockIn)
Router.post('/super-admin/clock-out', verifySuperAdminToken, clockOut)
Router.get('/super-admin/check-full-month-clock-in', verifySuperAdminToken, checkClockInToday)
Router.post('/super-admin/mark-break', verifySuperAdminToken, startBreak)
Router.post('/super-admin/break-end', verifySuperAdminToken, endBreak)

Router.get('/super-admin/get-all-employees', verifySuperAdminToken, getAllStoredEmployeeDetails)
Router.get('/super-admin/get-single-employee-detail/:id', verifySuperAdminToken, getSingleEmployeeDetailById)
Router.post('/super-admin/update-single-employee-detail', verifySuperAdminToken, updateEmployeeDetails)
Router.delete('/super-admin/delete-employee/:id', verifySuperAdminToken, permissionCheck, deleteEmployee);
Router.get('/super-admin/get-employee-assign-tasks', verifySuperAdminToken, getEmployeeTaskById)

Router.get('/super-admin/get-user-time-sheet/:id', verifySuperAdminToken, timeSheet)
Router.get('/super-admin/get-all-users-time-sheet-for-admin', verifySuperAdminToken, getTimeSheetOfAllUserForSuperAdmin);
Router.post('/super-admin/mark-manual-attendance', verifySuperAdminToken, markAttendance);
Router.get('/super-admin/get-all-users-attendance-in-calendar-view', verifySuperAdminToken, getAllUserTimeSheetInCalendarView);
Router.get('/super-admin/get-single-user-attendance-in-calendar-view/:id', verifySuperAdminToken, getSingleUserAttendanceTimeSheetInCalendarView);
Router.get('/super-admin/get-user-attendance-in-chart/:id', verifySuperAdminToken, getAttendanceChartById)
Router.get('/super-admin/get-today-mark-login-and-break', verifySuperAdminToken, checkTodayMarkBreakAndAttendance)
Router.get('/super-admin/get-total-month-work-hours', verifySuperAdminToken, getMonthsTotalWorkHour)
Router.get('/super-admin/get-all-user-time-sheet', verifySuperAdminToken, checkTotalUsersTimeSheet)
Router.get('/super-admin/get-all-user-today-clock-in', verifySuperAdminToken, getAllUsersTodayClockIn)
Router.get('/super-admin/get-all-user-today-clock-out', verifySuperAdminToken, getAllUsersTodayClockOut)
Router.post('/super-admin/change-user-attendance-status-by-super-admin', verifySuperAdminToken, markUserClockInClockOutBySuperAdmin)
Router.post('/super-admin/mark-manually-attendance-for-user', verifySuperAdminToken, permissionCheck, createManuallyClockInClockOut)
Router.get('/super-admin/get-login-credentials/:id', verifySuperAdminToken, getEmployeeLoginDetailsById)
Router.post('/super-admin/send-login-credentials-via-email', verifySuperAdminToken, sendLoginCredentialsViaEmail)
Router.get('/super-admin/send-login-credentials-via-whatsapp/:id', verifySuperAdminToken, sendLoginCredentialsViaWhatsApp)
Router.post('/super-admin/update-user-status', verifySuperAdminToken, changeUserStatus)
Router.get('/super-admin/get-user-status-timeline/:id', verifySuperAdminToken, userStatusTimeLine)
Router.get('/super-admin/get-users-by-role/:id', verifySuperAdminToken, getUsersByRoleId)
Router.get('/super-admin/get-admins-by-role/:id', verifySuperAdminToken, getAdminsByRoleId)
Router.get('/super-admin/get-users-by-admin-id/:id', verifySuperAdminToken, getUsersByAdminId)
Router.get('/super-admin/get-all-users', verifySuperAdminToken, getAllUsers)
Router.get('/super-admin/get-user-by-id/:id', verifySuperAdminToken, getUserById)


Router.post('/super-admin/create-leave-type', verifySuperAdminToken, permissionCheck, createLeaveType)
Router.get('/super-admin/get-all-leave-type', verifySuperAdminToken, getAllLeaveType)
Router.get('/super-admin/get-active-leave-type', verifySuperAdminToken, getAllActiveLeaveType)
Router.get('/super-admin/get-leave-type-by-id/:id', verifySuperAdminToken, getAllLeaveTypeById)
Router.post('/super-admin/update-leave-type-details', verifySuperAdminToken, permissionCheck, updateLeaveType)
Router.delete('/super-admin/delete-leave-type/:id', verifySuperAdminToken, permissionCheck, deleteLeaveType)
Router.post('/super-admin/apply-leave', verifySuperAdminToken, permissionCheck, applyLeave);

Router.post('/super-admin/create-group-insurance', verifySuperAdminToken, permissionCheck, createGroupInsurance)
Router.get('/super-admin/get-group-insurance-list', verifySuperAdminToken, getAllGroupInsurance)
Router.get('/super-admin/get-group-insurance-single-details/:id', verifySuperAdminToken, getSingleGroupInsuranceDetails)
Router.post('/super-admin/update-group-insurance-details', verifySuperAdminToken, permissionCheck, updateGroupInsuranceDetails)
Router.delete('/super-admin/delete-group-insurance-details/:id', verifySuperAdminToken, permissionCheck, deleteGroupInsurance)

Router.post('/super-admin/register-insurance-company', verifySuperAdminToken, registerInsuranceCompany)
Router.get('/super-admin/get-insurance-company-list', verifySuperAdminToken, getAllInsuranceCompanyList)
Router.get('/super-admin/get-insurance-company-single-details/:id', verifySuperAdminToken, getSingleInsuranceCompanyDetails)
Router.post('/super-admin/update-insurance-company-details', verifySuperAdminToken, updateInsuranceCompanyDetails)
Router.post('/super-admin/delete-insurance-company/:id', verifySuperAdminToken, deleteInsuranceCompanyById)

Router.post('/super-admin/register-insurance-company-plans', verifySuperAdminToken, registerInsuranceCompanyPlan)
Router.get('/super-admin/get-all-insurance-plan-list', verifySuperAdminToken, getAllInsurancePlans)
Router.get('/super-admin/get-single-insurance-plan-details/:id', verifySuperAdminToken, getInsurancePlanById)
Router.post('/super-admin/update-insurance-plan-details', verifySuperAdminToken, updateInsurancePlanDetails)
Router.post('/super-admin/delete-insurance-plan-details/:id', verifySuperAdminToken, deleteInsurancePlanById)
Router.get('/super-admin/get-plans-of-insurance-company/:id', verifySuperAdminToken, getInsuranceCompanyWithPlansById)

Router.post('/super-admin/employee-promotion-demotion-add', verifySuperAdminToken, permissionCheck, employeeAddAction)
Router.get('/super-admin/employee-promotion-demotion-get-all-list', verifySuperAdminToken, getAllEmployeePromotionDemotion)
Router.get('/super-admin/single-employee-promotion-demotion-details/:id', verifySuperAdminToken, getAllEmployeePromotionDemotionById)
Router.post('/super-admin/update-employee-promotion-demotion-details', verifySuperAdminToken, permissionCheck, updateEmployeePromotionDemotionDetails)

Router.get('/super-admin/get-resignations-pending-request', verifySuperAdminToken, getPendingResignationRequests)
Router.get('/super-admin/get-resignations-approved-list', verifySuperAdminToken, getApprovedResignationRequests)
Router.get('/super-admin/get-resignations-rejected-list', verifySuperAdminToken, getRejectedResignationRequests)
Router.get('/super-admin/get-single-resignation-details/:id', verifySuperAdminToken, getResignationDetailsById)
Router.post('/super-admin/update-resignations-details', verifySuperAdminToken, updateResignationDetails)
Router.post('/super-admin/viewed-resignations-request/:id', verifySuperAdminToken, resignationRequestViewed)
Router.post('/super-admin/update-resignations-request-by-admin/:id/:status', verifySuperAdminToken, resignationStatusUpdateByAdmin)
Router.post('/super-admin/generate-fnf-statements', verifySuperAdminToken, generateFnFStatement)
Router.get('/super-admin/get-fnf-statements', verifySuperAdminToken, getFnfStatement)

Router.post('/super-admin/register-employee-pension', verifySuperAdminToken, permissionCheck, registerPensionForEmployee)
Router.get('/super-admin/get-all-registered-pension-list', verifySuperAdminToken, getAllRegisteredPension)
Router.get('/super-admin/get-single-registered-pension-details/:id', verifySuperAdminToken, getRegisteredPensionById)
Router.post('/super-admin/update-registered-pension', verifySuperAdminToken, permissionCheck, updatePensionDetails)
Router.delete('/super-admin/delete-register-employee-pension/:id', verifySuperAdminToken, permissionCheck, deletePensionById)

Router.post('/super-admin/leave-application-status-update', verifySuperAdminToken, updateLeaveApplication)
Router.get('/super-admin/get-single-leave-application-details/:id', verifySuperAdminToken, getSingleLeaveApplication)
Router.post('/super-admin/delete-leave-application-details/:id', verifySuperAdminToken, leaveApplicationSoftDelete)
Router.post('/super-admin/create-user', verifySuperAdminToken, permissionCheck, createUsers);
Router.post('/super-admin/update-user', verifySuperAdminToken, permissionCheck, updateUsers);
Router.get('/super-admin/get-all-managers-users', verifySuperAdminToken, getAllManagerUsers);
Router.get('/super-admin/get-employee-documents/:id', verifySuperAdminToken, getEmployeeDocumentsById);
Router.post('/super-admin/create-terms-and-conditions', verifySuperAdminToken, createTermsAndConditions);
Router.get('/super-admin/get-all-created-terms-and-conditions', verifySuperAdminToken, getAllCreateTermsAndConditions);
Router.get('/super-admin/get-single-created-terms-and-conditions-details/:id', verifySuperAdminToken, getCreateTermsAndConditionsDetailsById);
Router.post('/super-admin/update-terms-and-conditions-details', verifySuperAdminToken, updateTermsConditionsDetails)
Router.delete('/super-admin/delete-terms-and-conditions-details/:id', verifySuperAdminToken, deleteTermsAndConditions)
Router.get('/super-admin/get-all-activity-logs', verifySuperAdminToken, getAllActivityLog)
Router.get('/super-admin/get-single-activity-logs/:id', verifySuperAdminToken, getActivityLogDetails)
Router.get('/super-admin/get-employee-history-details/:id', verifySuperAdminToken, trackEmployeeHistory)
Router.get('/super-admin/check-related-data-for-energy-company/:energy_company_id', verifySuperAdminToken, checkRelatedDataForEnergyCompany)
Router.post('/super-admin/delete-related-data-for-energy-company/', verifySuperAdminToken, permissionCheck,
    deleteRelatedDataForEnergyCompany);
Router.get('/super-admin/get-area-data-for-energy/:energy_company_id/:type', verifySuperAdminToken, getEnergyCompanySubSidiaries);


//Payroll masters
Router.post('/super-admin/create-new-payroll-settings', verifySuperAdminToken, permissionCheck, addPayrollMasterSettingLabel)
Router.post('/super-admin/update-payroll-master-settings', verifySuperAdminToken, permissionCheck, updatePayrollSettings)
Router.post('/super-admin/update-payroll-master-settings-label', verifySuperAdminToken, permissionCheck, updatePayrollSettingLabel)

Router.post('/super-admin/create-allowances', verifySuperAdminToken, permissionCheck, createAllowances);
Router.get('/super-admin/get-all-allowances', verifySuperAdminToken, getAllCreatedAllowances)
Router.get('/super-admin/get-single-allowance-details/:id', verifySuperAdminToken, getSingleAllowancesDetails)

Router.post('/super-admin/create-deductions', verifySuperAdminToken, permissionCheck, createDeductionsType);
Router.get('/super-admin/get-all-deductions', verifySuperAdminToken, getAllCreatedDeductionTypes);

//salary modules

Router.post('/super-admin/add-salary-details', verifySuperAdminToken, addDetailsSalary);
Router.get('/super-admin/get-all-users-salary-details', verifySuperAdminToken, getAllCreatedSalaryDetails);
Router.get('/super-admin/get-salary-details/:id', verifySuperAdminToken, getCreatedSalaryDetailsById);
Router.post('/super-admin/update-salary-details', verifySuperAdminToken, updateSalaryDetails);
Router.post('/super-admin/delete-salary-details/:id', verifySuperAdminToken, deleteSalaryDetails);
Router.get('/super-admin/get-salary-disbursal', verifySuperAdminToken, getAllUserSalaryForDisbursal);
Router.get('/super-admin/get-salary-disbursal-details', verifySuperAdminToken, getUserSalaryDisbursalDetailsById);
Router.post('/super-admin/mark-salary-disbursed', verifySuperAdminToken, markSalaryDisbursed);
Router.get('/super-admin/get-users-pay-slip', verifySuperAdminToken, getUsersPaySlip);
Router.get('/super-admin/get-user-pay-slip-details', verifySuperAdminToken, getUserPayslipDetailsById);

//loans modules

Router.post('/super-admin/create-loans', verifySuperAdminToken, permissionCheck, createLoan);
Router.get('/super-admin/get-all-loans-pending', verifySuperAdminToken, getAllLoanRequests);
Router.get('/super-admin/get-all-loans-active', verifySuperAdminToken, getAllActiveLoan)
Router.get('/super-admin/get-all-loans-reject', verifySuperAdminToken, getAllRejectedLoan)
Router.get('/super-admin/get-all-loans-closed', verifySuperAdminToken, getAllClosedLoan)
Router.get('/super-admin/get-loan-details/:id', verifySuperAdminToken, getLoanDetailById)
Router.post('/super-admin/update-loan-details', verifySuperAdminToken, permissionCheck, updateLoanDetails)
Router.post('/super-admin/changed-loan-status', verifySuperAdminToken, updateLoanStatus)
Router.post('/super-admin/delete-loan-details/:id', verifySuperAdminToken, deleteLoanDetailById)

//messages

Router.post('/super-admin/send-messages', verifySuperAdminToken, sendMessage);
Router.get('/super-admin/get-messages', verifySuperAdminToken, getMessages);
Router.get('/super-admin/get-single-sender-messages/:id', verifySuperAdminToken, getSenderAllMessages);
Router.get('/super-admin/add-new-user-to-chat', verifySuperAdminToken, addNewUserToChat);
Router.post('/super-admin/start-chat-to-new-user/:id', verifySuperAdminToken, startChatWIthNewUser);
Router.get('/super-admin/get-total-unread-messages', verifySuperAdminToken, getTotalUnreadMessages);
Router.post('/super-admin/mark-all-messages-read', verifySuperAdminToken, markAllMessagesRead);
Router.post('/super-admin/sender-messages-mark-read/:id', verifySuperAdminToken, markReadSenderAllMessages);

Router.post('/super-admin/import-data', verifySuperAdminToken, importData);
Router.post('/super-admin/import-user-data/:id', verifySuperAdminToken, importUserData);

Router.get('/super-admin/get-officers-list-on-ro/:id', verifySuperAdminToken, getRegionalOfficersOnRo);

Router.post('/super-admin/create-zone-user', verifySuperAdminToken, createEnergyCompanyUser);

/*** Admins Route */

Router.post('/admin/login-admin', adminLogin)
Router.get('/admin/get-profile-details', verifyEnergyCompanyToken, getAdminProfileDetails)
Router.post('/admin/update-admin-profile-details', verifyEnergyCompanyToken, updateAdminProfile)
Router.post('/admin/admin-change-password', verifyEnergyCompanyToken, adminChangePassword)
Router.post('/energy-company/create-zone-user', verifyEnergyCompanyToken, createEnergyCompanyUser)
Router.post('/energy-company/create-sub_user-for-energy-company-zone-user', verifyEnergyCompanyToken, createSubUsersForEnergyCompanyZoneUser)
Router.post('/energy-company/create-sub_user-for-energy-company-regional-user', verifyEnergyCompanyToken, createSubUsersForEnergyCompanyRegionalOfficeUser)
Router.post('/energy-company/create-sub_user-for-energy-company-sale-area-user', verifyEnergyCompanyToken, createSubUsersForEnergyCompanySaleAreaUser)

/** * Sub User Routes */
Router.post('/sub-user/login', subUserLoggedIn)
Router.get('/sub-user/profile-details', verifySubUserToken, getSubUserProfileDetails)
Router.post('/sub-user/profile-update', verifySubUserToken, updateSubUserProfileDetails)
Router.post('/sub-user/changed-password', verifySubUserToken, subUserChangePassword)
Router.get('/super-admin/get-permissions-on-role-basis', verifySuperAdminToken, checkPermittedModuleOnRoleBasis)
Router.get('/sub-user/get-permitted-module-name-on-role-basis', verifySubUserToken, getAllPermittedModuleNameOnRoleBasis)
Router.post('/sub-user/update-permissions-on-role-basis', verifySubUserToken, updatePermissionOnRoleBasis)

//HR management
Router.post('/sub-user/mark-attendance', verifySubUserToken, clockIn)
Router.post('/sub-user/clock-out', verifySubUserToken, clockOut)
Router.get('/sub-user/check-today-clock-in', verifySubUserToken, checkClockInToday)
Router.post('/sub-user/mark-break', verifySubUserToken, startBreak)
Router.post('/sub-user/break-end', verifySubUserToken, endBreak)
Router.get('/sub-user/get-user-time-sheet', verifySubUserToken, timeSheet)
Router.post('/sub-user/apply-leave', verifySuperAdminToken, applyLeave)
Router.get('/sub-user/all-apply-leave', verifySubUserToken, getAllLeaveApplications)
Router.post('/sub-user/register-employee-resignation', verifyContractorToken, registerResignation)


Router.post('/super-admin/all-new-complains', verifySuperAdminToken, allNewComplaints)
Router.post('/super-admin/all-pending-complains', verifySuperAdminToken, allPendingComplaints)
Router.post('/super-admin/all-approved-complains', verifySuperAdminToken, allApprovedComplaints)
Router.post('/super-admin/all-rejected-complains', verifySuperAdminToken, allRejectedComplaints)
Router.post('/super-admin/all-resolved-complains', verifySuperAdminToken, allResolvedComplaints)

Router.post('/super-admin/surveys-otp-send', verifySuperAdminToken, otpSendSurvey)
Router.post('/super-admin/surveys-otp-verify', verifySuperAdminToken, VerifyOtpSurvey)
Router.get('/super-admin/get-survey-response/:id', verifySuperAdminToken, getSurveyResponseById);


// -------------------------------- order via routes --------------------------
Router.post('/super-admin/create-order', verifySuperAdminToken, permissionCheck, createOrder);
Router.post('/super-admin/update-order', verifySuperAdminToken, permissionCheck, updateOrder);
Router.get('/super-admin/get-all-order', verifySuperAdminToken, getAllData);
Router.get('/super-admin/get-order-by-id/:id', verifySuperAdminToken, getOrderById);
Router.delete('/super-admin/delete-order/:id', verifySuperAdminToken, permissionCheck, deleteOrderById);
Router.get('/super-admin/get-all-order-pagination', verifySuperAdminToken, getAllOrderWithPagination);

Router.get('/super-admin/get-complaints-details/:id', verifySuperAdminToken, getComplaintsDetailsById);
Router.get('/super-admin/get-approved-complaints-details/:id', verifySuperAdminToken, getApprovedComplaintsDetailsById)
Router.get('/super-admin/get-all-manager-list-with-total-free-end-users', verifySuperAdminToken, getALLmanagersWIthTeamMembers)
Router.get('/super-admin/get-all-supervisor-by-manager-with-count-free-end-users/:id', verifySuperAdminToken, getSuperVisorOnManagerId);
Router.get('/super-admin/get-all-end-users-by-supervisor/:id', verifySuperAdminToken, getFreeEndUsersOnSuperVisorId);
//------------------------------ Contractor Panel Routing ------------------------

Router.post('/super-admin/mark-as-resolved', verifySuperAdminToken, markAsResolvedComplaints)


Router.post('/contractor/login', contractorLogin)
Router.post('/contractor/reset-login', resetLogin)
Router.get('/contractor/get-sidebar', getContractorSidebarTest)
Router.post('/contractor/renew-plan', verifyContractorToken, renewPlan)
Router.post('/contractor/create-company', verifyContractorToken, createCompany)
Router.get('/contractor/get-my-company-list', verifyContractorToken, getMyCompany)
Router.get('/contractor-get-my-company-single-details/:id', verifyContractorToken, getMyCompanySingleDetailsById)
Router.post('/contractor/update-my-company-details', verifyContractorToken, updateMyCompanyDetails)
Router.post('/contractor/delete-my-company/:id', verifyContractorToken, deleteMyCompany)
Router.get('/contractor/get-company-types', verifyContractorToken, getCompanyTypes)
Router.get('/contractor/get-all-companies', verifyContractorToken, getAllCompany)
Router.get('/contractor/get-company-details-by-id/:id', verifyContractorToken, getCompanySingleDetailsById)
Router.post('/contractor/update-all-company-details', verifyContractorToken, updateCompanyDetails)
Router.post('/contractor/add-purchase-company', verifyContractorToken, addPurchaseCompany)
Router.get('/contractor/all-purchase-companies', verifyContractorToken, getPurchaseCompany)
Router.get('/contractor/get-purchase-company/:id', verifyContractorToken, getPurchaseCompanyById)
Router.get('/contractor/edit-purchase-company/:id', verifyContractorToken, editPurchaseCompany)
Router.post('/contractor/update-purchase-company', verifyContractorToken, updatePurchaseCompanyById)
Router.delete('/contractor/delete-purchase-company/:id', verifyContractorToken, deletePurchaseCompanyById)

Router.post('/contractor/add-sale-company', verifyContractorToken, addSaleCompany);
Router.get('/contractor/all-sale-companies', verifyContractorToken, getSaleCompanies);
Router.get('/contractor/get-sale-company/:id', verifyContractorToken, getSaleCompanyById);
Router.get('/contractor/edit-sale-company/:id', verifyContractorToken, editSalesCompany);
Router.post('/contractor/update-sale-company', verifyContractorToken, updateSalesCompany);
Router.delete('/contractor/delete-sale-company/:id', verifyContractorToken, removeSalesCompanyById);
Router.get('/contractor/get-all-energy-company', verifyContractorToken, getAllCreatedEnergyCompany);
Router.post('/contractor/update-user-status', verifyContractorToken, changeUserStatus)

/** * Contractor Survey routes */
Router.post('/contractor/create-survey', verifyContractorToken, createSurvey)
Router.get('/contractor/get-all-surveys', verifyContractorToken, getAllSurvey)
Router.get('/contractor/get-survey-by-id/:id', verifyContractorToken, getSurveyById)
Router.get('/contractor/edit-survey-details/:id', verifyContractorToken, editSurveyDetails)
Router.post('/contractor/update-survey-details', verifyContractorToken, updateSurveyDetails)
Router.post('/contractor/delete-survey-details/:id', verifyContractorToken, deleteSurvey)
Router.get('/contractor/get-assign-survey', verifyContractorToken, getAssignedSurvey)
Router.post('/contractor/assign-survey', verifyContractorToken, assignToSurvey)
Router.post('/contractor/changed-survey-status', verifyContractorToken, updateRequestedSurveyStatus)
Router.post('/contractor/submit-survey-question-response', verifyContractorToken, surveyQuestionFormResponse)
Router.get('/contractor/get-requested-survey', verifyContractorToken, getRequestedSurvey)
Router.get('/contractor/get-all-survey-response', verifyContractorToken, getSurveyQuestionResponse)
Router.post('/contractor/surveys-otp-send', verifyContractorToken, otpSendSurvey)
Router.post('/contractor/surveys-otp-verify', verifyContractorToken, VerifyOtpSurvey)
Router.get('/contractor/get-survey-response/:id', verifyContractorToken, getSurveyResponseById)
Router.get('/contractor/get-all-purpose-master', verifyContractorToken, getAllPurposeMaster)

// --------- complaint modules --------------------
Router.post('/contractor/complaint-assign', complaintAssignTo);
Router.post('/contractor/create-complaint-type', verifyContractorToken, addComplaintType);
Router.get('/contractor/get-requested-complaints', verifyContractorToken, getAllRequestedComplaints);
Router.get('/contractor/get-complaints-details/:id', verifyContractorToken, getComplaintsDetailsById);
Router.get('/contractor/get-approved-complaints', verifyContractorToken, getAllApprovedComplaints);
Router.get('/contractor/get-rejected-complaints', verifyContractorToken, getAllRejectedComplaints);
Router.get('/contractor/get-all-resolved-complaints', verifyContractorToken, getAllResolvedComplaints);
Router.get('/contractor/get-all-complaints', verifyContractorToken, getAllComplaints)
Router.get('/contractor/get-all-approved-assign-complaints', verifyContractorToken, getAllApprovedAssignComplaints)
Router.get('/contractor/get-all-approved-un-assign-complaints', verifyContractorToken, getAllApprovedUnAssignComplaints)
Router.post('/contractor/re-work-for-resolved-complaints', verifyContractorToken, reworkForResolvedComplaints)
Router.get('/contractor/get-all-outlet-by-id-new', verifyContractorToken, getOutletByIdNew)
Router.get('/contractor/get-all-regional-by-id-new', verifyContractorToken, getRegionalByIdNew)
Router.get('/contractor/get-all-sales-by-id-new', verifyContractorToken, getSaleByIdNew)
Router.get('/contractor/get-all-order-by-id-new', verifyContractorToken, getOrderByIdNew)
Router.post('/contractor/reactive-complaints-status-update/:id', verifyContractorToken, reActiveToRejectedComplaints)
Router.get('/contractor/get-area-manager-assign', verifyContractorToken, getAreaManagerOfAssign)
Router.get('/contractor/get-supervisor-assign', verifyContractorToken, getSuperVisorOfAssign)
Router.get('/contractor/get-end-user-assign', verifyContractorToken, getEndUsersOfAssign)
Router.post('/contractor/mark-as-resolved-complaints', verifyContractorToken, markAsResolvedComplaints)
Router.post('/contractor/hold-and-transfer-complaints', verifyContractorToken, holdAndTransferComplaints)
Router.post('/contractor/update-allocate-complaints', verifyContractorToken, allocateComplaintsToResolve)
Router.get('/contractor/get-user-to-supervisor-or-manager/:id', verifyContractorToken, userToManagerArea)
Router.get('/contractor/get-area-manager-to-complaints/:id', verifyContractorToken, getManagerToComplaints)
Router.get('/contractor/get-regional-office-to-complaints/:id', verifyContractorToken, getRegionalOfficeToComplaints)
Router.get('/contractor/get-all-complaints-expect-pending-status', verifyContractorToken, getAllComplaintsExceptPending)
Router.get('/contractor/get-all-complaints-by-id/:id', verifyContractorToken, getAllComplaintsById)


Router.get('/contractor/get-approved-complaints-details/:id', verifyContractorToken, getApprovedComplaintsDetailsById)
Router.post('/contractor/approved-complaints', verifyContractorToken, approvedComplaints);
Router.get('/contractor/get-complaints/:id', verifyContractorToken, getComplaintsById);
Router.post('/contractor/update-complaint-type', verifyContractorToken, updateComplaintType)
Router.post('/contractor/update-complaint-status', verifyContractorToken, updateComplaintStatus);

Router.post('/contractor/create-user', verifyContractorToken, createUsers)
Router.post('/contractor/update-user', verifyContractorToken, updateUsers)
Router.get('/contractor/get-all-employees', verifyContractorToken, getAllStoredEmployeeDetails)
Router.get('/contractor/get-single-employee-detail/:id', verifyContractorToken, getSingleEmployeeDetailById)
Router.post('/contractor/update-single-employee-detail', verifyContractorToken, updateEmployeeDetails)
Router.post('/contractor/delete-employee/:id', verifyContractorToken, deleteEmployee)
Router.get('/contractor/get-employee-assign-tasks', verifyContractorToken, getEmployeeTaskById)

Router.post('/contractor/create-hr-team', verifyContractorToken, createHrTeam)
Router.get('/contractor/get-all-hr-teams', verifyContractorToken, getAllHrTeamWithMember)
Router.get('/contractor/get-single-hr-team-detail/:id', verifyContractorToken, getHrTeamDetailsById)
Router.post('/contractor/update-hr-team-details', verifyContractorToken, updateHrTeamDetails)
Router.delete('/contractor/delete-hr-team/:team_id', verifyContractorToken, deleteHrTeam)
Router.get('/contractor/get-user-time-sheet/:id', verifyContractorToken, timeSheet)
Router.get('/contractor/get-today-mark-login-and-break', verifyContractorToken, checkTodayMarkBreakAndAttendance)
Router.get('/contractor/get-all-user-time-sheet', verifyContractorToken, checkTotalUsersTimeSheet)
Router.get('/contractor/get-all-user-time-sheet-new', verifyContractorToken, checkTotalUsersTimeSheetNew) // for testing purpose

Router.post('/contractor/mark-manual-attendance', verifyContractorToken, markAttendance);
Router.get('/contractor/get-all-users-attendance-in-calendar-view', verifyContractorToken, getAllUserTimeSheetInCalendarView);
Router.get('/contractor/get-single-user-attendance-in-calendar-view/:id', verifyContractorToken, getSingleUserAttendanceTimeSheetInCalendarView);
Router.post('/contractor/mark-manually-attendance-for-user', verifyContractorToken, createManuallyClockInClockOut);
Router.get('/contractor/get-all-user-today-clock-in', verifyContractorToken, getAllUsersTodayClockIn);
Router.get('/contractor/get-all-user-today-clock-out', verifyContractorToken, getAllUsersTodayClockOut);
Router.post('/contractor/change-user-attendance-status-by-super-admin', verifyContractorToken, markUserClockInClockOutBySuperAdmin);
Router.get('/contractor/get-user-by-id/:id', verifyContractorToken, getUserById);
Router.get('/contractor/get-users-list-to-add-in-team/:team_id', verifyContractorToken, getMemberListToAddInTeam);
Router.post('/contractor/add-specific-user-to-team', verifyContractorToken, addNewMemberInTeam);
Router.post('/contractor/remove-specific-user-from-team', verifyContractorToken, removeSpecificUserFromTeam);
Router.get('/contractor/get-logged-user-details-and-type', verifyContractorToken, getLoggedUserDetails);
Router.get('/contractor/get-user-on-role-level-wise/:role_id?', verifyContractorToken, getUsersOnRoleId);
Router.post('/contractor/save-user-hierarchy-level-wise', verifyContractorToken, saveUserHierarchyLevel);
Router.post('/contractor/mark-attendance-in-bulk', verifyContractorToken, markAttendanceInBulk)

Router.post('/contractor/create-leave-type', verifyContractorToken, createLeaveType)
Router.get('/contractor/get-all-leave-type', verifyContractorToken, getAllLeaveType)
Router.get('/contractor/get-active-leave-type', verifyContractorToken, getAllActiveLeaveType)
Router.get('/contractor/get-leave-type-by-id/:id', verifyContractorToken, getAllLeaveTypeById)
Router.post('/contractor/update-leave-type-details', verifyContractorToken, updateLeaveType)
Router.delete('/contractor/delete-leave-type/:id', verifyContractorToken, deleteLeaveType)
Router.post('/contractor/apply-leave', verifyContractorToken, applyLeave)
Router.get('/contractor/get-all-managers-users', verifyContractorToken, getAllManagerUsers);
Router.post('/contractor/leave-application-status-update', verifyContractorToken, updateLeaveApplication);
Router.get('/contractor/get-leaves-data', verifyContractorToken, getCountLeaves)

Router.post('/contractor/create-group-insurance', verifyContractorToken, createGroupInsurance)
Router.get('/contractor/get-group-insurance-list', verifyContractorToken, getAllGroupInsurance)
Router.get('/contractor/get-group-insurance-single-details/:id', verifyContractorToken, getSingleGroupInsuranceDetails)
Router.post('/contractor/update-group-insurance-details', verifyContractorToken, updateGroupInsuranceDetails)
Router.delete('/contractor/delete-group-insurance-details/:id', verifyContractorToken, deleteGroupInsurance);

Router.post('/contractor/register-insurance-company', verifyContractorToken, registerInsuranceCompany)
Router.get('/contractor/get-insurance-company-list', verifyContractorToken, getAllInsuranceCompanyList)
Router.get('/contractor/get-insurance-company-single-details/:id', verifyContractorToken, getSingleInsuranceCompanyDetails)
Router.post('/contractor/update-insurance-company-details', verifyContractorToken, updateInsuranceCompanyDetails)
Router.post('/contractor/delete-insurance-company/:id', verifyContractorToken, deleteInsuranceCompanyById)

Router.post('/contractor/register-insurance-company-plans', verifyContractorToken, registerInsuranceCompanyPlan)
Router.get('/contractor/get-all-insurance-plan-list', verifyContractorToken, getAllInsurancePlans)
Router.get('/contractor/get-single-insurance-plan-details/:id', verifyContractorToken, getInsurancePlanById)
Router.post('/contractor/update-insurance-plan-details', verifyContractorToken, updateInsurancePlanDetails)
Router.post('/contractor/delete-insurance-plan-details/:id', verifyContractorToken, deleteInsurancePlanById)
Router.get('/contractor/get-plans-of-insurance-company/:id', verifyContractorToken, getInsuranceCompanyWithPlansById)

//---------------Documents routes contractors------------------------
Router.post('/contractor/create-document-category', verifyContractorToken, createDocumentCategory)
Router.get('/contractor/get-all-document-cate\gories', verifyContractorToken, getAllDocumentCategory)
Router.get('/contractor/get-document-category-details/:id', verifyContractorToken, getDocumentCategoryById)
Router.post('/contractor/update-document-category-details', verifyContractorToken, updateDocumentCategory)
Router.delete('/contractor/delete-document-category/:id', verifyContractorToken, removeDocumentCategoryById)
Router.post('/contractor/add-documents', verifyContractorToken, addDocuments)
Router.get('/contractor/get-all-document', verifyContractorToken, getAllDocuments)
Router.get('/contractor/view-document/:id', verifyContractorToken, viewDocuments)
Router.get('/contractor/get-document-on-category-id/:id', verifyContractorToken, getDocumentOnCategoryById)
Router.delete('/contractor/delete-document/:id', verifyContractorToken, removeDocumentById)
Router.post('/contractor/update-document', verifyContractorToken, updateDocuments);
Router.get('/contractor/get-users-by-role/:id', verifyContractorToken, getUsersByRoleId);

Router.get('/contractor/get-all-module', verifyContractorToken, getAllModule);
Router.get('/contractor/all-apply-leave', verifyContractorToken, getAllLeaveApplications);
Router.get('/contractor/get-all-allowances', verifyContractorToken, getAllCreatedAllowances);
Router.get('/contractor/get-all-leave-balance', verifyContractorToken, getAllLeaveBalance);

Router.get('/contractor/get-all-deductions', verifyContractorToken, getAllCreatedDeductionTypes);
Router.get('/contractor/roles', verifyContractorToken, getAllRoles);
Router.get('/contractor/get-all-payroll-master-settings', verifyContractorToken, getAllPayRollMasterSettings);
Router.get('/contractor/get-salary-disbursal', verifyContractorToken, getAllUserSalaryForDisbursal);
Router.get('/contractor/get-salary-disbursal-details', verifyContractorToken, getUserSalaryDisbursalDetailsById);
Router.post('/contractor/mark-salary-disbursed', verifyContractorToken, markSalaryDisbursed);
Router.get('/contractor/get-all-loans-pending', verifyContractorToken, getAllLoanRequests);
Router.get('/contractor/get-users-pay-slip', verifyContractorToken, getUsersPaySlip);
Router.get('/contractor/get-user-pay-slip-details', getUserPayslipDetailsById);


Router.post('/contractor/employee-promotion-demotion-add', verifyContractorToken, employeeAddAction);
Router.get('/contractor/employee-promotion-demotion-get-all-list', verifyContractorToken, getAllEmployeePromotionDemotion);
Router.get('/contractor/single-employee-promotion-demotion-details/:id', verifyContractorToken, getAllEmployeePromotionDemotionById);
Router.post('/contractor/update-employee-promotion-demotion-details', verifyContractorToken, updateEmployeePromotionDemotionDetails);

Router.get('/contractor/get-resignations-pending-request', verifyContractorToken, getPendingResignationRequests);
Router.get('/contractor/get-resignations-approved-list', verifyContractorToken, getApprovedResignationRequests);
Router.get('/contractor/get-resignations-rejected-list', verifyContractorToken, getRejectedResignationRequests);
Router.get('/contractor/get-single-resignation-details/:id', verifyContractorToken, getResignationDetailsById);
Router.post('/contractor/update-resignations-details', verifyContractorToken, updateResignationDetails);
Router.post('/contractor/viewed-resignations-request/:id', verifyContractorToken, resignationRequestViewed);
Router.post('/contractor/update-resignations-request-by-admin/:id/:status', verifyContractorToken, resignationStatusUpdateByAdmin);
Router.post('/contractor/generate-fnf-statements', verifyContractorToken, generateFnFStatement);
Router.get('/contractor/get-fnf-statements', verifyContractorToken, getFnfStatement);

Router.post('/contractor/register-employee-pension', verifyContractorToken, registerPensionForEmployee);
Router.get('/contractor/get-all-registered-pension-list', verifyContractorToken, getAllRegisteredPension);
Router.get('/contractor/get-single-registered-pension-details/:id', verifyContractorToken, getRegisteredPensionById);
Router.post('/contractor/update-registered-pension', verifyContractorToken, updatePensionDetails);
Router.delete('/contractor/delete-register-employee-pension/:id', verifyContractorToken, deletePensionById);

Router.get('/contractor/get-employee-history-details/:id', verifyContractorToken, trackEmployeeHistory);
Router.get('/contractor/get-all-activity-logs', verifyContractorToken, getAllActivityLog);
Router.get('/contractor/get-single-activity-logs/:id', verifyContractorToken, getActivityLogDetails);

Router.get('/contractor/get-item-master-details/:id', verifyContractorToken, getSingleItemMaster);
Router.get('/contractor/get-all-item-master-for-dropdown', verifyContractorToken, getAllItemMastersForDropdown);
Router.post('/contractor/add-item-via-stock-request', verifyContractorToken, addItemFromStockRequest);
Router.post('/contractor/check-item-unique-id-exists', verifyContractorToken, checkItemUniqueIdExist);
Router.post('/contractor/profile-update', verifyContractorToken, updateProfile);
Router.get('/contractor/profile', verifyContractorToken, getProfileDetails);
Router.post('/contractor/change-password', verifyContractorToken, changePassword);
Router.post('/contractor/add-item-via-fund-request', verifyContractorToken, addItemFromFundRequest);
Router.post('/contractor/approved-add-item-via-fund-request', verifyContractorToken, approvedAddItemFromFundRequest)
Router.post('/contractor/by-name-to-hsn-code', verifyContractorToken, byNameToHsnCode)
Router.get('/contractor/get-item-master-by-supplier-id/:id', verifyContractorToken, getAllItemsBySupplierId)

Router.post('/contractor/create-plan', verifyContractorToken, createPlan);
Router.get('/contractor/get-all-plans', verifyContractorToken, getAllPlans);
Router.get('/contractor/get-plan-details/:id', verifyContractorToken, getPlanById);
Router.post('/contractor/update-plan-details', verifyContractorToken, updatePlanDetails);
Router.delete('/contractor/delete-plan/:id', verifyContractorToken, deletePlan);
Router.post('/contractor/buy-plan-details', buyPlan);

///------------Task routes contractors --------------------------------
Router.post('/contractor/create-task', verifyContractorToken, createTask)
Router.post('/contractor/create-task-category', verifyContractorToken, createTaskCategory);
Router.get('/contractor/get-all-task-category', verifyContractorToken, getAllTaskCategory);
Router.get('/contractor/get-single-task-category/:id', verifyContractorToken, getSingleTaskCategory);
Router.post('/contractor/update-task-category', verifyContractorToken, updateTaskCategoryDetails);
Router.delete('/contractor/delete-task-category/:id', verifyContractorToken, removeTaskCategoryById);
Router.post('/contractor/add-task-comment', verifyContractorToken, createTaskComment);
Router.post('/contractor/update-task-comment', verifyContractorToken, updateTaskComment);
Router.get('/contractor/get-task-comment-details/:id', verifyContractorToken, getTaskCommentDetailsById);
Router.get('/contractor/get-task-lists', verifyContractorToken, getAllTaskList);
Router.get('/contractor/get-task-single-list/:id', verifyContractorToken, getTaskById)
Router.delete('/contractor/delete-task/:id', verifyContractorToken, deleteTask)
Router.post('/contractor/update-main-task-status', verifyContractorToken, updateMainTaskStatus)
Router.post('/contractor/update-task-list', verifyContractorToken, updateTaskDetails)




//messages

Router.post('/contractor/send-messages', verifyContractorToken, sendMessage);
Router.get('/contractor/get-messages', verifyContractorToken, getMessages);
Router.get('/contractor/get-single-sender-messages/:id', verifyContractorToken, getSenderAllMessages);
Router.get('/contractor/add-new-user-to-chat', verifyContractorToken, addNewUserToChat);
Router.post('/contractor/start-chat-to-new-user/:id', verifyContractorToken, startChatWIthNewUser);
Router.get('/contractor/get-total-unread-messages', verifyContractorToken, getTotalUnreadMessages);
Router.post('/contractor/mark-all-messages-read', verifyContractorToken, markAllMessagesRead);
Router.post('/contractor/sender-messages-mark-read/:id', verifyContractorToken, markReadSenderAllMessages);

Router.get('/contractor/get-all-notifications', verifyContractorToken, getNotifications)
Router.get('/contractor/get-logged-user-notifications', verifyContractorToken, getLoggedUserNotifications)
Router.get('/contractor/count-logged-user-unread-notifications', verifyContractorToken, countLoggedUserUnreadNotifications)
Router.post('/contractor/mark-as-read-notifications', verifyContractorToken, markAsReadNotifications)


Router.get('/contractor/feedback-and-suggestions', verifyContractorToken, getAllFeedbackAndSuggestions);
Router.get('/contractor/get-users-list-without-team', verifyContractorToken, getMemberListWithoutTeam);

//---pupose master ---
Router.post('/contractor/create-purpose-master', verifyContractorToken, createPurposeMaster)
Router.get('/contractor/get-all-purpose-master', verifyContractorToken, getAllPurposeMaster)
Router.get('/contractor/get-single-purpose-master/:id', verifyContractorToken, getSinglePurposeMasterById)
Router.post('/contractor/update-purpose-master', verifyContractorToken, updatePurposeMaster)
Router.delete('/contractor/delete-purpose-master/:id', verifyContractorToken, deletePurposeMasterById);
Router.get('/contractor/get-task-status-for-dashboard', verifyContractorToken, taskDashboard);
Router.get('/contractor/get-all-task-by-status', verifyContractorToken, getAllTaskByStatus);

Router.get('/contractor/all-active-zone', verifyContractorToken, getAllActiveZones);

Router.post('/contractor/add-bank-account-details', verifyContractorToken, addAccountDetails)
Router.get("/contractor/get-all-account-details", verifyContractorToken, getAllAccountsDetails)
Router.get("/contractor/account-details-by-id/:id", verifyContractorToken, accountDetailsbyId)
Router.post("/contractor/update-account-details", verifyContractorToken, updateAccountDetails)
Router.delete('/contractor/delete-account-details/:id', verifyContractorToken, deleteAccountDetails)
Router.post('/contractor/add-wallet-amount', verifyContractorToken, addAmountToBankAccount)
Router.get("/contractor/get-account-transaction-history/:id", verifyContractorToken, getTransactionByUser)
Router.get('/contractor/get-transaction-list', verifyContractorToken, transactionList);
Router.get('/contractor/get-bank-balance/:bankId/:id', verifyContractorToken, getBankBalance)
Router.get('/contractor/select-bank-account-number-balance/:id/:bankId', verifyContractorToken, bankAccountNumbertoBalance)
Router.get('/contractor/get-bank-to-account/:id', verifyContractorToken, getBankToAccount)
Router.get('/contractor/get-bank-to-all-accounts-transaction/:id/:type', verifyContractorToken, getBankTransactions)
Router.get('/contractor/get-bank-to-all-accounts-transaction-via-stock/:id', verifyContractorToken, getBankTransactionsForStock)
Router.get('/contractor/get-check-last-balance/:bankId', verifyContractorToken, checklastBalanceOfWallets)
Router.get('/contractor/get-check-last-balance-of-employee/:employeeId', verifyContractorToken, checkLastBalanceOfEmployee)
Router.get('/contractor/get-last-balance-of-employee/:employeeId?', verifyContractorToken, lastBalanceOfEmployeeInExpense)
Router.get('/contractor/get-expense-transaction/:user_id', verifyContractorToken, getUserExpenseTransaction)
Router.get('/contractor/get-user-wallet-details/:user_id', verifyContractorToken, getUserWalletDetails)

Router.post('/contractor/transfer-fund', verifyContractorToken, transferFundAmount)
Router.post('/contractor/rescheduled-transfer-fund/:id/:rescheduled_date', verifyContractorToken, rescheduledTransferFund)
Router.get('/contractor/rescheduled-transfer-fund', verifyContractorToken, reschduleTransferFund)

Router.get('/contractor/sales-area', verifyContractorToken, getSalesArea)
Router.get('/contractor/active-sales-area', verifyContractorToken, getActiveSalesArea);
Router.get('/contractor/all-regional-offices', verifyContractorToken, getAllRegionalOffices);
Router.get('/contractor/all-outlets', verifyContractorToken, getAllOutlet)

Router.post('/contractor/create-allowances', verifyContractorToken, createAllowances);
Router.post('/contractor/create-deductions', verifyContractorToken, createDeductionsType);

Router.post('/contractor/update-payroll-master-settings', verifyContractorToken, updatePayrollSettings)
Router.post('/contractor/update-payroll-master-settings-label', verifyContractorToken, updatePayrollSettingLabel)
Router.post('/contractor/create-new-payroll-settings', verifyContractorToken, addPayrollMasterSettingLabel)

const { allCountries, getStates, allCities } = require('./controllers/generalController');
const { verify } = require('jsonwebtoken');
const { addLocation, getLocations, getLocationById, updateLocation, deleteLocation } = require('./controllers/preciseLocationController');

Router.get('/get-all-countries', allCountries);
Router.get('/get-states/:id', getStates);
Router.get('/get-cities/:id', allCities);

// dealer login API
Router.post('/dealer/login-admin', adminLogin);


Router.post('/contractor/clock-in', verifyContractorToken, clockIn)
Router.post('/contractor/clock-out', verifyContractorToken, clockOut)
Router.get('/contractor/check-full-month-clock-in', verifyContractorToken, checkClockInToday)
Router.post('/contractor/mark-break', verifyContractorToken, startBreak)
Router.post('/contractor/break-end', verifyContractorToken, endBreak)
Router.get('/contractor/check-clock-in-status', verifyContractorToken, getClockInStatus)
Router.get('/contractor/get-past-days-attendance', verifyContractorToken, getPastDaysAttendance)
Router.get('/contractor/get-all-users-by-admin', verifyContractorToken, allUserFromAdmin)
Router.get('/contractor/get-past-days-attendance-users/:user_id', verifyContractorToken, getPastDaysAttendanceUsers)
Router.get('/contractor/get-today-attendance',verifyContractorToken, getTodayAttendance)

Router.post('/contractor/add-locations', verifyContractorToken, addLocation);
Router.get('/contractor/get-locations', verifyContractorToken, getLocations);
Router.get('/contractor/get-locations-by-id', verifyContractorToken, getLocationById);
Router.put('/contractor/update-locations/:id', verifyContractorToken, updateLocation);
Router.delete('/contractor/delete-locations/:id', verifyContractorToken, deleteLocation);
Router.get('/contractor/downlod-csv-for-attendance',verifyContractorToken, downloadCsvFileForUsers);
Router.get('/contractor/downlod-pdf-for-attendance', downloadPdfFileForUsers);



Router.get('/contractor/get-all-module', verifyContractorToken, getAllModule)
Router.get('/contractor/get-all-sub-module', verifyContractorToken, getAllSubModule)
Router.get('/contractor/get-sub-module-with-module-name', verifyContractorToken, getSubModuleWithModuleName)
Router.get('/contractor/get-sub-module-by-module-id/:id', verifyContractorToken, getSubModuleByModuleId)
Router.post('/contractor/set-permission-on-role-basis', verifyContractorToken, setPermissionOnRoleBasis)
Router.post('/contractor/set-permission-on-role', verifyContractorToken, setPermissionOnRole)
Router.post('/contractor/set-permission', verifyContractorToken, setPermission)
Router.get('/contractor/get-all-module/:role_id', verifyContractorToken, getAllModule)

Router.get('/contractor/roles', verifyContractorToken, getAllRoles)
Router.post('/contractor/create-role', verifyContractorToken, createRole)
Router.get('/contractor/edit-role/:id', verifyContractorToken, editRole)
Router.post('/contractor/update-role', verifyContractorToken, updateRole)
Router.delete('/contractor/delete-role/:id', verifyContractorToken, deleteRole)



module.exports = Router;