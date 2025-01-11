import { useEffect, useState } from "react";
import { Col, Form, FormGroup, Row, Spinner } from 'react-bootstrap'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldArray, Formik } from "formik";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { getAdminSingleSurvey, postOtpSurvey, postOtpVerifySurvey, postQuestionsSurvey } from "../../services/authapi";

const ViewItemSurvey = () => {
    const { id } = useParams();
    const [otpData, setOtpData] = useState(false)
    const [verifyOtp, setVerifyOtp] = useState(false)
    const [responseData, setResponseData] = useState({})
    const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
    const navigate = useNavigate();
    const handelChange = (element, index, e) => {
        if (isNaN(element?.value)) return false;
        if (e.key === "Backspace") {
            if (element?.previousSibling != null) {
                element?.previousSibling?.focus();
            }
            if (index === otpArray.length - 1) {
                setOtpArray([...otpArray?.map((item, currentIndex) => (index === currentIndex) ? "" : item)]);
            } else {
                setOtpArray([...otpArray?.map((item, currentIndex) => (index === currentIndex) ? element?.value : item)]);
            }
        } else {
            setOtpArray([...otpArray?.map((item, currentIndex) => (index === currentIndex) ? element?.value : item)]);
            if (element?.nextSibling != null && element?.value) {
                element?.nextSibling?.focus();
            }
        }
    }
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const sData = {
            id: id,
        }
        if (otpData === false) {
            sData["mobile"] = values.mobile;
        }
        if (otpData === true) {
            sData["otp"] = otpArray?.join("");
        }
        // return console.log('form-Data', sData)
        const res = otpData == false ? await postOtpSurvey(sData) : await postOtpVerifySurvey(sData);
        if (res.status) {
            toast.success(res.message);
            setOtpData(true)
            if (otpData == true) {
                setVerifyOtp(true)
            }
            if (otpData == true) {
                const response = await getAdminSingleSurvey(id);
                if (response.status) {
                    setResponseData(response.data)
                } else {
                    setResponseData({})
                }
            }
            // navigate("/AllSurvey");
        } else {
            toast.error(res.message);
        }
        resetForm();
        setSubmitting(false);
    };

    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        const questionId = responseData?.survey_questions?.map((itm) => { return itm?.question_id })
        const sData = {
            response: values.response,
            survey_id: responseData?.survey_id,
            question_id: questionId,
        }
        // return console.log('form-Data', sData)
        const res = await postQuestionsSurvey(sData);
        if (res.status) {
            toast.success(res.message);
            navigate("/ResponseSurvey");
        } else {
            toast.error(res.message);
        }
        resetForm();
        setSubmitting(false);
    };

    const fetch = async () => {
        const response = await getAdminSingleSurvey(id);
        if (response.status) {
            setResponseData(response.data)
        } else {
            setResponseData({})
        }
    }

    useEffect(() => {
        fetch()
    }, [])

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                response: [{
                    'answer': [''],
                }]
            }}
            // validationSchema={addEnergySchema}
            onSubmit={handleFormSubmit}>
            {(props) => (
                <Form onSubmit={props?.handleSubmit}>
                    <FieldArray name="response">
                        <SimpleBar className='area'>
                            <div className='d-grid gap-2 px-3 pt-1 pb-3'>
                                {responseData?.survey_questions?.map((data, index) => {
                                    const questionData = data.question;
                                    return (
                                        <div className="border-orange border-5 border-start shadow p-3" key={index}>
                                            <Row className="g-3">
                                                <FormGroup as={Col} md={6}>
                                                    <Form.Label>{index + 1}. item</Form.Label>
                                                    <Form.Control onChange={props.handleChange} name={`response.${index}.answer`} value={questionData.item.label} type={'text'} disabled />
                                                </FormGroup>
                                                <FormGroup as={Col} md={6}>
                                                    <Form.Label>purpose</Form.Label>
                                                    <Form.Control onChange={props.handleChange} name={`response.${index}.answer`} value={questionData.purpose.label} type={'text'} disabled />
                                                </FormGroup>
                                                <FormGroup as={Col} md={6}>
                                                    <Form.Label>minqty</Form.Label>
                                                    <Form.Control onChange={props.handleChange} name={`response.${index}.answer`} value={questionData.minqty} type={'text'} disabled />
                                                </FormGroup>
                                                <FormGroup as={Col} md={6}>
                                                    <Form.Label>userinput</Form.Label>
                                                    <TextareaAutosize onChange={props.handleChange} className="edit-textarea" name={`response.${index}.answer`} type={'text'} />
                                                </FormGroup>
                                            </Row>
                                        </div>
                                    )
                                })}
                            </div>
                        </SimpleBar>
                    </FieldArray>
                    <button
                        type="submit"
                        // disabled={props?.isSubmitting}
                        className="shadow border-0 mx-3 mt-3 purple-combo cursor-pointer px-4 py-1">
                        {/* {props?.isSubmitting ? (
                            <>
                                <Spinner
                                    animation="border"
                                    variant="info"
                                    size="sm"
                                /> PLEASE WAIT...
                            </>
                        ) : ( */}
                        SUBMIT
                        {/* )} */}
                    </button>
                    {/* <div className='social-btn-re success-combo d-align gap-2 mx-3 px-3 w-auto justify-content-between'>
                        Submit
                    </div> */}
                </Form>
            )}
        </Formik>
    )
}

export default ViewItemSurvey