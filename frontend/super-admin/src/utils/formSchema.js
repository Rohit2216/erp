import * as Yup from "yup";
const phoneRegExp = /^[6-9]{1}[0-9]{9}$/;

export const loginSchema = Yup.object().shape({
  // firstName: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  // lastName: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  email: Yup.string()
    .email("please enter valid email")
    .required("Email is Required"),
  password: Yup.string().min(6, "Too Short!").required("Password is Required"),
  // phone: Yup.number().typeError("number only").min(6, 'Too Short!').required('Email is Required'),
});

export const MyprofileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("please enter valid email")
    .required("Email is Required"),
  contact_no: Yup.string()
    .matches(phoneRegExp, "contact number is not valid")
    .typeError("Phone no. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Phone no. is a Required"),
});
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

export const otpSchema = Yup.object().shape({
  otp: Yup.number()
    .required("otp is required")
    .min(6, "otp must be at least 6 characters"),
});
export const ChangePasswordSchema = Yup.object().shape({
  old_password: Yup.string().trim().required("Password is Required"),
  new_password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is Required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Confirm Password is Required"),
});
// master data only
export const addZoneSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("Energy Company name is Required"),
  zone_name: Yup.string().trim().required("Zone name is Required"),
  // description: Yup.string().trim().required("Zone description is Required"),
});
export const addROSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("Energy Company name is Required"),
  zone_id: Yup.string().trim().required("Zone Name is Required"),
  regional_office_name: Yup.string()
    .trim()
    .required("Regional Office Name is Required"),
  code: Yup.string().trim().required("Code is Required"),
  address_1: Yup.string().trim().required("Address is Required"),
  regional_status: Yup.string().trim().required("Regional Status is Required"),
});
export const addSalesAreaSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("Energy Company name is Required"),
  zone_id: Yup.string().trim().required("Zone Name is Required"),
  regional_office_name: Yup.string()
    .trim()
    .required("Regional Office Name is Required"),
  sales_area_name: Yup.string().trim().required("Sales Area Name is Required"),
  sales_area_status: Yup.string()
    .trim()
    .required("Sales Area Status is Required"),
});
export const addDistrictSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("Energy Company name is Required"),
  zone_id: Yup.string().trim().required("Zone Name is Required"),
  ro_id: Yup.string().trim().required("Regional Office Name is Required"),
  sales_area_id: Yup.string().trim().required("Sales Area Name is Required"),
  district_name: Yup.string().trim().required("District Name is Required"),
  status: Yup.string().trim().required("District Status is Required"),
});
export const addOutletsSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("energy company Name is Required"),
  zone_id: Yup.string().trim().required("zone Name is Required"),
  regional_id: Yup.string().trim().required("regional Name is Required"),
  sales_area_id: Yup.string().trim().required("sales area Name is Required"),
  // district_id: Yup.string().trim().required("district Name is Required"),
  outlet_name: Yup.string().trim().required("outlet Name is Required"),
  outlet_contact_number: Yup.string()
    .matches(phoneRegExp, "outlet contact number is not valid")
    .typeError("outlet contact number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("outlet contact number. is a Required"),
  customer_code: Yup.string().trim().required("customer code is Required"),
  outlet_category: Yup.string().trim().required("outlet category is Required"),
  outlet_unique_id: Yup.string()
    .trim()
    .required("outlet unique id is Required"),
  outlet_ccnoms: Yup.string().trim().required("outlet ccnoms is Required"),
  outlet_ccnohsd: Yup.string().trim().required("outlet ccnohsd is Required"),
  address: Yup.string().trim().required("address is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is Required"),
});
export const updateOutletsSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("energy company Name is Required"),
  zone_id: Yup.string().trim().required("zone Name is Required"),
  regional_id: Yup.string().trim().required("regional Name is Required"),
  sales_area_id: Yup.string().trim().required("sales area Name is Required"),
  // district_id: Yup.string().trim().required("district Name is Required"),
  outlet_name: Yup.string().trim().required("outlet Name is Required"),
  outlet_contact_number: Yup.string()
    .matches(phoneRegExp, "outlet contact number is not valid")
    .typeError("outlet contact number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("outlet contact number. is a Required"),
  customer_code: Yup.string().trim().required("customer code is Required"),
  outlet_category: Yup.string().trim().required("outlet category is Required"),
  outlet_unique_id: Yup.string()
    .trim()
    .required("outlet unique id is Required"),
  outlet_ccnoms: Yup.string().trim().required("outlet ccnoms is Required"),
  outlet_ccnohsd: Yup.string().trim().required("outlet ccnohsd is Required"),
  address: Yup.string().trim().required("address is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
});
export const addDealersSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
});
export const addContractorsSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  // password: Yup.string()
  //   .min(6, "Password must be at least 6 characters")
  //   .required("Password is Required"),
  contact_no: Yup.string()
    .matches(phoneRegExp, "Contact Number is not valid")
    .typeError("Contact Number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Contact Number. is a Required"),
});
export const addContractorUserSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  mobile: Yup.string()
    .matches(phoneRegExp, "Contact Number is not valid")
    .typeError("Contact Number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Contact Number. is a Required"),
});
export const addTypesComplaintSchema = Yup.object().shape({
  energy_company_id: Yup.object().required("Company Name is Required"),
  complaint_type_name: Yup.string()
    .trim()
    .required("Complaint Type Name is Required"),
});
export const addEnergySchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("is Required"),
  username: Yup.string().trim().required("is Required"),
  contact_no: Yup.string()
    .matches(phoneRegExp, "Contact Number is not valid")
    .typeError("Contact Number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("is Required"),
  // password: Yup.string().min(6, "Too Short!").required("Password is Required"),
});
export const addEnergySchemaOnly = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("is Required"),
  username: Yup.string().trim().required("is Required"),
  contact_no: Yup.string()
    .matches(phoneRegExp, "Contact Number is not valid")
    .typeError("Contact Number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("is Required"),
  area_name: Yup.object().required("is Required"),
  area_selected: Yup.object().required("is Required"),
  joining_date: Yup.string().trim().required("is Required"),
});
export const addMyCompanySchema = Yup.object().shape({
  company_name: Yup.string().trim().required("Company Name is Required"),
  company_contact: Yup.string()
    .matches(phoneRegExp, "Company Contact Number is not valid")
    .typeError("Company Contact Number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Company Contact Number. is a Required"),
  company_mobile: Yup.string()
    .matches(phoneRegExp, "Company Mobile is not valid")
    .typeError("Company Mobile. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Company Mobile. is a Required"),
  pan_number: Yup.string().trim().required("pan number is Required"),
  company_contact_person: Yup.string()
    .trim()
    .required("Company Contact Person is Required"),
  // company_address: Yup.string().trim().required("Company Address is Required"),
  primary_contact_number: Yup.string()
    .matches(phoneRegExp, "Primary Contact Number is not valid")
    .typeError("Primary Contact Number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Primary Contact Number. is a Required"),
  gst_treatment_type: Yup.object().required("GST Treatment Type is Required"),
  business_legal_name: Yup.string()
    .trim()
    .required("Business Legal Name is Required"),
  company_type: Yup.string().trim().required("Company Type is Required"),
});
export const addTutorialsSchema = Yup.object().shape({
  // email: Yup.string().email("Invalid email").required("Email is Required"),
});
export const addRolesSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
});
export const addHrTeamSchema = Yup.object().shape({
  team_name: Yup.string().trim().required("Team Name is Required"),
  supervisor_id: Yup.mixed().required("supervisor is Required"),
  // team_short_description: Yup.string()
  //   .trim()
  //   .required("Description is Required"),
  members: Yup.array()
    .min(1, "Select at least one Member")
    .required("Team Member is Required"),
  manager_id: Yup.mixed().required("Team Manager is Required"),
});
export const addTeamMemberListSchema = Yup.object().shape({
  user_id: Yup.array().required("user Name is Required"),
});
export const addEmployeeSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  mobile: Yup.string()
    .matches(phoneRegExp, "Phone Number is not valid")
    .typeError("Phone No. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Phone Number is a Required"),
  joining_date: Yup.string().trim().required("Joining Date is Required"),
  salary: Yup.string().trim().required("Salary is Required"),
  salary_term: Yup.object().required("Salary Term is Required"),
  skills: Yup.array().required("skills is Required"),
  role_id: Yup.object().required("Role is Required"),
  // team_id: Yup.object().required("Team is Required"),
});

export const editEmployeeSchema = addEmployeeSchema.shape({
  image: Yup.mixed(),
  upload_aadhar_card_image1: Yup.mixed(),
  upload_aadhar_card_image2: Yup.mixed(),
  upload_bank_documents: Yup.mixed(),
  upload_pan_card: Yup.mixed(),
});

export const addMessageSchema = Yup.object().shape({
  user_id: Yup.string().trim().required("User is Required"),
});
export const addTaskCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
});
export const addTaskSchema = Yup.object().shape({
  // name: Yup.string().trim().required("Name is Required"),
});
export const addPlanPricingSchema = Yup.object().shape({
  // name: Yup.string().trim().required("Name is Required"),
});

export const createManuallychema = Yup.object().shape({
  name: Yup.mixed().required("Name is Required"),
  start_date: Yup.string().trim().required("Start Date is Required"),
  clock_in: Yup.string().trim().required("Clock-In is Required"),
  end_date: Yup.string().trim().required("End Date is Required"),
  clock_out: Yup.string().trim().required("Clock-Out is Required"),
  descritpion: Yup.string().trim().required("Description is Required"),
});
export const assignLeaveSchema = Yup.object().shape({
  user_id: Yup.mixed().required("Employee is Required"),
  leave_type_id: Yup.mixed().required("Leave type is Required"),
  start_date: Yup.string().trim().required("Start date is Required"),
  end_date: Yup.string().trim().required("End date is Required"),
  reason: Yup.string().trim().required("reason is Required"),
});
export const addTermConditionSchema = Yup.object().shape({
  title: Yup.string().trim().required("title is Required"),
});
export const addDocumentCategorySchema = Yup.object().shape({
  category: Yup.string().trim().required("Category is Required"),
});
export const addDocumentSchema = Yup.object().shape({
  category_id: Yup.object().required("Document Category is Required"),
  user_type: Yup.object().required("User Type is Required"),
  remark: Yup.string().trim().required("Remark is Required"),
});
export const addSurveyItemMasterSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  rate: Yup.string().trim().required("Rate is Required"),
  // qty: Yup.string().trim().required("Qty is Required"),
  qty: Yup.number()
    .required("Qty is required")
    .positive("Qty must be positive")
    .integer("Qty must be an integer"),
});
export const addSurveyAssignSchema = Yup.object().shape({
  assign_to: Yup.mixed().required("Energy Company is Required"),
});
export const addSurveyPurposeMasterSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
});
export const addEnableDisableSchema = Yup.object().shape({
  // name: Yup.string().trim().required("Name is Required"),
});
export const addInsuranceCompanySchema = Yup.object().shape({
  company_name: Yup.string().trim().required("Company Name is Required"),
  company_code: Yup.string().trim().required("Company Code is Required"),
});
export const addInsuranceCompanyPlansSchema = Yup.object().shape({
  // insurance_company_id: Yup.mixed().required("insurance company Name is Required"),
  policy_name: Yup.string().trim().required("policy name is Required"),
  policy_type: Yup.string().trim().required("policy type is Required"),
  policy_start_date: Yup.string()
    .trim()
    .required("policy start date is Required"),
  policy_end_date: Yup.string().trim().required("policy end date is Required"),
  policy_premium_amount: Yup.string()
    .trim()
    .required("policy premium amount is Required"),
  policy_coverage_limits: Yup.string()
    .trim()
    .required("policy coverage limits is Required"),
  policy_covered_risks: Yup.string()
    .trim()
    .required("policy covered risks is Required"),
  policy_deductible_amount: Yup.string()
    .trim()
    .required("policy deductible amount is Required"),
  policy_renewal_date: Yup.string()
    .trim()
    .required("policy renewal date is Required"),
  policy_tenure: Yup.string().trim().required("policy tenure is Required"),
});
export const addEmployeePensionRetirmentSchema = Yup.object().shape({
  retirement_date: Yup.string().trim().required("retirement date is Required"),
  asset_recovery: Yup.string().trim().required("asset recovery is Required"),
  pension_duration: Yup.string()
    .trim()
    .required("pension duration is Required"),
});
export const addSalaryDisbursalSchema = Yup.object().shape({
  amount: Yup.string().trim().required("Amount is Required"),
  transaction_mode: Yup.string()
    .trim()
    .required("Transaction Mode is Required"),
  transaction_number: Yup.string()
    .trim()
    .required("Transaction Number is Required"),
});
export const addRemarkSchema = Yup.object().shape({
  remark: Yup.string().trim().required("remark is Required"),
});
export const addSurveyOtpSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(phoneRegExp, "Phone Number is not valid")
    .typeError("Phone No. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Phone Number is a Required"),
});
// Attendance Validation
export const createManuallySchema = Yup.object().shape({
  user_ids: Yup.mixed().required("User Name is Required"),
  attendance_status: Yup.object().required("Attendance Status is Required"),
});
export const createManuallyAttendanceSchema = Yup.object().shape({
  attendance_status: Yup.object().required("Attendance Status is Required"),
});
export const addLeavesTypeSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
});
export const addPayrollMasterSettingSchema = Yup.object().shape({
  label: Yup.string().trim().required("Payroll setting is Required"),
  active_setting: Yup.object().required("Active setting is Required"),
});
export const addEmployeeResignationSchema = Yup.object().shape({
  user_id: Yup.object().required("User is Required"),
  resignation_date: Yup.string()
    .trim()
    .required("Resignation date is Required"),
  last_working_day: Yup.string()
    .trim()
    .required("Last working day is Required"),
  reason: Yup.string().trim().required("reason is Required"),
});
export const addGroupInsuranceSchema = Yup.object().shape({
  insurance_applied_on: Yup.mixed().required("Insurance applied is Required"),
  insurance_plan_id: Yup.object().required("Insurance plan is Required"),
  insurance_company_id: Yup.object().required("Insurance company is Required"),
  insurance_deduction_amount: Yup.string()
    .trim()
    .required("Insurance deduction amount is Required"),
});
export const addComplaintTypeSchema = Yup.object().shape({
  energy_company_id: Yup.object().required("Enery Company is Required"),
  zone_id: Yup.object().required("Zone is Required"),
  ro_id: Yup.object().required("Regional Office is Required"),
  order_via_id: Yup.object().required("Order Via is Required"),
  order_by_id: Yup.object().required("Order By is Required"),
  sale_area_id: Yup.object().required("Sales Area is Required"),
  // district_id: Yup.object().required("District is Required"),
  outlet_id: Yup.object().required("Outlet is Required"),
  // outlet_id: Yup.array()
  //   .min(1, "Select at least one Outlet")
  //   .required("Outlet is Required"),
});
export const addComplaintTypeForOtherSchema = Yup.object().shape({
  energy_company_id: Yup.object().required("Company is Required"),
  zone_id: Yup.object().required("Zone is Required"),
  ro_id: Yup.object().required("Regional Office is Required"),
  order_via_id: Yup.object().required("Order Via is Required"),
  order_by_id: Yup.object().required("Order By is Required"),
  sale_area_id: Yup.object().required("Sales Area is Required"),
  // district_id: Yup.object().required("District is Required"),
});

export const addLoanSchema = Yup.object().shape({
  user_id: Yup.object().required("User is Required"),
  loan_amount: Yup.string().trim().required("Loan amount is Required"),
  loan_type: Yup.string().trim().required("Loan type is Required"),
  loan_term: Yup.string().trim().required("Loan term is Required"),
  remarks: Yup.string().trim().required("remarks is Required"),
});
export const addEmployeePromotionDemotionSchema = Yup.object().shape({
  user_id: Yup.object().required("User is Required"),
  purpose: Yup.object().required("Purpose is Required"),
  new_designation: Yup.object().required("New designation is Required"),
  change_in_salary: Yup.object().required("Change in salary is Required"),
  change_in_salary_type: Yup.object().required(
    "Change in salary type is Required"
  ),
  change_in_salary_value: Yup.string().trim().required("Value is Required"),
  reason: Yup.string().trim().required("reason is Required"),
});
export const addOrderViaSchema = Yup.object().shape({
  order_via: Yup.string().trim().required("Order Via Name is Required"),
});
export const addAllocateSchema = Yup.object().shape({
  manger_id: Yup.object().required("Manger is Required"),
  supervisor_id: Yup.object().required("Supervisor is Required"),
  user_id: Yup.object().required("Free End User is Required"),
});
