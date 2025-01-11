const Joi = require("joi");
var moment = require('moment');

const checkPositiveInteger = Joi.object({
    id: Joi.number().integer().positive().required()
});

const outletFormValidation = Joi.object({
    energy_company_id: Joi.number().required(),
    zone_id: Joi.number().required(),
    regional_id: Joi.number().required(),
    sales_area_id: Joi.number().required(),
    district_id: Joi.optional().required(),
    outlet_name: Joi.string().required(),
    outlet_contact_number: Joi.number().required(),
    customer_code: Joi.string().required(),
    outlet_category: Joi.string().required(),
    outlet_ccnoms: Joi.string().required(),
    outlet_ccnohsd: Joi.string().required(),
    outlet_unique_id: Joi.string().required(),
    // email: Joi.string().required(),
    address: Joi.string().required(),
    status: Joi.string().required(),

}).options({ allowUnknown: true });


const saleCompanyFiledValidated = Joi.object({

    name: Joi.string().required(),
    contact: Joi.string().required(),
    mobile: Joi.number().required(),
    address: Joi.string().required(),
    primary_contact_person: Joi.string().required(),
    primary_contact_mobile: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
    billing_address: Joi.string().required(),

}).options({ allowUnknown: true });

const purchaseCompany = Joi.object({

    company_name: Joi.string().required(),
    company_contact: Joi.string().required(),
    company_mobile: Joi.number().required(),
    company_address: Joi.string().required(),
    company_contact_person: Joi.string().required(),
    primary_contact_number: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
    billings_address: Joi.string().required(),
}).options({ allowUnknown: true });


const companyValidation = Joi.object({

    company_name: Joi.string().required(),
    company_contact: Joi.string().required(),
    company_mobile: Joi.number().required(),
    company_address: Joi.string().required(),
    company_contact_person: Joi.string().required(),
    primary_contact_number: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
}).options({ allowUnknown: true });


const adminCreateValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
}).options({ allowUnknown: true });


const loginValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
}).options({ allowUnknown: true });

const subUserFormValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    joining_date: Joi.date().raw().required(),
}).options({ allowUnknown: true });

const subUserProfileUpdateValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
}).options({ allowUnknown: true });

const changePasswordValidation = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required()
}).options({ allowUnknown: true });


const validatePermissionOnRoleBassi = Joi.object({
    module_id: Joi.number().positive().required(),
    role_id: Joi.number().positive().required()
}).options({ allowUnknown: true });


const complaintTypeValidations = Joi.object({
    energy_company_id: Joi.number().positive().required(),
    complaint_type: Joi.string().required(),
    description: Joi.string().required(),

}).options({ allowUnknown: true });

const teamValidations = Joi.object({
    team_head: Joi.number().required(),
    team_name: Joi.string().required(),
    team_short_description: Joi.string().required()

}).options({ allowUnknown: true });

const energyCompanyValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contact_no: Joi.number().required(),
});

const contractorValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contact_no: Joi.number().required(),
    password: Joi.string().required().min(6),
}).options({ allowUnknown: true });

const contractorValidationsForUpdate = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contact_no: Joi.number().required(),
}).options({ allowUnknown: true });

const tutorialValidations = Joi.object({
    user_type: Joi.number().required(),
    application_type: Joi.string().required(),
    module_type: Joi.string().required(),
    tutorial_format: Joi.string().required(),
    description: Joi.string().required()
})

const planValidations = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    duration: Joi.string().required(),
    description: Joi.string().required()
})

const notificationCreateValidations = Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
})

const surveyValidations = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    format: Joi.string().required(),
})

const addDocumentValidations = Joi.object({
    category_id: Joi.number().required(),
    user_type: Joi.number().required(),
    user_id: Joi.required(),
    remarks: Joi.string().required(),
}).options({ allowUnknown: true })

const tasksManagerValidations = Joi.object({
    title: Joi.string().required(),
    start_date: Joi.date().raw().required(),
    end_date: Joi.date().raw().required(),
    assign_to: Joi.number().required(),
    project_name: Joi.string().required(),
    category_id: Joi.number().required(),
    status: Joi.string().required(),
    collaborators: Joi.array().required()
})

const changePasswordValidations = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required()
})

const hrTeamValidations = Joi.object({
    manager_id: Joi.number().required(),
    supervisor_id: Joi.number().required(),
    team_name: Joi.string().required()
})

const profileValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
    joining_date: Joi.string().required(),
})

const userActivityLogValidations = Joi.object({
    userId: Joi.number().integer().positive().required(),
    roleId: Joi.number().integer().positive().required,
    timestamp: Joi.number().integer().positive().required,
    action: Joi.string().required(),
    ipAddress: Joi.required(),
    userAgent: Joi.string().required(),
    result: Joi.string().required()
}).options({ allowUnknown: true });

const termsAndConditionsValidation = Joi.object({
    title: Joi.string().required(),
    content: Joi.required(),
    status: Joi.number().required()
}).options({ allowUnknown: true })

const userCreateValidations = Joi.object({
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    joining_date: Joi.string().required(),
    salary: Joi.number().required(),
}).options({ allowUnknown: true });

const leaveApplicationValidations = Joi.object({
    leave_type_id: Joi.number().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    reason: Joi.string().required(),
}).options({ allowUnknown: true });

const breakValidations = Joi.object({
    break_name: Joi.string().required(),
    break_number: Joi.number().required(),
    status: Joi.number().required()
})

const insurancePlansValidations = Joi.object({
    insurance_company_id: Joi.number().integer().positive().required(),
    policy_name: Joi.string().required(),
    policy_type: Joi.string().required(),
    policy_start_date: Joi.date().required(),
    policy_end_date: Joi.date().required(),
    policy_premium_amount: Joi.number().required(),
    policy_coverage_limits: Joi.number().required(),
    policy_covered_risks: Joi.number().required(),
    policy_deductible_amount: Joi.number().required(),
    policy_renewal_date: Joi.date().required(),
    policy_tenure: Joi.string().required(),
}).options({ allowUnknown: true });

const resignationStatusValidation = Joi.object({
    id: Joi.number().integer().positive().required(),
    status: Joi.number().integer().positive().required(),
})

const pensionFormValidation = Joi.object({
    user_id: Joi.number().integer().positive().required(),
    retirement_date: Joi.date().required(),
    pension_status: Joi.number(),
    pension_amount: Joi.number().required()
}).options({ allowUnknown: true });

const messageValidation = Joi.object({
    recipient_id: Joi.number().integer().positive().required(),
    message_content: Joi.string().required()
}).options({ allowUnknown: true });


const salaryValidation = Joi.object({

    user_id: Joi.number().integer().positive().required(),
    date_of_hire: Joi.required(),
    salary: Joi.number().required(),
    salary_term: Joi.string().required()

}).options({ allowUnknown: true })


const fundRequestValidation = Joi.object({
    complaint_id: Joi.string().required(),
    request_purpose: Joi.string().required(),
    request_amount: Joi.number().integer().positive().required(),

}).options({ allowUnknown: true })

const stockRequestValidation = Joi.object({
    product_id: Joi.number().integer().positive().required(),
    rate: Joi.number().required(),
    quantity: Joi.number().required(),
    supplier_id: Joi.number().required(),

}).options({ allowUnknown: true });

const purchaseOrderValidation = Joi.object({
    po_date: Joi.date().required(),
    ro_office: Joi.number().required(),
    state: Joi.number().required(),
    po_number: Joi.string().required(),
    po_amount: Joi.number().optional(),
    tax_type: Joi.number().optional(),
    tax: Joi.number().optional(),
    limit: Joi.number().required(),
    po_budget: Joi.number().optional(),
    security_deposit_date: Joi.date().required(),
    security_deposit_amount: Joi.number().required(),
    tender_date: Joi.date().required(),
    tender_number: Joi.string().required(),
    bank: Joi.string().required(),
    dd_bg_number: Joi.string().required(),
    work: Joi.string().required(),

}).options({ allowUnknown: true });


const measurementValidation = Joi.object({
    measurement_date: Joi.date().required(),
    financial_year: Joi.string().required(),
    ro_office_id: Joi.number().required(),
    sale_area_id: Joi.number().required(),
    po_id: Joi.number().required(),
    //complaint_id: Joi.array().required(),

}).options({ allowUnknown: true });


const quotationSchema = Joi.object({

    company_from: Joi.number().integer().required(),
    company_from_state: Joi.number().required(),
    company_to: Joi.number().integer().required(),
    company_to_regional_office: Joi.number().required(),
    quotation_date: Joi.date().required().iso(),
    regional_office_id: Joi.number().required(),
    sales_area_id: Joi.number().required(),
    outlet: Joi.number().required(),
    po_number: Joi.required(),
    complaint_type: Joi.required(),
    // remark: Joi.string().required(),

}).options({ allowUnknown: true });


// Validation schema using joi
// const supplierSchema = Joi.object({

//     supplier_name: Joi.string().required(),
//     owner_name: Joi.string().required(),
//     cashier_name: Joi.string().required(),
//     supplier_code: Joi.string().required(),
//     bank_id: Joi.number().required(),
//     account_holder_name: Joi.string().required(),
//     account_number: Joi.required(),
//     branch_name: Joi.string().required(),
//     ifsc_code: Joi.string().required(),
//     address: Joi.object().required(),

// }).options({ allowUnknown: true });

const supplierSchema = Joi.object({
    supplier_name: Joi.string().required(),
    owner_name: Joi.string().required(),
    cashier_name: Joi.string().required(),
    // supplier_code: Joi.string().required(),
    bank_id: Joi.number().required(),
    account_holder_name: Joi.string().required(),
    account_number: Joi.number().required(),
    branch_name: Joi.string().required(),
    ifsc_code: Joi.string().required(),
    address: Joi.array().items(Joi.object({
        shop_office_number: Joi.string().required().messages({
            'string.empty': `Shop office number is required.`,
        }),
        street_name: Joi.string().required().messages({
            'string.empty': `Street Name is required.`,
        }),
        city: Joi.string().required().messages({
            'string.empty': `City is required.`,
        }),
        state: Joi.required().messages({
            'string.empty': `State is required.`,
        }),
        pin_code: Joi.number().required().messages({
            'string.empty': `Pincode is required.`,
        }),
        landmark: Joi.string().required().messages({
            'string.empty': `landmark is required.`,
        }),
        gst_number: Joi.string().required().messages({
            'string.empty': `GST Number is required.`,
        }),
        is_default: Joi.string().valid('0', '1').required().messages({
            'string.empty': `IS Default is required.`,
        }),
    })).min(1).required(),
}).options({ allowUnknown: true });


const measurementItemValidation = Joi.object({
    measurement_id: Joi.number().integer().required(),
    po_id: Joi.number().integer().required(),
    complaint_id: Joi.number().integer().required(),
    item_id: Joi.number().integer().required(),
    unit_id: Joi.number().integer().required(),
    number: Joi.number().required(),
    length: Joi.required(),
    breadth: Joi.required(),
    depth: Joi.required(),
    quantity: Joi.number().required(),
    total_quantity: Joi.number().required(),
    rate: Joi.number().required(),
    amount: Joi.number().required()

}).options({ allowUnknown: true });

const proformaInvoiceValidation = Joi.object({

    billing_from: Joi.required(),
    billing_from_state: Joi.required(),
    billing_to: Joi.required(),
    billing_to_ro_office: Joi.required(),
    financial_year: Joi.required(),
    po_number: Joi.required(),
    measurements: Joi.required(),
    work: Joi.required(),

}).options({ allowUnknown: true });

const financialYearSchema = Joi.object({
    start_date: Joi.required(),
    end_date: Joi.required(),
}).options({ allowUnknown: true })

// Validation schema for units data
const unitsSchema = Joi.object({

    name: Joi.string().required(),
    short_name: Joi.string().required(),
}).options({ allowUnknown: true })

const billingTypeValidation = Joi.object({
    name: Joi.string().required(),
    status: Joi.number().required(),

}).options({ allowUnknown: true });

const taxValidation = Joi.object({
    value: Joi.number().required(),

}).options({ allowUnknown: true });

const invoiceSchema = Joi.object({
    invoice_date: Joi.date().iso().required(),
    financial_year: Joi.string().max(12).required(),
    callup_number: Joi.number().integer().positive().required(),

}).options({ allowUnknown: true });

// Validation schema for the item object
const itemSchema = Joi.object({
    complaint_id: Joi.string().max(100).required(),
    quantity: Joi.number().integer().min(0).required(),
    item_price: Joi.number().integer().min(0).required(),
    // total_price: Joi.number().integer().min(0)
    outlet_id: Joi.required(),
}).options({ allowUnknown: true });

const securityMoneyValidation = Joi.object({
    date: Joi.date().required(),
    po_id: Joi.number().required(),
    amount: Joi.number().required(),
    method: Joi.required(),
    security_deposit_status: Joi.required(),
    payment_status: Joi.required(),
    details: Joi.required(),

}).options({ allowUnknown: true })

const productValidations = Joi.object({

    category_id: Joi.number().required(),
    product_name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    alert_quantity: Joi.number().required(),
    is_published: Joi.required(),
    description: Joi.required(),

}).options({ allowUnknown: true });

const requestCashValidation = Joi.object({

    request_amount: Joi.number().required(),
    request_purpose: Joi.string().required(),

}).options({ allowUnknown: true });

const expenseValidation = Joi.object({

    expense_category: Joi.number().required(),
    expense_amount: Joi.number().required(),
    payment_method: Joi.number().required(),
    supplier_id: Joi.number().required(),
    complaint_id: Joi.number().required(),
    expense_description: Joi.string().required(),

}).options({ allowUnknown: true });

const assetsValidationScheme = Joi.object({

    asset_name: Joi.string().required(),
    asset_model_number: Joi.required(),
    asset_uin_number: Joi.required(),
    asset_price: Joi.number().required(),
    asset_purchase_date: Joi.required(),
    // asset_warranty_guarantee_period: Joi.required(),
    asset_warranty_guarantee_start_date: Joi.required(),
    asset_warranty_guarantee_end_date: Joi.required(),
    // asset_warranty_guarantee_value: Joi.required(),
    asset_supplier_id: Joi.required(),
    asset_status: Joi.required(),

}).options({ allowUnknown: true });

const companyContactValidation = Joi.object({

    company_id: Joi.number().required(),
    first_name: Joi.string().required(),
    // last_name: Joi.string().required(),
    phone: Joi.required(),
    email: Joi.required(),
    position: Joi.string().required(),
    status: Joi.number().required(),

}).options({ allowUnknown: true });

const holidayListValidation = Joi.object({
    holiday_name: Joi.string().required(),
    holiday_date: Joi.required(),
}).options({ allowUnknown: true });

const emailValidation = Joi.object({
    email: Joi.string().email().required(),
}).options({ allowUnknown: true });

const expensePunchValidation = Joi.object({
    user_id: Joi.number().optional(),
    complaint_id: Joi.number().required(),
    items: Joi.array().required(),
}).options({ allowUnknown: true });

const bankFieldValidation = Joi.object({
    bank_name: Joi.string().required(),
    website: Joi.string().required(),

}).options({ allowUnknown: true });

const transferStockValidation = Joi.object({
    transfer_for: Joi.number().required(),
    transfer_to: Joi.number().required(),
    items: Joi.required(),
}).options({ allowUnknown: true });

const amountAddToUserWalletValidationSchema = Joi.object({
    user_id: Joi.number().required(),
    amount: Joi.number().positive().required(),
    remark: Joi.string().required(),
}).options({ allowUnknown: true });

const accountDetailsValidation = Joi.object({
    banks: Joi.required(),
    // accounts:Joi.required(),
}).options({ allowUnknown: true });

const updateAccountDetailsValidation = Joi.object({
    id: Joi.number().required(),
    bank_id: Joi.number().required(),
    account_number: Joi.number().required(),
    ifsc_code: Joi.string().required(),
    branch: Joi.string().required(),
    is_default: Joi.required(),
}).options({ allowUnknown: true })

const addWalletAmountValidation = Joi.object({
    id: Joi.number().required(),
    remark: Joi.string().required(),
    balance: Joi.number().required(),
    transaction_id: Joi.string().required(),
})

const checkString = Joi.object({
    hsncode: Joi.string().required()
});

const transferFund = Joi.object({
    transfer_data: Joi.array().required(),
    id: Joi.number().required(),
    remark: Joi.string().required(),
    transaction_id: Joi.string().required()
}).options({ allowUnknown: true });

const reschduleDate = Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required();

const stockPunchValidation = Joi.object({
    area_manager_id: Joi.number().required(),
    supervisor_id: Joi.number().allow('', null).optional(),
    end_users_id: Joi.number().allow('', null).optional(),
    complaint_id: Joi.number().required(),
    stock_punch_detail: Joi.array().items(Joi.object({
        stock_id: Joi.number().required(),
        item_id: Joi.number().required(),
        item_qty: Joi.number().required()
    })).required()
}).options({ allowUnknown: true });

const poChangeValidation = Joi.object({
    measurement_id: Joi.number().required(),
    po_id: Joi.number().required()
})



const earthingTestingSchema = Joi.object({
    complaint_id: Joi.required().messages({
        'any.required': 'complaint_id is required',
    }),
    outlet_id: Joi.array().required().messages({
        'any.required': 'outlet_id is required',
    }),
    user_id: Joi.array().required().messages({
        'any.required': 'user_id is required',
    }),
}).options({ allowUnknown: true });


const earthingTestingStatusValidation = Joi.object({
    value: Joi.number().required(),
    id: Joi.number().required(),
});


const addPaymentSettingValidation = Joi.object({
    gst: Joi.string().required(),
    tds: Joi.number().required(),
    tds_with_gst: Joi.number().required(),
    retention_money: Joi.number().required(),
    man_power: Joi.number().required(),
    site_expense: Joi.number().required(),
    site_stock: Joi.number().required(),
    promotion_expense: Joi.number().required(),
}).unknown(true);

const updatePaymentSettngValidation = Joi.object({
    id: Joi.number().required(),
    gst: Joi.string().required(),
    tds: Joi.number().required(),
    tds_with_gst: Joi.number().required(),
    retention_money: Joi.number().required(),
    man_power: Joi.number().required(),
    site_expense: Joi.number().required(),
    site_stock: Joi.number().required(),
    promotion_expense: Joi.number().required(),
}).unknown(true);


const addPaymentReceiveValidationSchema = Joi.array().items(
    Joi.object({
        receipt_date: Joi.date().required(),
        invoice_date: Joi.date().required(),
        invoice_number: Joi.string().max(100).required(),
        net_amount: Joi.number().required(),
        gst_amount: Joi.number().required(),
        received_gst: Joi.number().required(),
        retention: Joi.required(),
        tds: Joi.required(),
        tds_on_gst: Joi.required(),
        pv_number: Joi.string().required(),
        ld_amount: Joi.number().required(),
        hold_amount: Joi.number().required(),
        covid19_amount_hold: Joi.number().allow("").required(),
        amount_received: Joi.number().required(),
    }).unknown(true)
).required();


const updatePaymentReceiveValidation = Joi.object({
    id: Joi.number().required(),
    retention: Joi.string().required(),
    retention_amount: Joi.number().required(),
    // tds: Joi.string().required(),
    // tds_amount: Joi.number().required(),
    // tds_on_gst: Joi.string().required(),
    // tds_on_gst_amount: Joi.number().required(),
    // other_deduction: Joi.number().required(),
    // ld_amount: Joi.number().required(),
    // hold_amount: Joi.number().required(),
    // covid19_amount_hold: Joi.number().allow("").required(),
    // amount_received: Joi.number().required(),
}).unknown(true);

const updateRetentionStatusValidation = Joi.object({
    id: Joi.number().required(),
    status: Joi.number().valid(1, 2).required().messages({
        "any.required": "status is required",
    }),
}).options({ allowUnknown: true });

const updatePaymentAmountRetentionValidation = Joi.object({
    ids: Joi.array().required(),
    payment_reference_number: Joi.string().required(),
    date: Joi.date().required(),
    amount: Joi.number().required(),
});

const addPaymentPaidValidation = Joi.object({
    manager_id: Joi.number().integer().required(),
    ro_id: Joi.number().integer().required(),
}).options({ allowUnknown: true });


const addRoPaymentPaidValidation = Joi.object({
    po_id: Joi.number().integer().required(),
    ro_id: Joi.number().integer().required(),
}).options({ allowUnknown: true });

const loanValidation = Joi.object({
    user_id: Joi.number().required(),
    loan_type: Joi.string().required(),
    loan_date: Joi.date().required(),
    emi_start_from: Joi.date().required(),
    loan_amount: Joi.number().required(),
    interest_rate: Joi.number().required(),
    interest_mode: Joi.string().required(),
    no_of_payments: Joi.number().required(),
    emi: Joi.number().required(),
    payment_date: Joi.date().required(),
    payment_mode: Joi.string().required(),
    cheque_number: Joi.when("payment_mode", {
        is: "cheque",
        then: Joi.string().required(),
        otherwise: Joi.string().allow(null, ""),
    }),
    cheque_date: Joi.when("payment_mode", {
        is: "cheque",
        then: Joi.date().required(),
        otherwise: Joi.date().allow(null, ""),
    }),
    branch: Joi.string().required(),
    bank: Joi.string().required(),
    loan_term: Joi.string().required(),
    remarks: Joi.string().required(),
}).options({ allowUnknown: true });


const createAreaManagerValidation = Joi.object({
    manager_id: Joi.number().required(),
    company_ratio: Joi.number().required(),
    manager_ratio: Joi.number().required(),
});

const updateAreaManagerValidation = Joi.object({
    id: Joi.number().required(),
    manager_id: Joi.number().required(),
    company_ratio: Joi.number().required(),
    manager_ratio: Joi.number().required(),
});

const salesOrderValidation = Joi.object({
    so_date: Joi.date().required(),
    ro_office: Joi.number().required(),
    state: Joi.number().required(),
    so_number: Joi.string().required(),
    so_amount: Joi.number().optional(),
    tax_type: Joi.number().optional(),
    tax: Joi.number().optional(),
    limit: Joi.number().required(),
    so_budget: Joi.number().optional(),
    security_deposit_date: Joi.date().required(),
    security_deposit_amount: Joi.number().required(),
    tender_date: Joi.date().required(),
    tender_number: Joi.string().required(),
    bank: Joi.string().required(),
    dd_bg_number: Joi.string().required(),
    cr_date: Joi.date().required(),
    cr_number: Joi.string().required(),
    cr_code: Joi.string().required(),
    work: Joi.string().required(),
}).options({ allowUnknown: true });


const createFeedbackComplaintValidation = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'Title is required',
        'string.empty': 'Title cannot be an empty field',
    }),
    description: Joi.string().required().messages({
        'any.required': 'Description is required',
        'string.empty': 'Description cannot be an empty field',
    })
}).options({ allowUnknown: true });

const createEnergyCompanyTeamValidation = Joi.object({
    username: Joi.string().required(),
    contact_no: Joi.string().required(),
    status: Joi.number().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    pin_code: Joi.string(),
    address: Joi.string(),
    gst_number: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    joining_date: Joi.date().required(),
    area_name: Joi.number().required(),
    energy_company_id: Joi.number(),
}).options({ allowUnknown: true });

const updateEnergyCompanyTeamValidation = Joi.object({
    id: Joi.number().required(),
    username: Joi.string().required(),
    contact_no: Joi.string().required(),
    status: Joi.number().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    pin_code: Joi.string(),
    address: Joi.string(),
    gst_number: Joi.string(),
    email: Joi.string().required(),
    joining_date: Joi.date().required(),
    area_name: Joi.number().required(),
    energy_company_id: Joi.number(),
    transfer_date: Joi.date(),
}).options({ allowUnknown: true });


const sendMessageValidation = Joi.object({
    user_ids: Joi.array().items(Joi.number().required()).required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    date: Joi.string().required(),
}).options({ allowUnknown: true });

const updateMessageValidation = Joi.object({
    id: Joi.number().required(),
    user_ids: Joi.array().items(Joi.number().required()).required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    date: Joi.string().required(),
}).options({ allowUnknown: true });


const importOutletValidation = Joi.array().items(
    Joi.object({
        energy_company_id: Joi.number().required(),
        zone_id: Joi.number().required(),
        regional_id: Joi.number().required(),
        sales_area_id: Joi.number().required(),
        district_id: Joi.number().required(),
        outlet_name: Joi.string().required(),
        outlet_contact_person_name: Joi.string().required(),
        outlet_contact_number: Joi.string().required(),
        primary_number: Joi.string().optional(),
        secondary_number: Joi.string().optional(),
        primary_email: Joi.string().optional(),
        secondary_email: Joi.string().optional(),
        customer_code: Joi.string().required(),
        outlet_category: Joi.string().required(),
        location: Joi.string().optional(),
        address: Joi.string().required(),
        outlet_ccnoms: Joi.string().required(),
        outlet_ccnohsd: Joi.string().required(),
        outlet_resv: Joi.string().optional(),
        outlet_longitude: Joi.string().optional(),
        outlet_lattitude: Joi.string().optional(),
        outlet_unique_id: Joi.string().required(),
        status: Joi.string().required(),
        email: Joi.string().optional(),
        password: Joi.string().optional(),
    }).options({ allowUnknown: true })
);

module.exports = { checkPositiveInteger, outletFormValidation, saleCompanyFiledValidated, purchaseCompany, adminCreateValidation, companyValidation, loginValidation, subUserFormValidation, subUserProfileUpdateValidation, changePasswordValidation, validatePermissionOnRoleBassi, complaintTypeValidations, teamValidations, energyCompanyValidations, contractorValidations, contractorValidationsForUpdate, tutorialValidations, planValidations, notificationCreateValidations, surveyValidations, addDocumentValidations, tasksManagerValidations, changePasswordValidations, hrTeamValidations, profileValidations, userActivityLogValidations, termsAndConditionsValidation, userCreateValidations, leaveApplicationValidations, breakValidations, insurancePlansValidations, resignationStatusValidation, pensionFormValidation, messageValidation, salaryValidation, loanValidation, fundRequestValidation, stockRequestValidation, purchaseOrderValidation, measurementValidation, quotationSchema, supplierSchema, measurementItemValidation, proformaInvoiceValidation, financialYearSchema, unitsSchema, billingTypeValidation, taxValidation, invoiceSchema, itemSchema, securityMoneyValidation, productValidations, requestCashValidation, expenseValidation, assetsValidationScheme, companyContactValidation, holidayListValidation, emailValidation, expensePunchValidation, bankFieldValidation, transferStockValidation, amountAddToUserWalletValidationSchema, accountDetailsValidation, addWalletAmountValidation, updateAccountDetailsValidation, checkString, transferFund, reschduleDate, stockPunchValidation, poChangeValidation, earthingTestingSchema, earthingTestingStatusValidation, addPaymentSettingValidation, updatePaymentSettngValidation, addPaymentReceiveValidationSchema, updatePaymentReceiveValidation, updateRetentionStatusValidation, updatePaymentAmountRetentionValidation, addPaymentPaidValidation, updateAreaManagerValidation, createAreaManagerValidation, salesOrderValidation, createFeedbackComplaintValidation, updateEnergyCompanyTeamValidation, createEnergyCompanyTeamValidation, sendMessageValidation, updateMessageValidation, addRoPaymentPaidValidation, importOutletValidation };
