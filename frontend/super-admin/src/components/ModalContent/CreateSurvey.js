// import React from 'react'
// // import CardComponent from '../CardComponent'
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import FormSelect from '../FormSelect';
// import { Col, Form, Row } from 'react-bootstrap';

// const CreateSurvey = () => {
//     const { quillRef } = useQuill();
//     return (
//         // <CardComponent title={'Survey Information'}>
//         //     <div ref={quillRef} style={{ height: '200px' }} />
//         // </CardComponent>
//         <Row className='g-4'>
//             <Col md={12}>
//                 <Form.Label>Assign User Name</Form.Label>
//                 <Form.Control type="text" required />
//             </Col>
//             <Col md={12}>
//                 <FormSelect label={'Select Survey'} option={['Sub Users', 'Outlets']} />
//             </Col>
//             <Col md={12}>
//                 <Form.Label>Mobile Number</Form.Label>
//                 <Form.Control type="number" required />
//             </Col>
//         </Row>
//     )
// }

// export default CreateSurvey



import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // import the Quill styles
import FormSelect from '../FormSelect';
import { Col, Form, Row } from 'react-bootstrap';

const CreateSurvey = () => {
    const quillRef = useRef(null);  // Use useRef to create a reference to the Quill editor

    return (
        <Row className='g-4'>
            <Col md={12}>
                <Form.Label>Assign User Name</Form.Label>
                <Form.Control type="text" required />
            </Col>
            <Col md={12}>
                <FormSelect label={'Select Survey'} option={['Sub Users', 'Outlets']} />
            </Col>
            <Col md={12}>
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control type="number" required />
            </Col>
            {/* React Quill editor */}
            <Col md={12}>
                <Form.Label>Survey Content</Form.Label>
                <ReactQuill ref={quillRef} style={{ height: '200px' }} />
            </Col>
        </Row>
    )
}

export default CreateSurvey;
