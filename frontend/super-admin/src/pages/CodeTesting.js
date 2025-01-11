import React from "react";
import { Formik, Field, Form } from "formik";

const CodeTesting = () => {
  const [cart, setCart] = React.useState([
    { id: 1, product_name: "Product 1", product_qty: 1 },
    { id: 2, product_name: "Product 2", product_qty: 2 },
  ]);

  const handleDecrement = (card_id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === card_id
          ? {
              ...item,
              product_qty: item.product_qty > 1 ? item.product_qty - 1 : 1,
            }
          : item
      )
    );
  };

  const handleIncrement = (card_id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === card_id
          ? {
              ...item,
              product_qty: item.product_qty < 10 ? item.product_qty + 1 : 10,
            }
          : item
      )
    );
  };

  return (
    <Formik
      initialValues={
        {
          /* your initial form values here */
        }
      }
      onSubmit={(values, actions) => {
        // Handle form submission logic here
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          {/* Your form fields go here */}
          <Field
            type="text"
            name="fieldName"
            value={values.fieldName}
            onChange={handleChange}
          />
          {/* Other form fields */}

          {/* Example of using setFieldValue */}
          <button
            type="button"
            onClick={() => setFieldValue("fieldName", "new value")}
          >
            Set Field Value
          </button>

          {/* Example of using handleIncrement and handleDecrement */}
          {cart.map((item) => (
            <div key={item.id}>
              <p>{item.product_name}</p>
              <button type="button" onClick={() => handleDecrement(item.id)}>
                Decrement
              </button>
              <p>Quantity: {item.product_qty}</p>
              <button type="button" onClick={() => handleIncrement(item.id)}>
                Increment
              </button>
            </div>
          ))}

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default CodeTesting;
