import { ErrorMessage, FieldArray } from "formik";
import React, { useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import Select from "react-select";
import TooltipComponent from "../../components/TooltipComponent";
import { BsChevronDown, BsChevronUp, BsDashLg, BsPlusLg } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";
import { useTranslation } from "react-i18next";

export default function TablePurchaseOrder({
  props,
  edit,
  gstTypesData,
  loading,
}) {
  const [collapsedRows, setCollapsedRows] = useState("");
  const { t } = useTranslation();

  const toggleRow = (index) => {
    if (collapsedRows === index) setCollapsedRows("");
    else setCollapsedRows(index);
  };
  return (
    <>
      <Form.Group as={Col} md={12}>
        <FieldArray name="po_items">
          {({ remove, push }) => (
            <>
              {props.values.po_items.length > 0 && (
                <Table className="text-body Roles">
                  <thead>
                    <tr>
                      <th style={{ minWidth: "80px" }}>
                        {t("Order Line Number")}
                      </th>
                      <th style={{ minWidth: "80px" }}>{t("Hsn Code")}</th>
                      <th style={{ minWidth: "200px" }}>{t("Item Name")}</th>
                      <th style={{ minWidth: "100px" }}>{t("Unit")}</th>
                      <th style={{ minWidth: "120px" }}>
                        {t("change gst type")}
                      </th>
                      <th style={{ minWidth: "120px" }}>{t("gst type")}</th>
                      <th style={{ minWidth: "60px" }}>{t("gst")} %</th>
                      <th style={{ minWidth: "95px" }}>{t("Rate")}</th>
                      <th style={{ minWidth: "80px" }}>{t("quantity")}</th>
                      <th style={{ minWidth: "95px" }}>{t("Amount")}</th>
                      <th style={{ minWidth: "90px" }}>{t("Action")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={9}>
                          <img
                            className="p-3"
                            width="250"
                            src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                            alt="Loading"
                          />
                        </td>
                      </tr>
                    ) : (
                      props.values.po_items.map((itm, index) => (
                        <>
                          <tr key={index}>
                            <td>
                              <Form.Control
                                name={`po_items.${index}.OrderLineNumber`}
                                value={itm.OrderLineNumber}
                                onChange={props.handleChange}
                              />
                            </td>

                            <td>
                              <Form.Control
                                name={`po_items.${index}.HsnCode`}
                                value={itm.HsnCode}
                                onChange={props.handleChange}
                              />
                            </td>
                            <td className="text-start" width={230}>
                              <Form.Control
                                name={`po_items.${index}.Name`}
                                value={itm.Name}
                                onChange={props.handleChange}
                              />
                              <ErrorMessage
                                name={`po_items.${index}.Name`}
                                component="div"
                                className="field-error"
                              />
                            </td>

                            <td>
                              <Form.Control
                                name={`po_items.${index}.Unit`}
                                value={itm.Unit}
                                onChange={props.handleChange}
                              />
                            </td>

                            <td>
                              <Select
                                name={`po_items.[${index}].change_gst_type`}
                                menuPortalTarget={document.body}
                                defaultValue={{
                                  label: "overall",
                                  value: "0",
                                }}
                                value={
                                  itm?.change_gst_type == "1"
                                    ? {
                                        label: "individual",
                                        value: "1",
                                      }
                                    : {
                                        label: "overall",
                                        value: "0",
                                      }
                                }
                                options={[
                                  {
                                    label: "individual",
                                    value: "1",
                                  },
                                  {
                                    label: "overall",
                                    value: "0",
                                  },
                                ]}
                                onChange={(e) => {
                                  props.setFieldValue(
                                    `po_items.[${index}].change_gst_type`,
                                    e.value
                                  );

                                  if (e.value == "1") {
                                    const subTotal = +itm.Qty * +itm.Rate;

                                    const totalGSTAmount =
                                      subTotal * (itm.gst_percent / 100);

                                    props.setFieldValue(
                                      `po_items.${index}.totalGSTAmount`,
                                      +totalGSTAmount.toFixed(2)
                                    );
                                  } else {
                                    props.setFieldValue(
                                      `po_items.${index}.Amount`,
                                      itm.Qty * itm.Rate
                                    );
                                  }
                                }}
                              />
                            </td>

                            {props.values.po_items[index].change_gst_type ==
                            "1" ? (
                              <>
                                <td>
                                  <Select
                                    menuPortalTarget={document.body}
                                    name={`po_items.${index}.gst_id`}
                                    value={
                                      edit?.id && {
                                        label: itm?.gst_type,
                                        percentage: itm?.gst_percent,
                                        value: itm?.gst_id?.value,
                                      }
                                    }
                                    options={gstTypesData?.map((itm) => ({
                                      label: itm.title,
                                      value: itm.id,
                                      percentage: itm.percentage,
                                    }))}
                                    onChange={(e) => {
                                      props.setFieldValue(
                                        `po_items.${index}.gst_type`,
                                        e.label
                                      );

                                      const subTotal = +itm.Qty * +itm.Rate;
                                      const totalGSTAmount =
                                        subTotal * (e.percentage / 100);

                                      props.setFieldValue(
                                        `po_items.${index}.Amount`,
                                        +subTotal
                                      );

                                      props.setFieldValue(
                                        `po_items.${index}.totalGSTAmount`,
                                        +totalGSTAmount.toFixed(2)
                                      );

                                      props.setFieldValue(
                                        `po_items.${index}.gst_percent`,
                                        e.percentage
                                      );
                                      props.setFieldValue(
                                        `po_items.${index}.gst_id`,
                                        e
                                      );
                                    }}
                                  />
                                </td>
                                <td className="text-center">
                                  {itm.gst_percent}
                                </td>
                              </>
                            ) : (
                              <>
                                <td></td>
                                <td></td>
                              </>
                            )}

                            <td>
                              <Form.Control
                                name={`po_items.${index}.Rate`}
                                value={itm.Rate}
                                type="number"
                                onChange={(e) => {
                                  props.setFieldValue(
                                    `po_items.${index}.Rate`,
                                    +e.target.value
                                  );

                                  const subTotal =
                                    +e.target.value * +itm?.Qty || 0;

                                  const totalGSTAmount =
                                    subTotal * (itm.gst_percent / 100);

                                  props.setFieldValue(
                                    `po_items.${index}.totalGSTAmount`,
                                    +totalGSTAmount.toFixed(2)
                                  );

                                  props.setFieldValue(
                                    `po_items.${index}.Amount`,
                                    parseFloat(subTotal).toFixed(2)
                                  );
                                }}
                              />
                            </td>

                            <td>
                              <Form.Control
                                name={`po_items.${index}.Qty`}
                                placeholder="0"
                                value={props.values.po_for == "2" ? 0 : itm.Qty}
                                type="number"
                                disabled={props.values.po_for == "2"}
                                onChange={(e) => {
                                  props.setFieldValue(
                                    `po_items.${index}.Qty`,
                                    e.target.value
                                  );
                                  const subTotal = +e.target.value * itm?.Rate;

                                  if (itm.change_gst_type != "1")
                                    props.setFieldValue(
                                      `po_items.${index}.Amount`,
                                      parseFloat(subTotal).toFixed(2)
                                    );
                                  else {
                                    const totalGSTAmount =
                                      subTotal * (itm.gst_percent / 100);

                                    props.setFieldValue(
                                      `po_items.${index}.Amount`,
                                      parseFloat(subTotal).toFixed(2)
                                    );

                                    props.setFieldValue(
                                      `po_items.${index}.totalGSTAmount`,
                                      +totalGSTAmount.toFixed(2)
                                    );
                                  }
                                }}
                              />

                              <ErrorMessage
                                name={`po_items.${index}.Qty`}
                                component="span"
                                className="text-danger"
                              />
                            </td>

                            <td>
                              ₹ {""}
                              <span>
                                {props.values.po_for == "2"
                                  ? 0
                                  : parseFloat(+itm.Amount).toFixed(2)}
                              </span>
                            </td>

                            <td className="">
                              <>
                                <span
                                  className={`mx-2 cursor-pointer  text-${
                                    collapsedRows === index ? "danger" : "green"
                                  }`}
                                  onClick={() => toggleRow(index)}
                                >
                                  {collapsedRows === index ? (
                                    <BsChevronUp fontSize="15px" />
                                  ) : (
                                    <BsChevronDown fontSize="15px" />
                                  )}
                                </span>

                                {index === 0 ? (
                                  <TooltipComponent title={"Add"}>
                                    <BsPlusLg
                                      onClick={() =>
                                        push({
                                          item_id: "",
                                          gst_id:
                                            edit?.po_for === "1"
                                              ? ""
                                              : undefined,
                                          gst_percent:
                                            edit?.po_for === "1"
                                              ? ""
                                              : undefined,
                                          amount: "",
                                          qty: "",
                                          Amount: "",
                                        })
                                      }
                                      className={`social-btn success-combo`}
                                    />
                                  </TooltipComponent>
                                ) : (
                                  <TooltipComponent title={"Remove"}>
                                    <BsDashLg
                                      onClick={() => remove(index)}
                                      className={`social-btn red-combo`}
                                    />
                                  </TooltipComponent>
                                )}
                              </>
                            </td>
                          </tr>
                          {collapsedRows === index && (
                            <tr>
                              <td></td>
                              <td></td>
                              <td colSpan={3}>
                                <TextareaAutosize
                                  minRows={1}
                                  name={`po_items.${index}.description`}
                                  value={itm.description}
                                  placeholder="enter item description"
                                  onChange={props.handleChange}
                                  className="edit-textarea"
                                />
                              </td>
                            </tr>
                          )}
                        </>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </FieldArray>
      </Form.Group>
    </>
  );
}
