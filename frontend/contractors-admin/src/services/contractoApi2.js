import { customApi } from "./authapi";

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-sa-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export const postFundTransferRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/transfer-fund`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postStockTransferRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock-transfer`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateStockTransferRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-transfer-bill-and-date`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllAccountTransactions = async (
  id,
  pageSize,
  pageNo,
  search
) => {
  try {
    console.log(search, "the search");
    const { data } = await customApi.get(
      `/api/contractor/get-check-last-balance/${id}?search=${
        search || ""
      }&&pageSize=${pageSize}&&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllAccountTransactionsByBank = async (
  id,
  type,
  date,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-bank-to-all-accounts-transaction/${id}/${type}?date=${date}&search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getLastBalanceOfEmployee = async (
  employee_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-check-last-balance-of-employee/${employee_id}?search=${
        search || ""
      }&&pageSize=${pageSize}&&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const expenseBalanceOverview = async (
  employee_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-last-balance-of-employee/${
        employee_id ? employee_id : ""
      }?search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getFundTransactionsOfEmployee = async (
  employee_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-transaction/${employee_id}?search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getExpenseTransactionDetails = async (
  employee_id,
  filterBy,
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-expense-transaction/${employee_id}?date=${filterBy}&&search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getStockTransactionOfSupplier = async (
  employee_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-supplier-transaction/${employee_id}?search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getEmployeeList = async (
  employeeType,
  pageSize,
  pageNo,
  search
) => {
  try {
    let res;
    if (employeeType === "manager") {
      res = await customApi.get(`/api/contractor/get-all-managers-users`);
    }

    if (employeeType === "supervisor") {
      res = await customApi.get(`/api/contractor/get-all-supervisors`);
    }

    if (employeeType === "enduser") {
      res = await customApi.get(`/api/contractor/get-all-users`);
    }

    return res.data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllAccountTransactionsByStock = async (
  id,
  date,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-bank-to-all-accounts-transaction-via-stock/${id}?date=${date}&search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRescheduledTransfer = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/rescheduled-transfer-fund?search=${search}&&pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRescheduledStockTransfer = async (pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-reschdule-transfer-stock?pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postRescheduledTransferFund = async (id, rescheduled_date) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/rescheduled-transfer-fund/${id}/${rescheduled_date}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postRescheduledTransferStock = async (id, rescheduled_date) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/rescheduled-stocks-transfer-stock/${id}/${rescheduled_date}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
