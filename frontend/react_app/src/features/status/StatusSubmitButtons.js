import React from 'react'
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

import { useFormik } from "formik"
import * as yup from "yup";


function submitButtonsFactory(submitMessage, status, handleChangeStatus, handleSubmit){
    return(<Button 
            onClick={() => {
                handleChangeStatus(status)
                handleSubmit()
            }}
            >
            {submitMessage}
            </Button>
        )
}


export const StatusSubmitButtons = ({is_moderator, status, updateObject, objectId}) => {
    
    const schema = yup.object().shape({
        comment: yup.string()
          .max(200, "Комментарий должен иметь меньше 200 букв"),
        //   check that comment exists if status REJECTED
      });
    
    const formik = useFormik({
        validationSchema: schema,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            updateObject({...values, id: objectId})
                .unwrap()
                .catch(err => console.log("Change of status failed", err))
                .then(res => setSubmitting(false))
        },
        initialValues:{
            comment: "",
            status: status,
        }
    });

    if (!is_moderator && ["APPROVED", "REJECTED"].includes(status)){
        return (<div></div>)
    }
    else{
        
        let submitCodes
        
        if (is_moderator){
            submitCodes = [["Вернуть на доработку", "RETURNED"], ["Одобрить", "APPROVED"], ["Отклонить", "REJECTED"]]

            return(
                <Form>
                    <Form.Group  controlId="validationFormik02">
                    <Form.Label>Комментарий</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="comment"
                        value={formik.values.comment}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        isInvalid={formik.touched.comment && !!formik.errors.comment}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.comment}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <div className="status-change-buttons">
                        {submitCodes.map(
                            code => submitButtonsFactory(
                                code[0],
                                code[1],
                                (status) => formik.setFieldValue("status", code[1]),
                                formik.handleSubmit
                            )
                        )}
                    </div>
                </Form>
            )
        }
        else{
            submitCodes = [["Сохранить профиль как черновик", "DRAFT"], ["Отправить профиль на рассмотрение", "PROCESS"]]
            return(
                <React.Fragment>
                <Form>
                    <Form.Group controlId="validationFormik02">
                    <Form.Label>Комментарий для модератора</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="comment"
                        value={formik.values.comment}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        isInvalid={formik.touched.comment && !!formik.errors.comment}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.comment}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <div className="status-change-buttons">
                        {submitCodes.map(
                            code => submitButtonsFactory(
                                code[0],
                                code[1],
                                (status) => formik.setFieldValue("status", code[1]),
                                formik.handleSubmit
                            )
                        )}
                    </div>
                </Form>
                </React.Fragment>
            )
        }
    }
} 