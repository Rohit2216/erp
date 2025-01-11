const express = require('express')
/** * validation helper  */

const { verifyContractorToken, verifySuperAdminToken } = require('./helpers/verifyToken')

const { getAllActiveEnergyCompany, createEnergyTeam, updateEnergyTeam, getEnergyTeamDetailsById, deleteEnergyTeam, getEnergyCompanySubSidiaries } = require('./controllers/energyCompanyController');
const { getEnergyCompanyAssignZones } = require('./controllers/zoneController');
const { getRegionalOfficesOnZoneId, getRegionalOfficersOnRo, getAllRegionalOfficers } = require('./controllers/regionalOfficeController');
const { getSaleAreaOnRoId } = require('./controllers/salesAreaController');
const { getAllDistrictBySaleAreaId } = require('./controllers/districtController');
const { getOutletByDistrictId, getOutletByEnergyCompanyId, getAllOutletForDropdown, addOutlet, getAllOutlet, editOutlet, updateOutlet, removeOutletById, getOutletBySalesId, approveRejectOutletByStatus, getOutletById, importOutlet } = require('./controllers/outletController');
const { getAllComplaintSubTypes } = require('./controllers/complaintSubTypeController');
/** * user controller  */
const { getAllUsers, getUserById, getEndUserManagerAndSupervisor, getAllSupervisorUsers, getAllDealerUsers, getAllAdmins, getDealerById } = require('./controllers/userController');

const { createRole, getAllRoles, editRole, updateRole, deleteRole, getAllRolesForDropdown } = require('./controllers/roleController')
const { getComplaintFullTimeline, getTotalFreeEndUsers, assignedComplaintToUsers, getManagerFreeTeamMember, countTotalMemberOnSingleComplaint, complaintStatusChanged, getAllComplaintListForDropdown, getUserByComplaintId, updateAssignedComplaintToUsers, rejectedAssignComplaintToUsers } = require('./controllers/contractorComplaintController')
const { createItemMaster, getAllItemMasters, getSingleItemMaster, updateItemMaster, deleteItemMaster, getItemPriceByBrand } = require('./controllers/itemMasterController');
const { fundRequest, getAllFundRequests, getAllApprovedFundRequests, getAllRejectedFundRequests, getFundRequestById, updateFundRequest, deleteFundRequest, getFundRequestOnComplaintUniqueId, changeStatusOfFundRequest, getFundDetailsOnItemId, rejectFundRequest, getAllApprovedFundAndPartialTransfer, getPendingTransferFund, reActiveToRejectedFundRequest, getFundRequestFourLowPrice, getAllPreviousPrice, getAllOldItemInFunds, getLastThreePrevPrice } = require('./controllers/fundRequestController');

const { createItem, updateItem, getAllItems, deleteItem, getItemById } = require("./controllers/itemController");

const { createQuotation, getQuotation, getQuotationById, updateQuotation, deleteQuotation, sendEmailQuotation, approveOrRejectQuotationsById } = require("./controllers/quotationController")

const { createSuppliers, getSuppliers, getSuppliersById, updateSuppliers, deleteSuppliers, approveOrRejectSuppliersById } = require("./controllers/suppliersController")

const { createFinancialYears, updateFinancialYearById, fetchAllFinancialYears, fetchFinancialYearById, deleteFinancialYearById } = require("./controllers/financialYearController")

const { createUnitData, updateUnitDataById, getAllUnitData, getUnitDataById, deleteUnitDataById, getAllUnitDataForDropdown } = require("./controllers/unitController");

const { createBillingType, getAllBillingTypes, getBillingTypesById, updateBillingType, removeBillingTypeById } = require("./controllers/billingTypeController");

const { createTaxDetails, getAllTaxes, getTaxesDetailById, updateTaxDetails, removeTaxById } = require("./controllers/taxController");

const { createInvoiceData, updateInvoiceData, getAllInvoices, getInvoiceDetailById, deleteInvoiceData, mergeInvoice, getAllMergedInvoices, discardInvoice, getMergedInvoiceDetailById, discardMergedInvoice, getAllPOForInvoices, getAllROForInvoices, getAllBillNumberForInvoice, fromBillingToCompanyInInvoice, getAllInvoicesListingInPayments, getMergedInvoiceDetailByIds, getAllComplaintViaInvoice, getRegionalOfficeInPaidPayment, getAreaManagerInPaidPayment, getAllComplaintViaInvoiceById, getAllComplaintViaInvoiceForRo, getPoNumberInPaidPayment } = require("./controllers/invoiceController")

const { stockRequestSave, getAllStockRequests, getStockRequestsDetailsById, stockRequestDetailsUpdate, deleteStockRequest, updateStockRequestStatus, getStockDetailsOnItemId, getAllApprovedStockRequests, getAllRejectedStockRequests, transferStock, getSupplier, stocksAmountTransfer, rescheduledTransferstock, getReschduleTransferStock, getAllPendingStockTransfer, getAllPreviousPriceOfStocks, getStockTransfer, getAllStockTransfer, rejectStockRequest, reActiveToRejectedStockRequest, getLastThreePrevPriceInStocks, getAllhistoryByToday, getAllStocksRequests, getSupplierTransactions, getAllOldItemInStocks, updateBillNumber, getLastThreePrevPriceBySuppliers } = require('./controllers/stockRequestController');

const { createPurchaseOrder, getAllGeneratedPurchaseOrder, getPurchaseOrderDetailsById, updatePurchaseOrderDetails, deletePurchaseOrder, checkPONumberIsAlreadyExists, getPoListOnRoId, getIncludePercentage, getAllGstType, changePoStatus, getPurchaseOrderItemsOnPo, downloadCsvFile, getRoForPurchaseOrder, getPoNumberForPurchaseOrder, approveAndUpdatePurchaseOrder, getSecurityUniqueId, approvePurchaseOrder } = require('./controllers/purchaseOrderController');

const { createMeasurement, getAllCreatedMeasurements, getMeasurementsDetailsById, updateMeasurementDetails, deleteMeasurementDetails, measurementDetailsWithPoAndComplaint, ItemsOnMeasurementId, getAllComplaintsFromSite, discardMeasurementDetails, getAllDiscardMeasurements, getDiscardMeasurementsDetailsById, getResolvedComplaintsInBilling, getAttachmentAndInspectionDetails, getAllMeasurements, getAllMeasurementsBasedOnStatus, saveIntoDraftMeasurement, getOutletByIdForPtm, getRegionalByIdForPtm, getOrderByIdForPtm, getOutletByIdInsideBilling, getSalesByIdInsideBilling, getRegionalByIdInsideBilling, getSaleByIdNewForPtm, getAllOrderByForMeasurements, discardToReactiveMeasurement, getSimilarPurchaseOrders, measurementDetailsWithPo, getMeasurementsTimeLineDetailsById, getAllPoItem, updatePoInMeasurementDetails } = require('./controllers/measurementController');

const { getAllCompanyForDropdown, getCompanyDetailsById, getComplaintName } = require('./controllers/companyController');
const { getAllRegionalOfficeForDropdown } = require('./controllers/regionalOfficeController');
const { getAllStateForDropdown, getAllPurchaseOrder, getComplaintType, getOutletBySaleArea, uploadImageWithWaterMark, convertBase64Image } = require('./controllers/commonController');

const { generateProformaInvoice, getAllProformaInvoices, getProformaInvoicesDetailsById, updateProformaInvoiceDetails, deleteProformaInvoices, getAllProformaInvoiceOnPoId, multiComplaints, getAllPOFilters, getAllMeasurementsInPIStatus, getAllROBasedOnPo, getAllROBasedOnComplaint, getAllROFromProforma, getAllPOForProforma, getAllBillNumberFromProforma, getSamePoExistsOrNot, changePoInMeasurements, discardProformaInvoices, reactiveToDiscardPi, roToBillingFromCompany, fromBillingToCompany, getMergedPiList, discardMergedPI, mergedPi, getAllProformaInvoicesInMergedPI, getMergedPerfomaInvoiceById, getAllComplaintsInPI, getAllProformaInvoice, getAllMergedProformaInvoice, getMergedProformaInvoicesDetailsById, getAllProformaInvoicesInInvoice, getPiList } = require('./controllers/proformaInvoiceController');

const { mergePItoInvoice } = require('./controllers/mergeInvoiceController');

const { addSecurityMoney, getAllSecurityMoney, getSecurityMoneyDetailById, updateSecurityMoney, deleteSecurityMoneyDetailById } = require('./controllers/securityMoneyController');

const { createCategory, getAllCategory, getCategoryDetailById, updateCategory, deleteCategoryById } = require('./controllers/categoryController');

const { addProduct, getAllProducts, getProductDetailById, updateProduct, removedProductById, publishedProduct } = require('./controllers/productController');

const { requestCash, getAllLoggedUserCashRequested, getCashRequestedDetailById, updatedRequestedCashDetail, deleteRequestedCashDetail, cashRequestStatusAction, getAllCashRequestedList, getAllApprovedCashRequest, getAllRejectedCashRequest } = require('./controllers/cashRequestController');

const { addPaymentMethod, getAllMethods, deleteMethod, getMethodDetailById, updatePaymentMethod, getAllMethodsForDropdown } = require('./controllers/paymentMethodController');

const { addExpenseCategory, getExpenseCategory, deleteExpenseCategory, updateExpenseCategory, fetchExpenseCategory, getExpenseCategoryForDropdown } = require('./controllers/expenseCategoryController');

const { addExpenses, getLoggedUserAllExpenses, getExpensesDetailById, updateExpenses, deleteExpense, expenseApproveReject, viewRequestedExpenses, getExpenseRequest, getExpenseRequestById, itemsMasterToApprovePrice } = require('./controllers/expenseController');

const { getUserAllTransaction } = require('./controllers/transactionController');

const { userWalletBalance, userTransactionMonthlyReport, cashRequestTracked, userTransactionHistory, getUserAssetAndFundMonthlyReport, addFundtoUser } = require('./controllers/fundManagementController');

const { requestItems, getAllRequestedItemList, getRequestedItemDetailById, updateRequestItemsDetails, deleteRequestedItemById, requestStatusChanged, getAllApprovedRequestedItemList, getAllRejectedRequestedItemList, approvedItemRequestAssignTo, getApprovedRequestDetailById } = require('./controllers/itemRequestController');

const { getAllComplaintList, getComplaintDetailById, getOutletDetails, getFreeEndUsers, createEarthingTesting, getAllEarthingTestingLists, getEarthingTestingDetailById, updateEarthingTesting, changeEarthingTestingStatus, approveRejectEarthingTestingsByStatus, assignToEarthingTesting, earthPitReport, getEarthPitreport } = require('./controllers/earthingTestingController');

const { getAllSaleAreaAndOutlet, getOutletComplaints, getApprovedUsedItemsOnComplaint, getPendingUsedItemsOnComplaint, approvedUsedItems, getAllApprovedExpenseList, approvedExpensesFromOffice, getAllApprovedOfficeExpenseList, getAllSaleAreaList, assignApprovedItems, assignApprovedExpense, getAllStockPunchedList, getSingleStockPunchedDetails, approvedPunchedStockDetails, assignApprovedItemStock, getAllOutletsWithComplaints, getAllOutletsWithComplaintsById, approveOfficeInspections, getAllOutletsWithComplaintsApproved, getAllOutletsWithComplaintsByApprovedId, getAllOutletsWithComplaintsPartial, getAllOutletsWithComplaintsByPartialId, getOutletOfficeById, getSalesAreaOfficeById, getRegionalOfficeExpenseById, getAllOutletsWithComplaintsForFunds, getAllOutletsWithComplaintsForFundsById, getAllOutletsWithComplaintsPartialForFunds, approveOfficeInspectionsForFund, getAllOutletsWithComplaintsApprovedForFund, getAllOutletsWithComplaintsForFundByApprovedId, getAllOutletsWithComplaintsForFundByPartialId, getRegionalOfficeExpenseByIdForFund, getSalesAreaOfficeByIdForFund, getOutletOfficeByIdForFund, getComplaintIdToDetails, getAllApprovedData } = require('./controllers/officeInspectionController');

const { verifiedUsedItems, getAllVerifiedComplaintItems, verifiedExpensesFromSite, getAllVerifiedSiteExpenseList, assignComplaints, approveSiteInspections, getAllSiteInspectionPartial, getAllSiteInspectionApproved, getAllSiteInspection, getAllSiteInspectionById, getAllSiteInspectionPartialById, getAllSiteInspectionApprovedById, getAllOutletsWithComplaintsSiteForFunds, getOutletsWithComplaintsSiteForFundsById, getAllApprovedOutletsWithComplaintsSiteForFunds, getAllPendingOutletsWithComplaintsSiteForFunds, getApprovedOutletsSiteForFundsById, getPartialOutletsSiteForFundsById, approveSiteInspectionsForFund, assignComplaintsForFundSite } = require('./controllers/siteInspectionController');

const { assignSiteInspectionComplaintModule, getSiteInspectionAssignComplaintModuleOnUserId, assignMultipleSiteInspectionComplaintModule } = require('./controllers/assignSiteInspectionComplaintModuleController');

const { importBankDetailData, getSpecificColumnValueFromCsv } = require('./controllers/importDataController');

const { getAllBankList, addBankDetails, bankList, bankDetailsById, updateBankDetails } = require('./controllers/bankController');

const { assignComplaintModule, getAssignComplaintModuleOnUserId, assignMultipleComplaintModule } = require('./controllers/assignComplaintModuleController');

const { uploadComplaintImages, getAllUploadedImages, getSingleUploadedImagesById, updateComplaintImages, deleteComplaintWorkImages, getComplaintImagesForPPT, approveRejectComplaintImagesByStatus } = require('./controllers/complaintImagesController');

const { getAllItemStockReport, getItemDistributeReport, stockTransfer, newStockTransfer, stockPunchItemsMasterToApprovePrice, getStockTransferQunatity, getStockTransferQuantityById, getUserStockItems } = require('./controllers/stockController');

const { createAssets, getAllStoredAssets, getSingleStoredAssetDetails, updateStoredAssetDetails, deleteAssets, assignAssetToUsers, getAllAssignedAssets, getAllIdleAssets, approveRejectAssetsByStatusAndById, createAssetsRepairRequest } = require('./controllers/assetController');

const { getAssetTimelineHistory, getAssetWithTimelineHistory } = require('./controllers/assetTimelineController');

const { createRepairRequest, getAllRepairRequestedAssetList, getSingleRepairRequestedAssetListDetails, updateRepairRequestDetails, deleteRepairRequest, getAllAssignedAssetList, markRequestViewed, AssignedRequest } = require('./controllers/assetRepairRequireController');

const { createTutorial, getTutorials, getTutorialByFormat, updateTutorials, deleteTutorialsById, getTutorialById } = require('./controllers/tutorialController');

const { createContacts, getAllStoredContacts, getStoredContactDetailById, updateContacts, deleteContactDetailById, getAllPositionOfCompanyContacts, deleteMessage, getMessageById, getAllMessages, updateMessage, sendMessage } = require('./controllers/companyContactController');

const { createHolidayList, getAllHolidayList, getHolidayDetailById, updateHolidayList, deleteHolidayList, getHolidayListOfMonth, getTodayBirthdayList, getUpcomingHolidays } = require('./controllers/holidayController');

const { getAllModules, getTableNameColumnNameOnModuleId, generateReport, makeDynamicQuery } = require('./controllers/reportController');

const { createOrder, updateOrder, getAllData, getOrderById, deleteOrderById, getAllOrderWithPagination } = require("./controllers/orderController");

const { stockPunch, getAllStockPunchList, getStockPunchById, verifyStockPunchOtp, getStockRequest, getStockRequestById, approveStockPunch, getAllApproveStockPunchList, getAllApproveStockPunchListById, stockItemList } = require("./controllers/stockPunchController");

const { addExpensePunch, getAllExpensePunchList, getExpensePunchById, getAllCheckAndApprove, updateExpensePunch, getListExpensePunchApprove, getListExpensePunchApproveAccordingToItems, fundItemLists } = require("./controllers/expensePunchController");

const { createGstMasters, getAllGstMasterData, getGstMasterDetailsById, updateGstMasters, deleteGstMasterDetailsById, getGstDetailsOnStateId, getAllGstMasterDataForDropdown } = require("./controllers/gstMasterController");

const { getALLmanagersWIthTeamMembers, getSuperVisorOnManagerId, getFreeEndUsersOnSuperVisorId, getAreaManagerOfUser, getComplaintAssignUserManagerAndSupervisor, getALLSupervisors } = require("./controllers/assignController");

const { getFoodExpenses, setFoodExpenseMaxLimit, punchFoodExpense } = require("./controllers/foodExpenseController");

const { createInvoiceNumberFormat, getAllGeneratedInvoiceFormat, getAllGeneratedInvoiceFormatById, updateInvoiceNumberFormat, deleteGeneratedInvoiceFormatById } = require("./controllers/invoiceNumberFormatController");

const { importData, importUserData } = require('./controllers/importDataController');

const { getModuleByPlanId } = require('./controllers/moduleController');
const { registerResignation } = require('./controllers/employeeResignationController');
const { createLoan, getAllLoanRequests, getAllActiveLoan, getAllRejectedLoan, getAllClosedLoan, getLoanDetailById, updateLoanDetails, updateLoanStatus, deleteLoanDetailById } = require('./controllers/loanController');
const { verify } = require('jsonwebtoken');
const { getTransferFund, getALLTransferFund, getTotalTransferAmount } = require('./controllers/transferFundController');
const { getUserTransactionHistory } = require('./controllers/accountsController');
const { filesUpload, getPiAttachmentByComplaintId, filesUploadInBilling, updatePiAttachmentInBilling } = require('./controllers/pi_attachment');
const { addPaymentReceive, getAllPaymentReceive, getPaymentReceiveDetailsById, updatePaymentReceive, getAllPaymentRetention, updatePaymentRetentionStatus, getAllPaymentReceiveInPayment, listingOfPvNumber, updatePaymentReceiveInRetention, getListingofPaymentHistory, discardPaymentRetention, updatePaymentAmountRetention, getRoForDropdown, approvePaymentRetention, getPaymentRetentionDetailsById, getPoForDropdown, getRetentinIdForDropdown } = require('./controllers/paymentReceived');
const { addPaymentSetting, getAllPaymentSettings, getPaymentSettingDetailsById, updatePaymentSetting, deletePaymentSetting, getExpensePunchAndStockTotalAmount, addPaymentPaid, getAreaManagerTransactions, getAreaManagerTransactionsById, createAreaManagerRatio, getAllAreaManager, getAreaManagerById, updateAreaManager, otpVerifyInPaymentPaid, getPaymentPaid, getPaymentPaidById, resendOtp, addPaymentPaidforRo, getRoPaymentPaid, getPaymentPaidRoById, updatePaymentRoPaid, roTransactions, getRoTransactionsById, getRoPaymentPaidByPoDetails, getPaymentPaidRoDetailsById, poTransactions, getPoTransactionsById } = require('./controllers/paymentSettingController');
const { attachAllDocumentsByMeasurementId, getProformaInvoicePdf } = require('./controllers/pdfController');
const { getTotalComplaintsCount, getTotalComplaints, getTotalComplaintsCountEachMonth, getAreaManagers, getAreaManagersDashboard, getEndUsersDashboard, getProformaInvoiceEachMonthAmount, getInvoiceEachMonthAmount, getMeasurementAmountEachMonth, getAllComplaintsByStatus, getBillingDashboard, areaManagerDashboardforBilling, roDashboardforBilling } = require('./controllers/dashboard');
const { createBrand, updateBrand, getAllBrands, getBrandById, deleteBrand, getAllBrandsMarkDown } = require('./controllers/brandController');
const { addUpdateFeedbackComplaint, addResponseToFeedbackComplaint, getFeedbackComplaint, deleteFeedbackComplaint, getFeedbackComplaintById } = require('./controllers/feedbackComplaintController');
const { createSalesOrder, updateSalesOrderDetails, getAllGeneratedSalesOrder, getSalesOrderDetailsById, deleteSalesOrder, checkSONumberIsAlreadyExists, getSoListOnRoId, changeSoStatus, getSalesOrderItemsOnSo, approveSalesOrder, approveAndUpdateSalesOrder, getSalesSecurityUniqueId, getRoForSalesOrder, getSoNumberForSalesOrder } = require('./controllers/saleOrderController');
// const { getOutletById } = require('./helpers/general');

const contractorRouter = express.Router()

// ----------Related urls ----------

contractorRouter.get('/contractor/get-active-energy-companies', verifyContractorToken, getAllActiveEnergyCompany)
contractorRouter.get('/contractor/get-energy-company-assign-zones/:id', verifyContractorToken, getEnergyCompanyAssignZones)
contractorRouter.get('/contractor/get-all-regional-office-on-zone-id/:id', verifyContractorToken, getRegionalOfficesOnZoneId)
contractorRouter.get('/contractor/get-all-sales-area-on-ro-id/:id', verifyContractorToken, getSaleAreaOnRoId)
contractorRouter.get('/contractor/get-all-district-on-sale-area-id/:id', verifyContractorToken, getAllDistrictBySaleAreaId)
// contractorRouter.get('/contractor/get-outlet-by-district-id/:id', verifyContractorToken, getOutletByDistrictId);
contractorRouter.get('/contractor/get-all-complaints-sub-types', verifyContractorToken, getAllComplaintSubTypes);
contractorRouter.get('/contractor/get-all-users', verifyContractorToken, getAllUsers);
contractorRouter.get('/contractor/get-all-roles-for-dropdown', verifyContractorToken, getAllRolesForDropdown);
contractorRouter.get('/contractor/get-officers-list-on-ro/:id', verifyContractorToken, getRegionalOfficersOnRo);
contractorRouter.get('/contractor/get-user-manager-and-supervisor-details/:userId', verifyContractorToken, getEndUserManagerAndSupervisor);
contractorRouter.get('/contractor/get-all-outlet-for-dropdown', verifyContractorToken, getAllOutletForDropdown);
contractorRouter.get('/contractor/get-all-regional-order-by', verifyContractorToken, getAllRegionalOfficers);
contractorRouter.get('/contractor/get-all-supervisors', verifyContractorToken, getAllSupervisorUsers);

// ------------------Complaints module routes ----------------

contractorRouter.get('/contractor/get-complaints-timeline/:id', verifyContractorToken, getComplaintFullTimeline);
contractorRouter.get('/contractor/get-free-end-users-count', verifyContractorToken, getTotalFreeEndUsers);
contractorRouter.post('/contractor/assign-complaint-to-user', verifyContractorToken, assignedComplaintToUsers);
contractorRouter.get('/contractor/get-manager-free-team-members/:id', verifyContractorToken, getManagerFreeTeamMember);
contractorRouter.get('/contractor/get-total-member-on-single-complaint/:complaint_id', verifyContractorToken, countTotalMemberOnSingleComplaint);
contractorRouter.get('/contractor/get-all-complaints-list-dropdown', verifyContractorToken, getAllComplaintListForDropdown);
contractorRouter.get('/contractor/get-user-details-by-complaint-id/:id', verifyContractorToken, getUserByComplaintId);
contractorRouter.post('/contractor/update-assign-complaint-to-user', verifyContractorToken, updateAssignedComplaintToUsers)
contractorRouter.post('/contractor/rejected-assign-complaint-users', verifyContractorToken, rejectedAssignComplaintToUsers)
//------------item master routes---------------------------

contractorRouter.post('/contractor/create-item-master', verifyContractorToken, createItemMaster);
contractorRouter.get('/contractor/get-all-item-masters', verifyContractorToken, getAllItemMasters);
contractorRouter.get('/contractor/get-item-master-details/:id', verifyContractorToken, getSingleItemMaster);
contractorRouter.post('/contractor/update-item-master-details', verifyContractorToken, updateItemMaster);
contractorRouter.delete('/contractor/delete-item-master/:id', verifyContractorToken, deleteItemMaster);

//-------------------------fund request routes-----------------------------

contractorRouter.post('/contractor/request-fund', verifyContractorToken, fundRequest);
contractorRouter.get('/contractor/get-all-fund-requested', verifyContractorToken, getAllFundRequests);
contractorRouter.get('/contractor/get-all-approved-fund-requested', verifyContractorToken, getAllApprovedFundRequests);
contractorRouter.get('/contractor/get-all-rejected-fund-requested', verifyContractorToken, getAllRejectedFundRequests);
contractorRouter.get('/contractor/get-fund-request-details/:id', verifyContractorToken, getFundRequestById);
contractorRouter.post('/contractor/update-fund-request-details', verifyContractorToken, updateFundRequest);
contractorRouter.delete('/contractor/delete-fund-request/:id', verifyContractorToken, deleteFundRequest);
contractorRouter.get('/contractor/get-fund-request-by-complaint-id/:complaint_id', verifyContractorToken, getFundRequestOnComplaintUniqueId);
contractorRouter.post('/contractor/status-changed-of-request', verifyContractorToken, changeStatusOfFundRequest);
contractorRouter.get('/contractor/get-fund-request-details-on-item-id/:id', verifyContractorToken, getFundDetailsOnItemId);
contractorRouter.post('/contractor/reject-fund-request/:id', verifyContractorToken, rejectFundRequest);
contractorRouter.get('/contractor/get-all-approved-fund-request-with-partial-fund-transfer', verifyContractorToken, getAllApprovedFundAndPartialTransfer);
contractorRouter.get('/contractor/get-pending-transfer-fund', verifyContractorToken, getPendingTransferFund);
contractorRouter.get('/contractor/get-fund-request-4-low-price/:hsncode/:category', verifyContractorToken, getFundRequestFourLowPrice);
contractorRouter.post('/contractor/reactive-reject-fund-requestet/:id', verifyContractorToken, reActiveToRejectedFundRequest);
contractorRouter.get('/contractor/get-transfer-fund', verifyContractorToken, getTransferFund)
contractorRouter.get('/contractor/get-all-transfer-fund', verifyContractorToken, getALLTransferFund)
contractorRouter.get('/contractor/get-fund-request-details-by-request-for/:request_for_id', verifyContractorToken, getAllPreviousPrice);
contractorRouter.get('/contractor/get-fund-request-items-by-user-id/:id', verifyContractorToken, getAllOldItemInFunds)
contractorRouter.get('/contractor/get-last-three-prev-price-of-items/:id/:userId', verifyContractorToken, getLastThreePrevPrice)
contractorRouter.get('/contractor/get-total-transfer-amount/:id', verifyContractorToken, getTotalTransferAmount)
contractorRouter.get('/contractor/get-supplier-transaction/:id', verifyContractorToken, getSupplierTransactions)
contractorRouter.get('/contractor/get-price-by-brand', verifyContractorToken, getItemPriceByBrand)



contractorRouter.post('/contractor/save-stock-request', verifyContractorToken, stockRequestSave);
contractorRouter.get('/contractor/get-all-requested-stock', verifyContractorToken, getAllStockRequests);
contractorRouter.get('/contractor/get-single-requested-stock-details/:id', verifyContractorToken, getStockRequestsDetailsById);
contractorRouter.post('/contractor/update-stock-request', verifyContractorToken, stockRequestDetailsUpdate);
contractorRouter.delete('/contractor/delete-stock-request/:id', verifyContractorToken, deleteStockRequest);
contractorRouter.post('/contractor/change-stock-request', verifyContractorToken, updateStockRequestStatus);
contractorRouter.get('/contractor/get-stock-details-on-item-id/:id/:user_id', verifyContractorToken, getStockDetailsOnItemId);
contractorRouter.get('/contractor/get-all-approved-requested-stock', verifyContractorToken, getAllApprovedStockRequests);
contractorRouter.get('/contractor/get-all-rejected-requested-stock', verifyContractorToken, getAllRejectedStockRequests);
contractorRouter.get('/contractor/get-all-pending-stock-transfer-request', verifyContractorToken, getAllPendingStockTransfer)
contractorRouter.get('/contractor/get-transfer-stock', verifyContractorToken, getStockTransfer)
contractorRouter.get('/contractor/get-all-transfer-stock', verifyContractorToken, getAllStockTransfer)
contractorRouter.post('/contractor/rejected-stock-request', verifyContractorToken, rejectStockRequest)
contractorRouter.post('/contractor/rejected-stock-request-to-reactive/:id', verifyContractorToken, reActiveToRejectedStockRequest)
contractorRouter.get('/contractor/get-last-three-prev-price-for-stocks/:id/:userId', verifyContractorToken, getLastThreePrevPriceInStocks)
contractorRouter.get('/contractor/get-all-today-history-by-supplier/:supplier_id', verifyContractorToken, getAllhistoryByToday)
contractorRouter.get('/contractor/get-all-stock-requests', verifyContractorToken, getAllStocksRequests)
contractorRouter.get('/contractor/get-all-items-in-stocks-by-userId/:id', verifyContractorToken, getAllOldItemInStocks)
contractorRouter.post('/contractor/update-transfer-bill-and-date', verifyContractorToken, updateBillNumber)
contractorRouter.get('/contractor/get-last-three-prev-price-by-supplier/:id/:userId', verifyContractorToken, getLastThreePrevPriceBySuppliers)

/**stock transfer */
contractorRouter.post('/contractor/transfer-stock', verifyContractorToken, transferStock);
contractorRouter.get('/contractor/get-supplier-details', verifyContractorToken, getSupplier)
contractorRouter.post('/contractor/stock-transfer', verifyContractorToken, stocksAmountTransfer)
contractorRouter.get('/contractor/get-reschdule-transfer-stock', verifyContractorToken, getReschduleTransferStock)
contractorRouter.post('/contractor/rescheduled-stocks-transfer-stock/:id/:rescheduled_date', verifyContractorToken, rescheduledTransferstock)
contractorRouter.get('/contractor/get-stock-request-details-by-request-for/:request_for_id', verifyContractorToken, getAllPreviousPriceOfStocks);

//item request routes
contractorRouter.post('/contractor/items', verifyContractorToken, createItem)
contractorRouter.put('/contractor/update-items/:id', verifyContractorToken, updateItem)
contractorRouter.get('/contractor/get-items', verifyContractorToken, getAllItems)
contractorRouter.delete('/contractor/delete-item/:id', verifyContractorToken, deleteItem)
contractorRouter.get('/contractor/get-complaint-by-id/:id', verifyContractorToken, getItemById)

//------------------------Purchase order routes------------------------
contractorRouter.post('/contractor/create-po-order', verifyContractorToken, createPurchaseOrder);
contractorRouter.get('/contractor/get-all-generated-po', verifyContractorToken, getAllGeneratedPurchaseOrder);
contractorRouter.get("/contractor/get-ro-for-po", verifyContractorToken, getRoForPurchaseOrder);
contractorRouter.get("/contractor/get-po-number-for-po", verifyContractorToken, getPoNumberForPurchaseOrder);
contractorRouter.post("/contractor/approve-purchase-order", verifyContractorToken, approvePurchaseOrder);
contractorRouter.post("/contractor/approve-update-purchase-order", verifyContractorToken, approveAndUpdatePurchaseOrder);
contractorRouter.get("/contractor/get-security-unique-id", verifyContractorToken, getSecurityUniqueId);

contractorRouter.get('/contractor/get-single-po-details/:id', verifyContractorToken, getPurchaseOrderDetailsById);
contractorRouter.post('/contractor/update-po-details', verifyContractorToken, updatePurchaseOrderDetails);
contractorRouter.delete('/contractor/delete-po-details/:id', verifyContractorToken, deletePurchaseOrder);
contractorRouter.get('/contractor/check-po-is-exists', verifyContractorToken, checkPONumberIsAlreadyExists);
contractorRouter.get('/contractor/get-po-details-on-ro/:id', verifyContractorToken, getPoListOnRoId);
contractorRouter.post('/contractor/get-tax-calculation-type', verifyContractorToken, getIncludePercentage);
contractorRouter.get('/contractor/get-all-gst-type', verifyContractorToken, getAllGstType);
contractorRouter.post('/contractor/change-po-status', verifyContractorToken, changePoStatus);
contractorRouter.get('/contractor/get-purchase-order-details-with-items/:id', verifyContractorToken, getPurchaseOrderItemsOnPo);
contractorRouter.post('/contractor/change-po-in-measurements', verifyContractorToken, changePoInMeasurements)
contractorRouter.get('/contractor/download-csv-purchase-order-items', downloadCsvFile)

//quotation controller
contractorRouter.post('/contractor/create-quotation', verifyContractorToken, createQuotation)
contractorRouter.get('/contractor/get-quotation', verifyContractorToken, getQuotation)
contractorRouter.get('/contractor/get-quotation-by-id/:id', verifyContractorToken, getQuotationById)
contractorRouter.put('/contractor/update-quotation/:id', verifyContractorToken, updateQuotation)
contractorRouter.delete('/contractor/delete-quotation/:id', verifyContractorToken, deleteQuotation)
contractorRouter.post('/contractor/quotation-send-by-email', verifyContractorToken, sendEmailQuotation)
contractorRouter.post('/contractor/approve-rejected-quotation-by-id', verifyContractorToken, approveOrRejectQuotationsById)

//supplier controller
contractorRouter.post('/contractor/create-suppliers', verifyContractorToken, createSuppliers)
contractorRouter.get('/contractor/get-suppliers', verifyContractorToken, getSuppliers)
contractorRouter.get('/contractor/get-suppliers-by-id/:id', verifyContractorToken, getSuppliersById)
contractorRouter.put('/contractor/update-suppliers/:id', verifyContractorToken, updateSuppliers)
contractorRouter.delete('/contractor/delete-suppliers/:id', verifyContractorToken, deleteSuppliers)
contractorRouter.post('/contractor/approve-reject-suppliers-by-id', verifyContractorToken, approveOrRejectSuppliersById)

//----------------------------Measurement routes----------------------------

contractorRouter.post('/contractor/create-measurement', verifyContractorToken, createMeasurement);
contractorRouter.get('/contractor/get-all-measurements', verifyContractorToken, getAllCreatedMeasurements);
contractorRouter.get('/contractor/get-measurements-details/:id', verifyContractorToken, getMeasurementsDetailsById);
contractorRouter.post('/contractor/update-measurement-details', verifyContractorToken, updateMeasurementDetails);
contractorRouter.delete('/contractor/delete-measurements-details/:id', verifyContractorToken, deleteMeasurementDetails);
contractorRouter.get('/contractor/get-measurements-detail-by-po/:id', verifyContractorToken, measurementDetailsWithPoAndComplaint);
contractorRouter.get('/contractor/get-items-on-measurement-id/:id', verifyContractorToken, ItemsOnMeasurementId);
contractorRouter.get('/contractor/get-all-complaints-from-site', verifyContractorToken, getAllComplaintsFromSite)
contractorRouter.get('/contractor/get-complaints-to-details/:id', verifyContractorToken, getComplaintIdToDetails)
contractorRouter.post('/contractor/discard-measurement-details', verifyContractorToken, discardMeasurementDetails)
contractorRouter.get('/contractor/get-all-discard-measurements', verifyContractorToken, getAllDiscardMeasurements)
contractorRouter.get('/contractor/get-discard-measurements-details/:id', verifyContractorToken, getDiscardMeasurementsDetailsById)
contractorRouter.get('/contractor/get-resolved-complaint-in-billing', verifyContractorToken, getResolvedComplaintsInBilling)
contractorRouter.get('/contractor/get-measurment-details-by-status/:status', verifyContractorToken, getAllMeasurements)
contractorRouter.get('/contractor/get-all-measurements-based-on-status', verifyContractorToken, getAllMeasurementsBasedOnStatus)
contractorRouter.post('/contractor/save-measurements-details', verifyContractorToken, saveIntoDraftMeasurement)
contractorRouter.get('/contractor/get-all-outlets-in-ptm', verifyContractorToken, getOutletByIdForPtm)
contractorRouter.get('/contractor/get-all-regionals-in-ptm', verifyContractorToken, getRegionalByIdForPtm)
contractorRouter.get('/contractor/get-all-order-by-in-ptm', verifyContractorToken, getOrderByIdForPtm)
contractorRouter.get('/contractor/get-all-sale-in-ptm', verifyContractorToken, getSaleByIdNewForPtm)
contractorRouter.get('/contractor/get-all-outlet-in-billing', verifyContractorToken, getOutletByIdInsideBilling)
contractorRouter.get('/contractor/get-all-sales-in-billing', verifyContractorToken, getSalesByIdInsideBilling)
contractorRouter.get('/contractor/get-all-regional-in-billing', verifyContractorToken, getRegionalByIdInsideBilling)
contractorRouter.get('/contractor/get-all-order-by-for-measurements', verifyContractorToken, getAllOrderByForMeasurements)
contractorRouter.post('/contractor/reactive-to-discard-measurements', verifyContractorToken, discardToReactiveMeasurement)
contractorRouter.get('/contractor/get-same-purchase-order/:id', verifyContractorToken, getSimilarPurchaseOrders)
contractorRouter.get('/contractor/get-measurements-timeline-details/:id', verifyContractorToken, getMeasurementsTimeLineDetailsById);
contractorRouter.get('/contractor/get-po-details-by-ro', verifyContractorToken, getAllPoItem)
contractorRouter.post('/contractor/change-po-details-by-same-po', verifyContractorToken, updatePoInMeasurementDetails)
contractorRouter.get('/contractor/get-measurements-details-for-pdf/:id', getMeasurementsDetailsById)


// file attachment in billing measurement

contractorRouter.post('/contractor/files-upload-in-billing', verifyContractorToken, filesUploadInBilling)
contractorRouter.get('/contractor/get-pi-attachment-by-complaint-id/:complaint_id', verifyContractorToken, getPiAttachmentByComplaintId)
contractorRouter.get('/contractor/get-attachment-and-inspection-details/:id', verifyContractorToken, getAttachmentAndInspectionDetails)
contractorRouter.post('/contractor/update-pi-attachment-complaint', verifyContractorToken, updatePiAttachmentInBilling)


//financial year routes
contractorRouter.post('/contractor/create-financial-year', verifyContractorToken, createFinancialYears)
contractorRouter.put('/contractor/update-financial-year-by-id/:id', verifyContractorToken, updateFinancialYearById)
contractorRouter.get('/contractor/fetch-all-financial-years', verifyContractorToken, fetchAllFinancialYears)
contractorRouter.get('/contractor/fetch-financial-year-by-id/:id', verifyContractorToken, fetchFinancialYearById)
contractorRouter.delete('/contractor/delete-financial-year-by-id/:id', verifyContractorToken, deleteFinancialYearById)

//----------------------unit data routes------------------------
contractorRouter.post('/contractor/create-unit-data', verifyContractorToken, createUnitData)
contractorRouter.put('/contractor/update-unit-data-by-id/:id', verifyContractorToken, updateUnitDataById)
contractorRouter.get('/contractor/get-all-unit-data', verifyContractorToken, getAllUnitData)
contractorRouter.get('/contractor/get-unit-data-by-id/:id', verifyContractorToken, getUnitDataById)
contractorRouter.delete('/contractor/delete-unit-data-by-id/:id', verifyContractorToken, deleteUnitDataById);
contractorRouter.get('/contractor/get-all-unit-data-list', verifyContractorToken, getAllUnitDataForDropdown);


//-----------------------Billing types routes------------------------
contractorRouter.post('/contractor/create-billing-types', verifyContractorToken, createBillingType);
contractorRouter.get('/contractor/get-all-billing-types', verifyContractorToken, getAllBillingTypes);
contractorRouter.get('/contractor/get-single-billing-types/:id', verifyContractorToken, getBillingTypesById);
contractorRouter.post('/contractor/update-billing-types', verifyContractorToken, updateBillingType);
contractorRouter.delete('/contractor/delete-billing-type/:id', verifyContractorToken, removeBillingTypeById);


//------------------------tax information routes------------------------

contractorRouter.post('/contractor/create-tax', verifyContractorToken, createTaxDetails);
contractorRouter.get('/contractor/get-all-taxes', verifyContractorToken, getAllTaxes);
contractorRouter.get('/contractor/get-single-tax-details/:id', verifyContractorToken, getTaxesDetailById);
contractorRouter.post('/contractor/update-tax-details', verifyContractorToken, updateTaxDetails);
contractorRouter.delete('/contractor/delete-tax-details/:id', verifyContractorToken, removeTaxById);

//-----------------Proforma invoices route----------------
contractorRouter.post('/contractor/generate-proforma-invoice', verifyContractorToken, generateProformaInvoice);
contractorRouter.get('/contractor/get-all-proforma-invoices', verifyContractorToken, getAllProformaInvoices);
contractorRouter.get('/contractor/get-all-merged-proforma-invoice', verifyContractorToken, getAllMergedProformaInvoice);
contractorRouter.get('/contractor/get-single-proforma-invoice/:id', verifyContractorToken, getProformaInvoicesDetailsById);
contractorRouter.get('/contractor/get-merged-proforma-invoice/:id', verifyContractorToken, getMergedProformaInvoicesDetailsById);
contractorRouter.post('/contractor/update-proforma-invoice-details', verifyContractorToken, updateProformaInvoiceDetails);
contractorRouter.delete('/contractor/delete-proforma-invoice/:id', verifyContractorToken, deleteProformaInvoices);
contractorRouter.get('/contractor/get-all-pi-on-po-number/:po_id', verifyContractorToken, getAllProformaInvoiceOnPoId);
contractorRouter.get('/contractor/get-measurements-detail-po', verifyContractorToken, measurementDetailsWithPo);
contractorRouter.get('/contractor/get-multi-measurement', multiComplaints)
contractorRouter.get('/contractor/get-all-po-filters', verifyContractorToken, getAllPOFilters)
contractorRouter.get('/contractor/get-all-ro-filters', verifyContractorToken, getAllROBasedOnPo)
contractorRouter.get('/contractor/get-all-complaints-in-pi', verifyContractorToken, getAllComplaintsInPI)
contractorRouter.get('/contractor/get-measurements-in-pi-status', verifyContractorToken, getAllMeasurementsInPIStatus)
contractorRouter.get('/contractor/get-all-ro-based-on-complaint', verifyContractorToken, getAllROBasedOnComplaint)
contractorRouter.get('/contractor/get-all-po-from-proforma', verifyContractorToken, getAllPOForProforma);
contractorRouter.get('/contractor/get-all-ro-from-proforma', verifyContractorToken, getAllROFromProforma);
contractorRouter.get('/contractor/get-all-bill-number-from-proforma', verifyContractorToken, getAllBillNumberFromProforma);
contractorRouter.post('/contractor/discard-proforma-invoice/:id', verifyContractorToken, discardProformaInvoices)
contractorRouter.post('/contractor/reactive-to-discard-proforma-invoice/:id', verifyContractorToken, reactiveToDiscardPi)
contractorRouter.get('/contractor/ro-to-billing-from-company', verifyContractorToken, roToBillingFromCompany)
contractorRouter.get('/contractor/from-billing-to-company', verifyContractorToken, fromBillingToCompany)

// merged proforma invoice
contractorRouter.get('/contractor/get-all-pi-merged-performa', verifyContractorToken, getAllProformaInvoicesInMergedPI)
contractorRouter.get('/contractor/merged-proforma-invoice-list', verifyContractorToken, getMergedPiList)
contractorRouter.post('/contractor/discard-merged-pi', verifyContractorToken, discardMergedPI)
contractorRouter.post('/contractor/merged-proforma-invoice', verifyContractorToken, mergedPi)
contractorRouter.get('/contractor/merged-proforma-invoice-by-id/:id', verifyContractorToken, getMergedPerfomaInvoiceById)
contractorRouter.get('/contractor/get-all-listing-pi-and-mpi', verifyContractorToken, getAllProformaInvoicesInInvoice)
contractorRouter.post('/contractor/get-all-pi-listing', verifyContractorToken, getPiList)

//invoice data routes 

contractorRouter.post('/contractor/create-invoice-data', verifyContractorToken, createInvoiceData)
contractorRouter.post('/contractor/update-invoice-data', verifyContractorToken, updateInvoiceData)
contractorRouter.get('/contractor/get-all-invoice-data', verifyContractorToken, getAllInvoices);
contractorRouter.get('/contractor/get-single-invoice-details/:id', verifyContractorToken, getInvoiceDetailById);
contractorRouter.delete('/contractor/delete-invoice-details/:id', verifyContractorToken, deleteInvoiceData);
contractorRouter.post('/contractor/discard-invoice/:id', verifyContractorToken, discardInvoice)
contractorRouter.get('/contractor/get-all-invoice-in-payments', verifyContractorToken, getAllInvoicesListingInPayments)
// merge invoice

contractorRouter.post('/contractor/merge-invoice', verifyContractorToken, mergeInvoice)
contractorRouter.get('/contractor/get-all-merged-invoice', verifyContractorToken, getAllMergedInvoices)
contractorRouter.get('/contractor/get-merged-invoice-by-id/:id', verifyContractorToken, getMergedInvoiceDetailById)
contractorRouter.post('/contractor/discard-merged-invoice/:id', verifyContractorToken, discardMergedInvoice)
contractorRouter.get('/contractor/get-all-po-for-invoices', verifyContractorToken, getAllPOForInvoices)
contractorRouter.get('/contractor/get-all-ro-for-invoice', verifyContractorToken, getAllROForInvoices)
contractorRouter.get('/contractor/get-all-billing_from-company-invoice', verifyContractorToken, getAllBillNumberForInvoice)
contractorRouter.get('/contractor/get-all-billing-to-company-invoice', verifyContractorToken, fromBillingToCompanyInInvoice)
contractorRouter.get('/contractor/get-all-invoice-data-by-id/:id', verifyContractorToken, getMergedInvoiceDetailByIds)

//------------------Merge proforma invoices----------------
contractorRouter.post('/contractor/merge-pi-to-invoice/', verifyContractorToken, mergePItoInvoice);
contractorRouter.get('/contractor/get-ro-in-paid-payment', verifyContractorToken, getRegionalOfficeInPaidPayment)
contractorRouter.get('/contractor/get-area-manager-in-paid-payment', verifyContractorToken, getAreaManagerInPaidPayment)
contractorRouter.get('/contractor/get-po-in-paid-payment', verifyContractorToken, getPoNumberInPaidPayment)

// ------------------------ payment Received ------------------------

contractorRouter.post('/contractor/add-payment-to-invoice', verifyContractorToken, addPaymentReceive)
contractorRouter.get('/contractor/get-payment-received-by-status', verifyContractorToken, getAllPaymentReceive)
contractorRouter.get('/contractor/get-payment-received-by-id/:id', verifyContractorToken, getPaymentReceiveDetailsById)
contractorRouter.post('/contractor/update-payment-received-by-id', verifyContractorToken, updatePaymentReceive)
contractorRouter.get('/contractor/listing-pv-number', verifyContractorToken, listingOfPvNumber)
contractorRouter.post('/contractor/update-payment-retention', verifyContractorToken, updatePaymentReceiveInRetention)
contractorRouter.get('/contractor/get-payment-history', verifyContractorToken, getListingofPaymentHistory)



// ----------------------- payment Retention -----------------------
contractorRouter.get('/contractor/get-payment-received-in-retention-by-status', verifyContractorToken, getAllPaymentReceiveInPayment)
contractorRouter.get("/contractor/get-all-payment-retention", verifyContractorToken, getAllPaymentRetention);
contractorRouter.post("/contractor/update-payment-retention-status", verifyContractorToken, updatePaymentRetentionStatus);
contractorRouter.post("/contractor/approve-payment-retention", verifyContractorToken, approvePaymentRetention);
contractorRouter.post("/contractor/discard-payment-retention/:id", verifyContractorToken, discardPaymentRetention);
contractorRouter.post("/contractor/update-payment-amount-retention", verifyContractorToken, updatePaymentAmountRetention);
contractorRouter.get("/contractor/get-ro-for-dropdown", verifyContractorToken, getRoForDropdown);
contractorRouter.get("/contractor/get-payment-retention-by-id/:id", verifyContractorToken, getPaymentRetentionDetailsById)
contractorRouter.get("/contractor/get-po-for-payment-retention", verifyContractorToken, getPoForDropdown)
contractorRouter.get("/contractor/get-retention-id-for-dropdown", verifyContractorToken, getRetentinIdForDropdown)


//------------------------------------- Payment Setting routes--------------------------------
contractorRouter.post("/contractor/create-payment-setting", verifyContractorToken, addPaymentSetting);
contractorRouter.get("/contractor/get-all-payment-setting", verifyContractorToken, getAllPaymentSettings);
contractorRouter.get("/contractor/get-payment-setting-by-id/:id", verifyContractorToken, getPaymentSettingDetailsById);
contractorRouter.post("/contractor/update-payment-setting", verifyContractorToken, updatePaymentSetting);
contractorRouter.delete("/contractor/delete-payment-setting/:id", verifyContractorToken, deletePaymentSetting);
contractorRouter.get("/contractor/get-expense-punch-and-stock", verifyContractorToken, getExpensePunchAndStockTotalAmount);
contractorRouter.post("/contractor/payment-paid", verifyContractorToken, addPaymentPaid);
contractorRouter.post("/contractor/otp-verify-in-payment-paid", verifyContractorToken, otpVerifyInPaymentPaid)
contractorRouter.get("/contractor/get-all-area-manager-transactions", verifyContractorToken, getAreaManagerTransactions)
contractorRouter.get("/contractor/get-area-manager-transactions", verifyContractorToken, getAreaManagerTransactionsById)
contractorRouter.get("/contractor/get-payment-paid", verifyContractorToken, getPaymentPaid);
contractorRouter.get("/contractor/get-payment-paid-by-id/:id", verifyContractorToken, getPaymentPaidById);
contractorRouter.post("/contractor/resend-otp-in-payment-paid", verifyContractorToken, resendOtp)


//------------------------------------payment routes for ro paid--------------------------------

contractorRouter.post("/contractor/add-ro-payment-paid", verifyContractorToken, addPaymentPaidforRo)
contractorRouter.get("/contractor/get-ro-payment-paid", verifyContractorToken, getRoPaymentPaid)
contractorRouter.get("/contractor/get-ro-payment-paid-by-id/:id", verifyContractorToken, getPaymentPaidRoById)
contractorRouter.post('/contractor/update-ro-payment-paid', verifyContractorToken, updatePaymentRoPaid)
contractorRouter.get("/contractor/get-transactions-balance-of-ro", verifyContractorToken, roTransactions)
contractorRouter.get("/contractor/get-transactions-ro-by-id", verifyContractorToken, getRoTransactionsById)
contractorRouter.get("/contractor/get-po-details-in-ro-payments", verifyContractorToken, getRoPaymentPaidByPoDetails)
contractorRouter.get("/contractor/get-po-details-in-ro-payments-by-id/:id", verifyContractorToken, getPaymentPaidRoDetailsById)
contractorRouter.get("/contractor/get-transactions-balance-of-po", verifyContractorToken, poTransactions)
contractorRouter.get("/contractor/get-transactions-po-by-id", verifyContractorToken, getPoTransactionsById)

//------------------------------------manager promotional routes--------------------------------

contractorRouter.post("/contractor/add-promotional-manager", verifyContractorToken, createAreaManagerRatio);
contractorRouter.get("/contractor/get-all-promotional-manager", verifyContractorToken, getAllAreaManager);
contractorRouter.get("/contractor/get-promotional-manager/:id", verifyContractorToken, getAreaManagerById);
contractorRouter.post("/contractor/update-promotional-manager", verifyContractorToken, updateAreaManager);



//-------------------------Company details routes------------------------
contractorRouter.get('/contractor/get-all-company-details', verifyContractorToken, getAllCompanyForDropdown);
contractorRouter.get('/contractor/get-company-details-by-company-id/:id', verifyContractorToken, getCompanyDetailsById);
contractorRouter.post('/contractor/get-complaints-to-company-details', verifyContractorToken, getComplaintName)

//-------------------------Regional office routes------------------------
contractorRouter.get('/contractor/get-all-regional-office-details', verifyContractorToken, getAllRegionalOfficeForDropdown);

//-------------------------State routes------------------------
contractorRouter.get('/contractor/get-all-state-details', verifyContractorToken, getAllStateForDropdown);
contractorRouter.get('/contractor/get-all-po-details', verifyContractorToken, getAllPurchaseOrder);
contractorRouter.get('/contractor/get-all-complaint-types', verifyContractorToken, getComplaintType);
contractorRouter.get('/contractor/get-outlet-by-sale-area/:id', verifyContractorToken, getOutletBySaleArea);
contractorRouter.post('/contractor/upload-image-with-watermark', verifyContractorToken, uploadImageWithWaterMark);
contractorRouter.post('/contractor/upload-image-in-base-64', verifyContractorToken, convertBase64Image);

//---------------------Security money routes--------------------------------

contractorRouter.post('/contractor/add-security-money', verifyContractorToken, addSecurityMoney);
contractorRouter.get('/contractor/get-all-security-money-list', verifyContractorToken, getAllSecurityMoney);
contractorRouter.get('/contractor/get-security-money-details/:id', verifyContractorToken, getSecurityMoneyDetailById);
contractorRouter.post('/contractor/update-security-money-details', verifyContractorToken, updateSecurityMoney);
contractorRouter.delete('/contractor/delete-security-money-details/:id', verifyContractorToken, deleteSecurityMoneyDetailById);


//---------------------category routes------------------------
contractorRouter.post('/contractor/create-category', verifyContractorToken, createCategory);
contractorRouter.get('/contractor/get-all-category', verifyContractorToken, getAllCategory);
contractorRouter.get('/contractor/get-category-detail/:id', verifyContractorToken, getCategoryDetailById);
contractorRouter.post('/contractor/update-category-detail', verifyContractorToken, updateCategory);
contractorRouter.delete('/contractor/delete-category-detail/:id', verifyContractorToken, deleteCategoryById);


//----------------------Product routes--------------------------------
contractorRouter.post('/contractor/product-add', verifyContractorToken, addProduct);
contractorRouter.get('/contractor/product-list', verifyContractorToken, getAllProducts);
contractorRouter.get('/contractor/product-detail/:id', verifyContractorToken, getProductDetailById);
contractorRouter.post('/contractor/product-detail-update', verifyContractorToken, updateProduct);
contractorRouter.delete('/contractor/delete-product/:id', verifyContractorToken, removedProductById);
contractorRouter.post('/contractor/product-publish-status-update', verifyContractorToken, publishedProduct);

//------------------------Cash Request routes------------------------
contractorRouter.post('/contractor/request-cash', verifyContractorToken, requestCash);
contractorRouter.get('/contractor/get-all-logged-user-cash-requested', verifyContractorToken, getAllLoggedUserCashRequested);
contractorRouter.get('/contractor/get-cash-requested-detail/:id', verifyContractorToken, getCashRequestedDetailById);
contractorRouter.post('/contractor/update-cash-requested-detail', verifyContractorToken, updatedRequestedCashDetail);
contractorRouter.delete('/contractor/delete-cash-request/:id', verifyContractorToken, deleteRequestedCashDetail);
contractorRouter.post('/contractor/update-cash-request-status', verifyContractorToken, cashRequestStatusAction);
contractorRouter.get('/contractor/get-all-cash-requested-list', verifyContractorToken, getAllCashRequestedList);
contractorRouter.get('/contractor/get-all-approved-cash-request-list', verifyContractorToken, getAllApprovedCashRequest);
contractorRouter.get('/contractor/get-all-rejected-cash-request-list', verifyContractorToken, getAllRejectedCashRequest);

//-------------------------Payment Methods routes------------------------
contractorRouter.post('/contractor/add-payment-method', verifyContractorToken, addPaymentMethod);
contractorRouter.get('/contractor/get-all-payment-methods', verifyContractorToken, getAllMethods);
contractorRouter.get('/contractor/get-all-payment-methods-for-dropdown', verifyContractorToken, getAllMethodsForDropdown);
contractorRouter.delete('/contractor/delete-payment-methods/:id', verifyContractorToken, deleteMethod);
contractorRouter.get('/contractor/get-single-payment-method-details/:id', verifyContractorToken, getMethodDetailById);
contractorRouter.post('/contractor/update-payment-method', verifyContractorToken, updatePaymentMethod);


//-------------------------Expense category routes------------------------
contractorRouter.post('/contractor/add-expense-category', verifyContractorToken, addExpenseCategory);
contractorRouter.post('/contractor/update-expense-category', verifyContractorToken, updateExpenseCategory);
contractorRouter.get('/contractor/get-expense-category/:id', verifyContractorToken, fetchExpenseCategory);
contractorRouter.get('/contractor/get-expense-category-for-dropdown', verifyContractorToken, getExpenseCategoryForDropdown);
contractorRouter.get('/contractor/get-all-expense-category', verifyContractorToken, getExpenseCategory);
contractorRouter.delete('/contractor/delete-expense-category/:id', verifyContractorToken, deleteExpenseCategory);

//------------------------Expense cash routes------------------------
contractorRouter.post('/contractor/add-expense-cash', verifyContractorToken, addExpenses);
contractorRouter.get('/contractor/get-all-logged-user-expenses', verifyContractorToken, getLoggedUserAllExpenses);
contractorRouter.get('/contractor/get-expense-details/:id', verifyContractorToken, getExpensesDetailById);
contractorRouter.post('/contractor/update-expense-details', verifyContractorToken, updateExpenses);
contractorRouter.delete('/contractor/delete-expense-details/:id', verifyContractorToken, deleteExpense);
contractorRouter.post('/contractor/approve-reject-expense-details', verifyContractorToken, expenseApproveReject);
contractorRouter.get('/contractor/get-all-requested-expenses', verifyContractorToken, viewRequestedExpenses)
contractorRouter.get('/contractor/get-all-expense-request-by-month', verifyContractorToken, getExpenseRequest)
contractorRouter.get('/contractor/get-all-expense-request-by-id/:id', verifyContractorToken, getExpenseRequestById)
contractorRouter.get('/contractor/get-approve-item-price/:id/:request_by', verifyContractorToken, itemsMasterToApprovePrice)

//--------------------Transaction report routes------------------------
contractorRouter.get('/contractor/user-all-transaction-report', verifyContractorToken, getUserAllTransaction);

//------------------Fund management routes------------------------
contractorRouter.post('/contractor/add-fund-user-wallet', verifyContractorToken, addFundtoUser);
contractorRouter.get('/contractor/get-user-wallet-balance', verifyContractorToken, userWalletBalance);
contractorRouter.get('/contractor/get-user-transaction-monthly', verifyContractorToken, userTransactionMonthlyReport);
contractorRouter.get('/contractor/get-cash-request-status-tracked', verifyContractorToken, cashRequestTracked);
contractorRouter.get('/contractor/get-user-transaction-history', verifyContractorToken, userTransactionHistory);
contractorRouter.get('/contractor/get-user-assets-and-funds-report', verifyContractorToken, getUserAssetAndFundMonthlyReport);
contractorRouter.post('/contractor/request-item', verifyContractorToken, requestItems);
contractorRouter.get('/contractor/get-all-request-item-list', verifyContractorToken, getAllRequestedItemList);
contractorRouter.get('/contractor/get-single-request-item-details/:id', verifyContractorToken, getRequestedItemDetailById);
contractorRouter.post('/contractor/update-requested-item-details', verifyContractorToken, updateRequestItemsDetails);
contractorRouter.delete('/contractor/delete-request-item/:id', verifyContractorToken, deleteRequestedItemById);
contractorRouter.post('/contractor/update-requested-item-status', verifyContractorToken, requestStatusChanged);
contractorRouter.get('/contractor/get-all-approved-items-request-list', verifyContractorToken, getAllApprovedRequestedItemList);
contractorRouter.get('/contractor/get-all-rejected-items-request-list', verifyContractorToken, getAllRejectedRequestedItemList);
contractorRouter.get('/contractor/get-user-transaction/:user_id', verifyContractorToken, getUserTransactionHistory)


contractorRouter.post('/contractor/assigned-approved-items-request-to-user', verifyContractorToken, approvedItemRequestAssignTo);
contractorRouter.get('/contractor/get-single-approved-item-detail/:id', verifyContractorToken, getApprovedRequestDetailById);

//-------------------Earthing testing routes----------------
contractorRouter.get('/contractor/get-all-complaint-list', verifyContractorToken, getAllComplaintList);
contractorRouter.get('/contractor/get-complaint-details/:id', verifyContractorToken, getComplaintDetailById);
contractorRouter.get('/contractor/get-outlet-list', verifyContractorToken, getOutletDetails);
contractorRouter.get('/contractor/get-end-user-details', verifyContractorToken, getFreeEndUsers);
contractorRouter.post('/contractor/add-earthing-testing-report', verifyContractorToken, createEarthingTesting);
contractorRouter.get('/contractor/get-earthing-testing-lists', verifyContractorToken, getAllEarthingTestingLists);
contractorRouter.get('/contractor/get-earthing-testing-detail/:id', verifyContractorToken, getEarthingTestingDetailById);
contractorRouter.post('/contractor/update-earthing-testing-detail', verifyContractorToken, updateEarthingTesting);
contractorRouter.post('/contractor/change-earthing-testing-status', verifyContractorToken, changeEarthingTestingStatus);
contractorRouter.put('/contractor/approve-reject-earthing-testing-by-status', verifyContractorToken, approveRejectEarthingTestingsByStatus)
contractorRouter.post('/contractor/assign-earthing-testing', verifyContractorToken, assignToEarthingTesting)
contractorRouter.post("/contractor/earth-pit-reports", verifyContractorToken, earthPitReport)
contractorRouter.get("/contractor/get-earth-pit-reports", verifyContractorToken, getEarthPitreport)

//---------------------Office inspections--------------------------------
contractorRouter.get('/contractor/get-all-outlet-and-sale-area-list/:id', verifyContractorToken, getAllSaleAreaAndOutlet);
contractorRouter.get('/contractor/get-all-complaints-on-outlet/:outlet_id', verifyContractorToken, getOutletComplaints);
contractorRouter.get('/contractor/get-all-approved-used-items-on-complaint/:complaint_id', verifyContractorToken, getApprovedUsedItemsOnComplaint);
contractorRouter.get('/contractor/get-all-pending-used-items-on-complaint/:complaint_id', verifyContractorToken, getPendingUsedItemsOnComplaint);
contractorRouter.post('/contractor/approved-used-items-on-complaint/:id', verifyContractorToken, approvedUsedItems);
contractorRouter.get('/contractor/get-all-approved-expense-list', verifyContractorToken, getAllApprovedExpenseList);
contractorRouter.post('/contractor/approve-expense-from-office/:id', verifyContractorToken, approvedExpensesFromOffice);
contractorRouter.get('/contractor/get-all-office-approved-expense-list', verifyContractorToken, getAllApprovedOfficeExpenseList);
contractorRouter.get('/contractor/get-sales-area-list', verifyContractorToken, getAllSaleAreaList)
contractorRouter.post('/contractor/assign-approved-complaint-items', verifyContractorToken, assignApprovedItems);
contractorRouter.post('/contractor/assign-approved-complaint-expense', verifyContractorToken, assignApprovedExpense);
contractorRouter.get('/contractor/get-all-outlet-with-complaints', verifyContractorToken, getAllOutletsWithComplaints);
contractorRouter.get('/contractor/get-all-outlet-with-complaints-by-id/:id/:month', verifyContractorToken, getAllOutletsWithComplaintsById);


//---------------------Office inspections for fund --------------------------------
contractorRouter.get('/contractor/get-all-outlet-with-complaints-funds', verifyContractorToken, getAllOutletsWithComplaintsForFunds);
contractorRouter.get('/contractor/get-all-outlet-with-complaints-funds-by-id/:id/:month', verifyContractorToken, getAllOutletsWithComplaintsForFundsById);
contractorRouter.get('/contractor/fund-office-expense-partial-by-office', verifyContractorToken, getAllOutletsWithComplaintsPartialForFunds)
contractorRouter.post('/contractor/fund-punch-approve-by-office', verifyContractorToken, approveOfficeInspectionsForFund)
contractorRouter.get('/contractor/fund-office-expense-approved-by-office', verifyContractorToken, getAllOutletsWithComplaintsApprovedForFund)
contractorRouter.get('/contractor/get-office-approved_fund-by-id/:id/:month', verifyContractorToken, getAllOutletsWithComplaintsForFundByApprovedId)
contractorRouter.get('/contractor/get-fund-office-partial-by-id/:id/:month', verifyContractorToken, getAllOutletsWithComplaintsForFundByPartialId)
contractorRouter.get('/contractor/get-outlet-office-by-id-for-fund/', verifyContractorToken, getOutletOfficeByIdForFund)
contractorRouter.get('/contractor/get-sales-area-office-by-id-for-fund', verifyContractorToken, getSalesAreaOfficeByIdForFund)
contractorRouter.get('/contractor/get-regional-office-expense-by-id-for-fund', verifyContractorToken, getRegionalOfficeExpenseByIdForFund)

//----------------------Stock punch routes for office inspection------------------------
contractorRouter.get('/contractor/get-all-punch-stocks/:id/:status', verifyContractorToken, getAllStockPunchedList);
contractorRouter.get('/contractor/get-single-punch-stocks-details/:id/:status', verifyContractorToken, getSingleStockPunchedDetails);
contractorRouter.post('/contractor/approved-punch-stocks-details/:id', verifyContractorToken, approvedPunchedStockDetails);
contractorRouter.post('/contractor/assigned-complaint-item-punch-stocks', verifyContractorToken, assignApprovedItemStock);
contractorRouter.post('/contractor/approve-stock-punch-quantity', verifyContractorToken, approveStockPunch)
contractorRouter.get('/contractor/get-all-approve-stock-punch', verifyContractorToken, getAllApproveStockPunchList)
contractorRouter.get('/contractor/get-all-approve-stock-punch-by-id/:id/:complaint_id', verifyContractorToken, getAllApproveStockPunchListById)
contractorRouter.get('/contractor/get-user-stock-items-lists/:id', verifyContractorToken, stockItemList)


//----------------------Site inspection routes------------------------
contractorRouter.post('/contractor/verified-used-items-on-site-inspector/:id', verifyContractorToken, verifiedUsedItems);
contractorRouter.get('/contractor/get-all-verified-complaint-items', verifyContractorToken, getAllVerifiedComplaintItems);
contractorRouter.post('/contractor/verified-complaint-expense/:id', verifyContractorToken, verifiedExpensesFromSite);
contractorRouter.get('/contractor/verified-complaint-expense-list', verifyContractorToken, getAllVerifiedSiteExpenseList);
contractorRouter.post('/contractor/assign-approved-site-inspection-stocks', verifyContractorToken, assignSiteInspectionComplaintModule);
contractorRouter.get('/contractor/get-assigned-site-inspection-stocks/:id', verifyContractorToken, getSiteInspectionAssignComplaintModuleOnUserId);
contractorRouter.post('/contractor/assign-multiple-inspection-stocks', verifyContractorToken, assignMultipleSiteInspectionComplaintModule);
contractorRouter.post('/contractor/assign-complaints-in-site-inspection', verifyContractorToken, assignComplaints)
contractorRouter.get('/contractor/get-all-site-inspections', verifyContractorToken, getAllSiteInspection)


// site inspection for site stock
contractorRouter.post('/contractor/approved-site-inspections', verifyContractorToken, approveSiteInspections)
contractorRouter.get('/contractor/get-partial-site-inspections', verifyContractorToken, getAllSiteInspectionPartial)
contractorRouter.get('/contractor/get-approved-site-inspections', verifyContractorToken, getAllSiteInspectionApproved)
contractorRouter.get('/contractor/get-site-inspections-by-id/:id/:month', verifyContractorToken, getAllSiteInspectionById)
contractorRouter.get('/contractor/get-site-inspections-partial-by-id/:id/:month', verifyContractorToken, getAllSiteInspectionPartialById)
contractorRouter.get('/contractor/get-site-inspections-approved-by-id/:id/:month', verifyContractorToken, getAllSiteInspectionApprovedById)
contractorRouter.get('/contractor/get-office-outlet', verifyContractorToken, getOutletOfficeById)
contractorRouter.get('/contractor/get-office-sales-area', verifyContractorToken, getSalesAreaOfficeById)
contractorRouter.get('/contractor/get-office-regional-list', verifyContractorToken, getRegionalOfficeExpenseById)


// site inspection for funds 

contractorRouter.get('/contractor/get-pending-site-complaints-for-funds', verifyContractorToken, getAllOutletsWithComplaintsSiteForFunds)
contractorRouter.get('/contractor/get-pending-site-complaints-for-funds-id/:id/:month', verifyContractorToken, getOutletsWithComplaintsSiteForFundsById)
contractorRouter.get('/contractor/get-partial-site-complaints-for-funds', verifyContractorToken, getAllPendingOutletsWithComplaintsSiteForFunds)
contractorRouter.get('/contractor/get-approved-site-complaints-for-funds', verifyContractorToken, getAllApprovedOutletsWithComplaintsSiteForFunds)
contractorRouter.get('/contractor/get-partial-site-complaints-for-funds-id/:id/:month', verifyContractorToken, getPartialOutletsSiteForFundsById)
contractorRouter.get('/contractor/get-approved-site-complaints-for-funds-id/:id/:month', verifyContractorToken, getApprovedOutletsSiteForFundsById)

// site inspection for site fund
contractorRouter.post('/contractor/approve-site-inspection-for-fund', verifyContractorToken, approveSiteInspectionsForFund)
contractorRouter.get('/contractor/get-all-approved-data/:complaintId', verifyContractorToken, getAllApprovedData)
contractorRouter.post('/contractor/assign-complaints-in-fund-site-inspection', verifyContractorToken, assignComplaintsForFundSite)


//-------------------------import  bank data------------------------
contractorRouter.post('/contractor/import-bank-details', verifyContractorToken, importBankDetailData);
contractorRouter.post('/contractor/get-specific-columns-value-from-csv', verifyContractorToken, getSpecificColumnValueFromCsv);


//-------------------------banks routes------------------------
contractorRouter.get('/contractor/get-all-bank-list', verifyContractorToken, getAllBankList);
contractorRouter.post('/contractor/add-bank-details', verifyContractorToken, addBankDetails);
contractorRouter.get('/contractor/get-bank-list', verifyContractorToken, bankList);
contractorRouter.get('/contractor/get-bank-details/:id', verifyContractorToken, bankDetailsById);
contractorRouter.post('/contractor/update-bank-details', verifyContractorToken, updateBankDetails);

//-------------------------Assign complaint module routes------------------------
contractorRouter.post('/contractor/assign-complaint-module-to-user', verifyContractorToken, assignComplaintModule);
contractorRouter.get('/contractor/get-assign-complaint-module-by-user/:id', verifyContractorToken, getAssignComplaintModuleOnUserId);
contractorRouter.post('/contractor/assign-multiple-complaint-module-to-user', verifyContractorToken, assignMultipleComplaintModule);

//-------------------------Upload complaint images routes-------------------------

contractorRouter.post('/contractor/upload-complaint-images', verifyContractorToken, uploadComplaintImages);
contractorRouter.get('/contractor/get-all-uploaded-complaint-images', verifyContractorToken, getAllUploadedImages);
contractorRouter.get('/contractor/get-single-uploaded-complaint-images/:id', verifyContractorToken, getSingleUploadedImagesById);
contractorRouter.post('/contractor/update-uploaded-complaint-images', verifyContractorToken, updateComplaintImages);
contractorRouter.delete('/contractor/delete-uploaded-complaint-images/:id', verifyContractorToken, deleteComplaintWorkImages);
contractorRouter.get('/contractor/domplaint-images-prepare-ppt/:id', verifyContractorToken, getComplaintImagesForPPT);
contractorRouter.put('/contractor/approve-reject-complaint-images-by-status', verifyContractorToken, approveRejectComplaintImagesByStatus)

//--------------------------Stocks routes------------------------
contractorRouter.get('/contractor/get-all-items-stocks-report', verifyContractorToken, getAllItemStockReport);
contractorRouter.get('/contractor/get-item-stock-distribution-report/:id', verifyContractorToken, getItemDistributeReport);
contractorRouter.post('/contractor/stock-transfer', verifyContractorToken, stockTransfer);
contractorRouter.post('/contractor/new-stock-transfer', verifyContractorToken, newStockTransfer)
contractorRouter.get('/contractor/stock-punch-get-approve-item-price/:id/:request_by', verifyContractorToken, stockPunchItemsMasterToApprovePrice)
contractorRouter.get('/contractor/get-stock-quantity-transfer', verifyContractorToken, getStockTransferQunatity)
contractorRouter.get('/contractor/get-stock-quantity-transfer-by-id/:transfered_by/:transfered_to', verifyContractorToken, getStockTransferQuantityById)


//--------------------------Assets Routes--------------------------
contractorRouter.post('/contractor/add-new-assets', verifyContractorToken, createAssets);
contractorRouter.get('/contractor/get-all-stored-assets', verifyContractorToken, getAllStoredAssets);
contractorRouter.get('/contractor/get-stored-assets-details/:id', verifyContractorToken, getSingleStoredAssetDetails);
contractorRouter.post('/contractor/update-stored-assets', verifyContractorToken, updateStoredAssetDetails);
contractorRouter.delete('/contractor/delete-stored-assets/:id', verifyContractorToken, deleteAssets);
contractorRouter.post('/contractor/assigned-asset-to-user', verifyContractorToken, assignAssetToUsers);
contractorRouter.get('/contractor/get-all-assigned-asset-to-users', verifyContractorToken, getAllAssignedAssets);
contractorRouter.put('/contractor/approve-reject-assets-by-status', verifyContractorToken, approveRejectAssetsByStatusAndById)
contractorRouter.post('/contractor/repair-assets', verifyContractorToken, createAssetsRepairRequest)
//-------------------------Idle assets routes------------------------
contractorRouter.get('/contractor/gat-all-idle-asset-list', verifyContractorToken, getAllIdleAssets);

//--------------------------Assets timeline routes------------------------
contractorRouter.get('/contractor/get-assets-timeline-history/:id', verifyContractorToken, getAssetTimelineHistory);
contractorRouter.get('/contractor/get-assets-with-timeline-history/:id', verifyContractorToken, getAssetWithTimelineHistory);

//--------------------------Assets repair require routes------------------------
contractorRouter.post('/contractor/request-asset-repair', verifyContractorToken, createRepairRequest);
contractorRouter.get('/contractor/get-all-repair-requested-asset-list', verifyContractorToken, getAllRepairRequestedAssetList);
contractorRouter.get('/contractor/get-single-repair-requested-details/:id', verifyContractorToken, getSingleRepairRequestedAssetListDetails);
contractorRouter.post('/contractor/update-repair-requested-details', verifyContractorToken, updateRepairRequestDetails);
contractorRouter.delete('/contractor/delete-repair-requested-details/:id', verifyContractorToken, deleteRepairRequest);
contractorRouter.get('/contractor/get-all-assigned-assets', verifyContractorToken, getAllAssignedAssetList);
contractorRouter.post('/contractor/mark-request-viewed/:id', verifyContractorToken, markRequestViewed);
contractorRouter.post('/contractor/assign-asset-repair-request', verifyContractorToken, AssignedRequest);

//----------------------------Tutorials routes----------------------------
contractorRouter.post('/contractor/create-tutorial', verifyContractorToken, createTutorial);
contractorRouter.get('/contractor/get-all-tutorials', verifyContractorToken, getTutorials);
contractorRouter.get('/contractor/get-single-tutorial-details/:format', verifyContractorToken, getTutorialByFormat);
contractorRouter.post('/contractor/update-tutorial-details', verifyContractorToken, updateTutorials);
contractorRouter.delete('/contractor/delete-tutorial/:id', verifyContractorToken, deleteTutorialsById);
contractorRouter.get('/contractor/get-tutorial-by-id/:id', verifyContractorToken, getTutorialById)

//-----------------------------Company contacts routes-----------------------------
contractorRouter.post('/contractor/store-company-contact-details', verifyContractorToken, createContacts);
contractorRouter.get('/contractor/get-all-stored-company-contact-details', verifyContractorToken, getAllStoredContacts);
contractorRouter.get('/contractor/get-stored-company-contact-details/:id', verifyContractorToken, getStoredContactDetailById);
contractorRouter.post('/contractor/update-stored-company-contact-details', verifyContractorToken, updateContacts);
contractorRouter.delete('/contractor/delete-company-contact-details/:id', verifyContractorToken, deleteContactDetailById);
contractorRouter.get('/contractor/get-all-stored-company-contact-positions', verifyContractorToken, getAllPositionOfCompanyContacts);

//-----------------------------Holidays CRUD routes-----------------------------
contractorRouter.post('/contractor/create-holiday-list', verifyContractorToken, createHolidayList);
contractorRouter.get('/contractor/get-all-holiday-list', verifyContractorToken, getAllHolidayList);
contractorRouter.get('/contractor/get-holiday-details/:id', verifyContractorToken, getHolidayDetailById);
contractorRouter.post('/contractor/update-holiday-list', verifyContractorToken, updateHolidayList);
contractorRouter.delete('/contractor/delete-holiday-list/:id', verifyContractorToken, deleteHolidayList);
contractorRouter.get('/contractor/get-holiday-list-of-months', verifyContractorToken, getHolidayListOfMonth);
contractorRouter.get('/contractor/get-today-birthday-list', verifyContractorToken, getTodayBirthdayList);
contractorRouter.get('/contractor/get-upcoming-holiday-list', verifyContractorToken, getUpcomingHolidays)
//------------------------------Reports routes------------------------------
contractorRouter.get('/contractor/reports/get-all-modules', verifyContractorToken, getAllModules);
contractorRouter.post('/contractor/reports/get-module-columns', verifyContractorToken, getTableNameColumnNameOnModuleId);
contractorRouter.post('/contractor/reports/generate-report', verifyContractorToken, generateReport);
contractorRouter.post('/contractor/reports/generate-dynamic-query', verifyContractorToken, makeDynamicQuery);


// -------------------------------- order via routes --------------------------
contractorRouter.post('/contractor/create-order', verifyContractorToken, createOrder);
contractorRouter.post('/contractor/update-order', verifyContractorToken, updateOrder);
contractorRouter.get('/contractor/get-all-order', verifyContractorToken, getAllData);
contractorRouter.get('/contractor/get-order-by-id/:id', verifyContractorToken, getOrderById);
contractorRouter.delete('/contractor/delete-order/:id', verifyContractorToken, deleteOrderById);
contractorRouter.get('/contractor/get-all-order-pagination', verifyContractorToken, getAllOrderWithPagination);

//-----------------------------------Stock punch expense punch---------------------------   -----------------------------
contractorRouter.post('/contractor/stock-punch', verifyContractorToken, stockPunch);
contractorRouter.get('/contractor/get-all-stock-punch-list', verifyContractorToken, getAllStockPunchList);
contractorRouter.get('/contractor/get-stock-punch-details/:id/:complaint_id', verifyContractorToken, getStockPunchById);
contractorRouter.post('/contractor/add-expense-punch', verifyContractorToken, addExpensePunch);
contractorRouter.post('/contractor/verify-stock-punch', verifyContractorToken, verifyStockPunchOtp);
contractorRouter.get('/contractor/get-all-expense-punch-list', verifyContractorToken, getAllExpensePunchList);
contractorRouter.get('/contractor/get-expense-punch-details/:id/:user_id', verifyContractorToken, getExpensePunchById);
contractorRouter.get('/contractor/get-expense-check-and-approve', verifyContractorToken, getAllCheckAndApprove)
contractorRouter.post('/contractor/update-approve-qty', verifyContractorToken, updateExpensePunch)
contractorRouter.get('/contractor/get-list-expense-punch-approve', verifyContractorToken, getListExpensePunchApprove)
contractorRouter.get('/contractor/get-list-expense-punch-approve_according_to_items', verifyContractorToken, getListExpensePunchApproveAccordingToItems)
contractorRouter.get('/contractor/get-stock-request-month-wise', verifyContractorToken, getStockRequest)
contractorRouter.get('/contractor/get-all-stock-request-by-id/:id', verifyContractorToken, getStockRequestById)
contractorRouter.get('/contractor/get-user-stock-items/:id', verifyContractorToken, getUserStockItems)
contractorRouter.get('/contractor/get-user-fund-items-lists/:id', verifyContractorToken, fundItemLists)

// office inspection stock
contractorRouter.post('/contractor/stock-punch-approve-by-office', verifyContractorToken, approveOfficeInspections)
contractorRouter.get('/contractor/stock-office-expense-approved-by-office', verifyContractorToken, getAllOutletsWithComplaintsApproved)
contractorRouter.get('/contractor/get-office-approved-by-id/:id/:month', verifyContractorToken, getAllOutletsWithComplaintsByApprovedId)
contractorRouter.get('/contractor/stock-office-expense-partial-by-office', verifyContractorToken, getAllOutletsWithComplaintsPartial)
contractorRouter.get('/contractor/get-stock-office-partial-by-id/:id/:month', verifyContractorToken, getAllOutletsWithComplaintsByPartialId)
contractorRouter.get('/contractor/get-po-exists-or-not', verifyContractorToken, getSamePoExistsOrNot)

//-------------------------------------Gst Masters routes--------------------------------
contractorRouter.post('/contractor/save-gst-details', verifyContractorToken, createGstMasters);
contractorRouter.get('/contractor/get-all-saved-gst-masters', verifyContractorToken, getAllGstMasterData);
contractorRouter.get('/contractor/get-saved-gst-details/:id', verifyContractorToken, getGstMasterDetailsById);
contractorRouter.post('/contractor/update-gst-details', verifyContractorToken, updateGstMasters);
contractorRouter.delete('/contractor/delete-gst-details/:id', verifyContractorToken, deleteGstMasterDetailsById);
contractorRouter.get('/contractor/get-gst-on-state-id/:id', verifyContractorToken, getGstDetailsOnStateId);
contractorRouter.get('/contractor/get-all-gst-list', verifyContractorToken, getAllGstMasterDataForDropdown);

//---------------------------Assign manager and supervisor and free end users list--------------------------------
contractorRouter.get('/contractor/get-all-manager-list-with-total-free-end-users', verifyContractorToken, getALLmanagersWIthTeamMembers);
contractorRouter.get('/contractor/get-all-supervisor-by-manager-with-count-free-end-users/:id', verifyContractorToken, getSuperVisorOnManagerId);
contractorRouter.get('/contractor/get-all-end-users-by-supervisor/:id', verifyContractorToken, getFreeEndUsersOnSuperVisorId);
contractorRouter.get('/contractor/get-area-manager-of-user/:id', verifyContractorToken, getAreaManagerOfUser);
// contractorRouter.get('/contractor/get-assign-user-manager-and-supervi    sor/:complaintId', verifyContractorToken, getComplaintAssignUserManagerAndSupervisor);
contractorRouter.get('/contractor/get-all-users/:role_id', verifyContractorToken, getALLSupervisors)


//---------------------------Food expenses routes------------------------
contractorRouter.get('/contractor/get-food-expense', verifyContractorToken, getFoodExpenses);
contractorRouter.post('/contractor/set-food-expense-limit', verifyContractorToken, setFoodExpenseMaxLimit);
contractorRouter.post('/contractor/punch-food-expense', verifyContractorToken, punchFoodExpense);

//---------------------------Invoice number format routes------------------------
contractorRouter.post('/contractor/generate-invoice-number-format', verifyContractorToken, createInvoiceNumberFormat);
contractorRouter.get('/contractor/get-all-generate-invoice-formats', verifyContractorToken, getAllGeneratedInvoiceFormat);
contractorRouter.get('/contractor/get-invoice-number-format-details/:id', verifyContractorToken, getAllGeneratedInvoiceFormatById);
contractorRouter.post('/contractor/update-invoice-number-format', verifyContractorToken, updateInvoiceNumberFormat);
contractorRouter.delete('/contractor/delete-invoice-number-format-details/:id', verifyContractorToken, deleteGeneratedInvoiceFormatById);
contractorRouter.get('/contractor/get-all-complaints-via-invoice', verifyContractorToken, getAllComplaintViaInvoice)
contractorRouter.get('/contractor/get-all-complaints-by-id', verifyContractorToken, getAllComplaintViaInvoiceById)
contractorRouter.get('/contractor/get-all-complaints-via-invoice-ro', verifyContractorToken, getAllComplaintViaInvoiceForRo)

// hr employee import
contractorRouter.post('/contractor/import-data', verifyContractorToken, importData);
contractorRouter.post('/contractor/import-user-data/:id', verifyContractorToken, importUserData);

// get module list by logged user plan id
contractorRouter.get('/contractor/get-logged-module-list-plan', verifyContractorToken, getModuleByPlanId);
contractorRouter.post('/Contractor/register-employee-resignation', verifyContractorToken, registerResignation)


//loans modules
contractorRouter.post('/contractor/create-loans', verifyContractorToken, createLoan);
contractorRouter.get('/contractor/get-all-loans-pending', verifyContractorToken, getAllLoanRequests);
contractorRouter.get('/contractor/get-all-loans-active', verifyContractorToken, getAllActiveLoan)
contractorRouter.get('/contractor/get-all-loans-reject', verifyContractorToken, getAllRejectedLoan)
contractorRouter.get('/contractor/get-all-loans-closed', verifyContractorToken, getAllClosedLoan)
contractorRouter.get('/contractor/get-loan-details/:id', verifyContractorToken, getLoanDetailById)
contractorRouter.post('/contractor/update-loan-details', verifyContractorToken, updateLoanDetails)
contractorRouter.post('/contractor/changed-loan-status', verifyContractorToken, updateLoanStatus)
contractorRouter.post('/contractor/delete-loan-details/:id', verifyContractorToken, deleteLoanDetailById)

// outlets

contractorRouter.post("/contractor/add-outlet", verifyContractorToken, addOutlet);
contractorRouter.get("/contractor/all-outlets", verifyContractorToken, getAllOutlet);
contractorRouter.get("/contractor/get-outlet/:id", verifyContractorToken, getOutletById);
contractorRouter.get("/contractor/edit-outlet/:id", verifyContractorToken, editOutlet);
contractorRouter.post("/contractor/update-outlet", verifyContractorToken, updateOutlet);
contractorRouter.post("/contractor/approve-reject-outlet-by-id", verifyContractorToken, approveRejectOutletByStatus);
contractorRouter.delete("/contractor/delete-outlet/:id", verifyContractorToken, removeOutletById);
contractorRouter.get("/contractor/get-outlet-by-energy-company-id/:id", verifyContractorToken, getOutletByEnergyCompanyId);
contractorRouter.get("/contractor/get-outlet-by-district-id/:id", verifyContractorToken, getOutletByDistrictId);
contractorRouter.get("/contractor/get-outlet-by-sales-area-id/:id", verifyContractorToken, getOutletBySalesId);
contractorRouter.get("/contractor/get-all-outlet-for-dropdown", verifyContractorToken, getAllOutletForDropdown);
contractorRouter.post("/contractor/import-outlet", verifyContractorToken, importOutlet)

// pdf 

contractorRouter.get("/contractor/get-attached-documents-by-measurement-id/:id", attachAllDocumentsByMeasurementId);
contractorRouter.get("/contractor/get-attached-documents-by-proforma-id/:id", getProformaInvoicePdf);

// dashboard
// contractorRouter.get("/contractor/get-total-complaints", verifyContractorToken, getTotalComplaintsCount)
// dashboard
contractorRouter.get("/contractor/get-complaints-count", verifyContractorToken, getTotalComplaintsCount);
contractorRouter.get("/contractor/get-total-complaints", verifyContractorToken, getTotalComplaints);
contractorRouter.get("/contractor/get-monthly-complaints", verifyContractorToken, getTotalComplaintsCountEachMonth);
contractorRouter.get("/contractor/get-area-managers", verifyContractorToken, getAreaManagersDashboard);
contractorRouter.get("/contractor/get-end-users-dashboard", verifyContractorToken, getEndUsersDashboard);
contractorRouter.get("/contractor/get-monthly-measurement-amount", verifyContractorToken, getMeasurementAmountEachMonth);
contractorRouter.get("/contractor/get-monthly-proforma-invoice-amount", verifyContractorToken,  getProformaInvoiceEachMonthAmount);
contractorRouter.get("/contractor/get-monthly-invoice-amount", verifyContractorToken, getInvoiceEachMonthAmount);
contractorRouter.post("/contractor/get-all-complaints-by-status", verifyContractorToken, getAllComplaintsByStatus)
contractorRouter.get("/contractor/get-all-payment-recieve-in-dashboard", verifyContractorToken, getBillingDashboard)
contractorRouter.get("/contractor/get-area-manager-billing-dashboard", verifyContractorToken, areaManagerDashboardforBilling)
contractorRouter.get("/contractor/get-ro-billing-dashboard", verifyContractorToken, roDashboardforBilling)


// brand 

contractorRouter.post("/contractor/create-brand", verifyContractorToken, createBrand);
contractorRouter.post("/contractor/update-brand", verifyContractorToken, updateBrand);
contractorRouter.get("/contractor/get-all-brand", verifyContractorToken, getAllBrands);
contractorRouter.get("/contractor/get-brand-by-id/:id", verifyContractorToken, getBrandById);
contractorRouter.delete("/contractor/delete-brand/:id", verifyContractorToken, deleteBrand);
contractorRouter.get("/contractor/get-all-brand-markdown", verifyContractorToken, getAllBrandsMarkDown)

// feedback and suggestions
contractorRouter.post("/contractor/create-feedback-and-complaint", verifyContractorToken, addUpdateFeedbackComplaint);
contractorRouter.post("/contractor/add-response/:id", verifyContractorToken, addResponseToFeedbackComplaint);
contractorRouter.get("/contractor/get-all-feedback-and-complaint", verifyContractorToken, getFeedbackComplaint);
contractorRouter.get("/contractor/get-feedback-and-complaint/:id", verifyContractorToken, getFeedbackComplaintById);
contractorRouter.delete("/contractor/delete-feedback-and-complaint/:id", verifyContractorToken, deleteFeedbackComplaint);

// sale orders
contractorRouter.post("/contractor/create-so-order", verifyContractorToken, createSalesOrder);
contractorRouter.post("/contractor/update-so-details", verifyContractorToken, updateSalesOrderDetails);
contractorRouter.get("/contractor/get-all-generated-so", verifyContractorToken, getAllGeneratedSalesOrder);
contractorRouter.get("/contractor/get-single-so-details/:id", verifyContractorToken, getSalesOrderDetailsById);
contractorRouter.delete("/contractor/delete-so-details/:id", verifyContractorToken, deleteSalesOrder);
contractorRouter.get("/contractor/check-so-is-exists", verifyContractorToken, checkSONumberIsAlreadyExists);
contractorRouter.get("/contractor/get-so-details-on-ro/:id", verifyContractorToken, getSoListOnRoId);
contractorRouter.post("/contractor/change-so-status", verifyContractorToken, changeSoStatus);
contractorRouter.get("/contractor/get-sales-order-details-with-items/:id", verifyContractorToken, getSalesOrderItemsOnSo);
contractorRouter.post("/contractor/approve-sales-order", verifyContractorToken, approveSalesOrder);
contractorRouter.post("/contractor/approve-update-sales-order", verifyContractorToken, approveAndUpdateSalesOrder);
contractorRouter.get("/contractor/get-sales-security-unique-id", verifyContractorToken, getSalesSecurityUniqueId);
contractorRouter.get("/contractor/get-ro-for-so", verifyContractorToken, getRoForSalesOrder);
contractorRouter.get("/contractor/get-so-number-for-so", verifyContractorToken, getSoNumberForSalesOrder);


//  energy company teams 

contractorRouter.post("/contractor/create-energy-company-user", verifyContractorToken, createEnergyTeam)
contractorRouter.post("/contractor/update-energy-company-user", verifyContractorToken, updateEnergyTeam)
contractorRouter.get('/contractor/get-energy-company-users', verifyContractorToken, getEnergyTeamDetailsById)
contractorRouter.delete('/contractor/delete-energy-company-user/:id', verifyContractorToken, deleteEnergyTeam)
contractorRouter.get('/contractor/get-area-data-for-energy/:energy_company_id/:type', verifyContractorToken, getEnergyCompanySubSidiaries);


contractorRouter.post("/contractor/send-message", verifyContractorToken, sendMessage);
contractorRouter.post("/contractor/update-message", verifyContractorToken, updateMessage);
contractorRouter.get("/contractor/get-all-messages", verifyContractorToken, getAllMessages);
contractorRouter.get("/contractor/get-message-by-id/:id", verifyContractorToken, getMessageById);
contractorRouter.delete("/contractor/delete-message/:id", verifyContractorToken, deleteMessage);


// contacts
contractorRouter.get("/contractor/get-dealer-users", verifyContractorToken, getAllDealerUsers);
contractorRouter.get("/contractor/get-client-users", verifyContractorToken, getAllAdmins);
contractorRouter.get("/contractor/get-dealer-by-id/:id", verifyContractorToken, getDealerById);

module.exports = contractorRouter;


