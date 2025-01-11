import React, { useEffect, useState } from "react";
import { Col, Table, Form, Row, Spinner, Stack } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import {
  getSingleExpensePunchById,
  postApprovePunch,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import ConfirmAlert from "../../components/ConfirmAlert";
import ViewExpensePunch from "./ViewExpensePunch";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { PaymentImages } from "./PaymentImages";

const ApproveExpenseRequest = () => {
  const { user } = useSelector(selectUser);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const Complain_id = location?.state?.Complain_id;
  const userId = location?.state?.userId;
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const fetchSingleData = async () => {
    const res = await getSingleExpensePunchById(userId, Complain_id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const items = values.items
      .map((d) => (d.approved_qty ? d : null))
      .filter((item) => item !== null);

    const modified_data = items.map((data) => {
      return {
        item_id: data.item_id,
        id: data.id,
        item_qty: data.approved_qty,
        transaction_id: data.transaction_id,
        payment_mode: data.payment_mode,
        fund_id: data.fund_id,
      };
    });

    const sData = {
      user_id: values.user_id,
      complaint_id: edit[0].complaint_id,
      items: modified_data,
      transaction_images: values.payment_images,
    };

    // return console.log("sData", sData);
    const res = await postApprovePunch(sData);

    if (res.status) {
      toast.success(res.message);
      navigate("/expense-punch");
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  const allItems =
    edit.length > 0 &&
    edit
      .map((data) => {
        if (data?.remaining_approved_qty > 0)
          return {
            id: data.id,
            item_name: data?.item_name,
            item_images: data?.item_images,
            item_id: data?.item_id,
            item_price: data?.item_price,
            remaining_approved_qty: data?.remaining_approved_qty,
            supplier_name: data?.supplier_name,
            total_Amount: data?.total_Amount,
            punch_at: data.punch_at,
            complaint_id: data.complaint_id,
            user_id: data.user_id,
            total_price: 0,
            fund_id: data.fund_id,
          };
      })
      .filter((item) => item !== undefined);

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
  }, []);

  const itemFormatOptionLabel = ({ label, unique_id, image }) => (
    <div className="d-flex">
      <img
        src={`${process.env.REACT_APP_API_URL}${image}`}
        className="avatar me-2"
      />
      <span className="small d-grid">
        <span>{label}</span>
        <span className="text-gray">{unique_id}</span>
      </span>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          {type === "view" ? "View" : "Create"} Expense Punch · CMS Electricals
        </title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${type === "view" ? "View" : "Approve"} Expense Punch`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              expense_punch_for:
                (edit.length > 0 && edit?.[0]?.expense_punch_for) || 1,
              end_users_id: edit?.[0]?.end_users_id || "",
              supervisor_id: edit?.[0]?.supervisor_id || "",
              office_users_id: "",
              area_manager_id: edit?.[0]?.area_manager_id || "",

              items: allItems || [
                {
                  item_name: "",
                  prev_qty: "",
                  prev_amount: "",
                  qty: "",
                  amount: "",
                  sub_total: "",
                },
              ],
              payment_images: [{ image: "", title: "" }],
              user_id: edit[0]?.user_id,
              complaint_id: edit[0]?.complaint_id || "",
            }}
            // validationSchema={addStockPunchSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    {type === "view" ? (
                      <ViewExpensePunch edit={edit} />
                    ) : (
                      <>
                        <FieldArray name="items ">
                          {({ remove, push }) => (
                            <div className="table-scroll p-2 my-3">
                              <span>
                                {" "}
                                User Name :{" "}
                                <span className="fw-bold">
                                  {" "}
                                  {edit[0]?.user_name ?? "--"}
                                </span>
                              </span>
                              <br />
                              <span>
                                {" "}
                                Complain No. :{" "}
                                <span className="fw-bold">
                                  {" "}
                                  {edit[0]?.complaint_unique_id ?? "--"}
                                </span>
                              </span>

                              {props.values.expense_punch_for == 2 && (
                                <div className=" mb-4 ">
                                  Manager Name:{" "}
                                  <span className="fw-bold">
                                    {props.values?.area_manager_id?.name ??
                                      "--"}
                                  </span>
                                  <br />
                                  {props.values?.supervisor_id?.name && (
                                    <span>
                                      {" "}
                                      Supervisor Name:{" "}
                                      <span className="fw-bold">
                                        {" "}
                                        {props.values?.supervisor_id?.name ??
                                          "--"}
                                      </span>
                                    </span>
                                  )}
                                  <br />
                                  {props.values?.end_users_id?.name && (
                                    <span>
                                      Enduser Name:{" "}
                                      <span className="fw-bold">
                                        {" "}
                                        {props.values?.end_users_id?.name ??
                                          "--"}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              )}

                              {props.values.items.length > 0 && (
                                <Table
                                  striped
                                  hover
                                  className="text-body bg-new Roles my-3"
                                >
                                  <thead>
                                    <tr>
                                      <th>Item Name</th>
                                      <th>Punch Quantity</th>
                                      <th>Approve Quantity</th>
                                      <th>Total Price </th>
                                      <th>payment Mode</th>
                                      <th>Transaction Id </th>
                                      <th>Punch Date & Time</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {props.values.items.map((itm, index) => (
                                      <tr key={index}>
                                        <td width={"150px"}>
                                          <Select
                                            className="text-start"
                                            menuPortalTarget={document.body}
                                            name={`items.${index}.item_name`}
                                            value={{
                                              label: itm?.item_name,
                                              image: itm?.item_images,
                                            }}
                                            isDisabled
                                            formatOptionLabel={
                                              itemFormatOptionLabel
                                            }
                                          />
                                          <ErrorMessage
                                            name={`items.${index}.item_name`}
                                            component="span"
                                            className="text-danger"
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            name={`items.${index}.qty`}
                                            placeholder="0"
                                            value={itm.remaining_approved_qty}
                                            disabled
                                            onChange={props.handleChange}
                                          />
                                        </td>

                                        <td>
                                          <Form.Control
                                            name={`items.${index}.approved_qty`}
                                            onChange={(e) => {
                                              const maxValue =
                                                +itm.remaining_approved_qty;

                                              if (
                                                +e.target.value <= +maxValue
                                              ) {
                                                props.handleChange(e);

                                                props.setFieldValue(
                                                  `items.${index}.total_price`,
                                                  +e.target.value *
                                                    +itm?.item_price
                                                );
                                              } else {
                                                e.target.value = +maxValue;
                                                props.handleChange(e);

                                                props.setFieldValue(
                                                  `items.${index}.total_price`,
                                                  +e.target.value *
                                                    +itm?.item_price
                                                );
                                              }
                                            }}
                                          />
                                          <ErrorMessage
                                            name={`items.${index}.approved_qty`}
                                            component="span"
                                            className="text-danger"
                                          />
                                        </td>

                                        <td>
                                          <Form.Control
                                            name={`items.${index}.total_price`}
                                            placeholder="0"
                                            value={itm.total_price}
                                            onChange={props.handleChange}
                                            disabled
                                          />
                                        </td>

                                        <td>
                                          <Form.Group>
                                            <Select
                                              menuPortalTarget={document.body}
                                              placeholder="Payment Mode"
                                              name={`items.${index}.payment_mode`}
                                              options={[
                                                { label: "UPI", value: "upi" },
                                                {
                                                  label: "Net Banking",
                                                  value: "net_banking",
                                                },
                                              ]}
                                              onChange={(e) => {
                                                props.setFieldValue(
                                                  `items.${index}.payment_mode`,
                                                  e?.value
                                                );
                                              }}
                                            />
                                          </Form.Group>
                                        </td>

                                        <td>
                                          <Form.Control
                                            name={`items.${index}.transaction_id`}
                                            onChange={props.handleChange}
                                          />
                                          <ErrorMessage
                                            name={`items.${index}.transaction_id`}
                                            component="span"
                                            className="text-danger"
                                          />
                                        </td>

                                        <td>{itm?.punch_at}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              )}
                              <div className="mt-2 text-end fs-6 fw-bold">
                                Total Amount{" "}
                                {props.values.items.reduce(
                                  (total, item) => total + item.total_price,
                                  0
                                ) || 0}
                              </div>
                            </div>
                          )}
                        </FieldArray>
                        <FieldArray name={`payment_images`}>
                          {({
                            push: pushPaymentImage,
                            remove: removePaymentImage,
                          }) => (
                            <PaymentImages
                              props={props}
                              id={id}
                              pushPaymentImage={pushPaymentImage}
                              removePaymentImage={removePaymentImage}
                            />
                          )}
                        </FieldArray>
                        <Form.Group as={Col} md={12}>
                          <div className="mt-2 text-center">
                            <button
                              type={`button`}
                              onClick={() => setShowAlert(true)}
                              disabled={props?.isSubmitting}
                              className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                            >
                              {props?.isSubmitting ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                    size="sm"
                                  />
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>Submit</>
                              )}
                            </button>
                            {(props.values.items.reduce(
                              (total, item) => total + item.total_price,
                              0
                            ) || 0) > edit[0]?.users_limt && (
                              <span className="text-danger">
                                * Wallet Balance is Low
                              </span>
                            )}
                            <ConfirmAlert
                              size={"sm"}
                              defaultIcon={<BsQuestionLg />}
                              deleteFunction={props.handleSubmit}
                              hide={setShowAlert}
                              show={showAlert}
                              title={"Confirm Punch"}
                              description={
                                "Are you sure you want to punch this!!"
                              }
                            />
                          </div>
                        </Form.Group>
                      </>
                    )}
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default ApproveExpenseRequest;
