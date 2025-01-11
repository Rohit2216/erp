import React, { useState } from 'react';
import { Formik, FieldArray } from 'formik';
import { Card, Col, Row, Form, Spinner, Table } from 'react-bootstrap';
import Select from 'react-select';
import TooltipComponent from '../../components/TooltipComponent';
import { BsDashLg, BsPlusLg, BsXLg } from 'react-icons/bs';
import { getAdminAllSurveyItemMaster, getAdminAllSurveyPurposeMaster, getAdminCreateSurvey, getAdminSingleSurvey, getAdminUpdateSurvey } from '../../services/authapi';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmAlert from '../../components/ConfirmAlert';

const CreateSurveyItemTable = () => {
    const [qty, setQty] = useState(0);
    const [edit, setEdit] = useState({});
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [itemMasterData, setItemMasterData] = useState([]);
    const [purposeMasterData, setPurposeMasterData] = useState([]);
    const { id } = useParams();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const sData = {
            format: 'Add Item Table',
            title: values.title,
            description: values.description,
            questions: values.questions
        }
        if (edit.survey_id) {
            sData["id"] = edit?.survey_id
        }
        // return console.log('form-Data', sData)
        const res = edit?.survey_id ? await getAdminUpdateSurvey(sData) : await getAdminCreateSurvey(sData);
        if (res.status) {
            toast.success(res.message);
            navigate("/AllSurvey");
        } else {
            toast.error(res.message);
        }
        resetForm();
        setSubmitting(false);
    };

    const fetchSingleSurveyData = async () => {
        const res = await getAdminSingleSurvey(id);
        if (res.status) {
            setEdit(res.data)
        } else {
            setEdit({})
        }
    }

    const fetchAllItemMasterData = async () => {
        const res = await getAdminAllSurveyItemMaster()
        if (res.status) {
            setItemMasterData(res.data)
        } else {
            setItemMasterData([])
        }
    }

    const fetchAllPurposeMasterData = async () => {
        const res = await getAdminAllSurveyPurposeMaster()
        if (res.status) {
            setPurposeMasterData(res.data)
        } else {
            setPurposeMasterData([])
        }
    }

    useEffect(() => {
        fetchAllItemMasterData();
        fetchAllPurposeMasterData();
        if (id !== 'new') {
            fetchSingleSurveyData();
        }
    }, [id])

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                format: edit?.format ? { value: edit?.format, label: edit?.format } : { value: "Add General Field", label: "Add General Field" },
                title: edit.title || "",
                description: edit.description || "",
                questions: edit?.survey_questions?.map(item => JSON.parse(item.question)) || [
                    {
                        item: "",
                        purpose: "",
                        minqty: "",
                        userinput: "",
                    },
                ],
            }}
            // validationSchema={addEnergySchema}
            onSubmit={handleSubmit}>
            {(props) => (
                <Form onSubmit={props?.handleSubmit}>
                    <Row className='g-4'>
                        <Col className='mx-auto' md={12}>
                            <div className='d-grid gap-2'>
                                <Card className="bg-new border-info border-5 border-top">
                                    <Card.Body>
                                        <Form.Control
                                            placeholder="Survey Title"
                                            type="text"
                                            name={"title"} value={props.values.title} onChange={props.handleChange}
                                            className='fs-4 shadow-none border-primary rounded-0 border-1 border-bottom' />
                                        <Form.Control type="text"
                                            name={"description"} value={props.values.description} onChange={props.handleChange}
                                            className='shadow-none border-primary rounded-0 border-1 border-bottom'
                                            placeholder="Survey description" />
                                    </Card.Body>
                                </Card>
                                <FieldArray name="questions">
                                    {({ remove, push }) => (
                                        <Table className='text-body bg-new Roles'>
                                            <thead className='text-truncate'>
                                                <tr>
                                                    {['Sr No.', 'Item', 'Purpose', 'Min Qty', 'User Input', <><TooltipComponent align="left" title={'Add Row'}>
                                                        <button type='button' onClick={() => push({ item: '', purpose: '', minqty: '', userinput: '' })} className='shadow border-0 p-2 success-combo cursor-pointer d-align gap-1'><BsPlusLg className='cursor-pointer' /></button>
                                                    </TooltipComponent></>].map((thead) => (
                                                        <th key={thead}>{thead}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.values.questions.length > 0 &&
                                                    props.values.questions.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <Select
                                                                    className='w-100 text-primary'
                                                                    menuPortalTarget={document.body}
                                                                    name={`questions.${index}.item`}
                                                                    options={
                                                                        itemMasterData.map((itm) => ({
                                                                            label: itm.name,
                                                                            value: itm.id
                                                                        }))
                                                                    }
                                                                    value={data.item}
                                                                    onChange={(selectedOption) => {
                                                                        props.setFieldValue(`questions.${index}.item`, selectedOption)
                                                                    }
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <Select
                                                                    className='w-100 text-primary'
                                                                    menuPortalTarget={document.body}
                                                                    name={`questions.${index}.purpose`}
                                                                    options={
                                                                        purposeMasterData.map((itm) => ({
                                                                            label: itm.name,
                                                                            value: itm.id
                                                                        }))
                                                                    }
                                                                    value={data.purpose}
                                                                    onChange={(selectedOption) => {
                                                                        props.setFieldValue(`questions.${index}.purpose`, selectedOption)
                                                                    }
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <div className='d-flex h-100'>
                                                                    <div className='shadow cursor-pointer d-align red-combo px-2' onClick={() => {
                                                                        setQty(qty - 1);
                                                                        props.setFieldValue(`questions.${index}.minqty`, qty - 1);
                                                                    }}><BsDashLg /></div>
                                                                    <Form.Control className='w-auto' type="number" name={`questions.${index}.minqty`} value={data.minqty}
                                                                        onChange={props.handleChange}
                                                                    />
                                                                    <div className='shadow cursor-pointer d-align success-combo px-2' onClick={() => {
                                                                        setQty(qty + 1);
                                                                        props.setFieldValue(`questions.${index}.minqty`, qty + 1);
                                                                    }}><BsPlusLg /></div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Form.Control type="text"
                                                                    name={`questions.${index}.userinput`} value={data.userinput} onChange={props.handleChange}
                                                                    placeholder="Type here.." />
                                                            </td>
                                                            <td>
                                                                <TooltipComponent align="left" title={'Delete Row'}>
                                                                    <BsXLg onClick={() => index !== 0 && remove(index)} className='social-btn red-combo' />
                                                                </TooltipComponent>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </FieldArray>
                                <div className="text-center mt-3">
                                    <button
                                        type={`${edit?.survey_id ? 'button' : 'submit'}`}
                                        onClick={() => setShowAlert(edit?.survey_id && true)}
                                        disabled={props?.isSubmitting}
                                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1">
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
                                            <>{edit?.survey_id ? "UPDATE" : "Submit"}</>
                                        )}
                                    </button>
                                    <ConfirmAlert
                                        size={"sm"}
                                        deleteFunction={props.handleSubmit}
                                        hide={setShowAlert}
                                        show={showAlert}
                                        title={"Confirm UPDATE"}
                                        description={"Are you sure you want to update this!!"}
                                    />
                                </div>
                                {/* <div className='text-secondary cursor-pointer'>{t('Clear Form')}</div> */}
                            </div>
                        </Col>
                    </Row>
                </Form>
            )}
        </Formik>
    )
}

export default CreateSurveyItemTable;
