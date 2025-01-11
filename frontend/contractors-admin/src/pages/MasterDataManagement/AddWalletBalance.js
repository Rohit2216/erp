import { ErrorMessage, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import {
  addWalletBalance,
  getAllAccountByBankId,
  getAllBankListForDropdown,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { AddWalletBalanceSchema } from "../../utils/formSchema";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";

export default function AddWalletBalance() {
  const [allBanksData, setAllBanksData] = useState([]);
  const [allAccountByBankId, setAllAccountByBankId] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllBanksData();
  }, []);

  const fetchAllBanksData = async () => {
    const res = await getAllBankListForDropdown();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm?.id,

          label: itm?.bank_name,
          logo: itm?.logo,
        };
      });
      setAllBanksData(rData);
    } else {
      setAllBanksData([]);
    }
  };

  const handleAccountByBankIdChange = async (val) => {
    if (!val) return false;
    setAllAccountByBankId([]);
    fetchAllAccountByBankId(val);
  };

  const fetchAllAccountByBankId = async (id) => {
    const res = await getAllAccountByBankId(id);
    if (res.status) {
      const rData = res?.data?.map((itm) => {
        return {
          id: itm.id,
          label: itm.account_number,
          account_holder_name: itm?.account_holder_name,
          account_type: itm?.account_type,
          logo: itm.res?.data?.bank_logo,
          balance: itm.balance,
        };
      });
      setAllAccountByBankId(rData);
    } else {
      setAllAccountByBankId([]);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const res = await addWalletBalance(values);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setAllBanksData([]);
    setAllAccountByBankId([]);
  };

  const userFormatOptionLabel = ({ label, logo }) => (
    <div>
      {logo ? (
        <img
          src={process.env.REACT_APP_API_URL + logo}
          className="avatar me-2"
        />
      ) : null}
      {label}
    </div>
  );
  return (
    <div>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"Add Bank Balance"}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: "",
              balance: 0,
              remark: "",
              transaction_id: "",
            }}
            // validationSchema={AddWalletBalanceSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <Form.Group as={Col} md={4}>
                      <Select
                        menuPortalTarget={document.body}
                        value={props.values.user_id}
                        placeholder={t("Select Bank")}
                        name={`user_id`}
                        options={allBanksData}
                        onChange={(e) => {
                          handleAccountByBankIdChange(e.value);
                        }}
                        formatOptionLabel={userFormatOptionLabel}
                      />
                      <ErrorMessage
                        name={`user_id`}
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Select
                        menuPortalTarget={document.body}
                        // value={main?.account_id}
                        placeholder={t("Select Account")}
                        name={`id`}
                        options={allAccountByBankId}
                        onChange={(e) => {
                          props.setFieldValue(`id`, e?.id);
                        }}
                        formatOptionLabel={userFormatOptionLabel}
                      />
                      <ErrorMessage
                        name={`id`}
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" as={Col} md={3}>
                      <Form.Control
                        type="number"
                        placeholder={t("Enter Amount")}
                        value={props.values.balance}
                        name={`balance`}
                        onChange={props.handleChange}
                      />
                      <ErrorMessage
                        name="balance"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} md={4}>
                      <Form.Control
                        type="text"
                        placeholder={t("Enter Remark")}
                        value={props.values.remark}
                        name={`remark`}
                        onChange={props.handleChange}
                      />
                      <ErrorMessage
                        name="remark"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" as={Col} md={4}>
                      <Form.Control
                        type="text"
                        placeholder={t("Enter Transaction Id")}
                        value={props.values.transaction_id}
                        name={`transaction_id`}
                        onChange={props.handleChange}
                      />
                      <ErrorMessage
                        name="transaction_id"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                  </Row>

                  <Form.Group as={Col} md={12}>
                    <div className="my-4 text-center">
                      <button
                        type="submit"
                        // onClick={() => handleUpdate(edit)}
                        className="shadow border-0 red-combo cursor-pointer px-4 py-1 mx-3"
                      >
                        {t("Add Amount")}
                      </button>
                    </div>
                  </Form.Group>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </div>
  );
}
