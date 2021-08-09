import React from 'react'
import { useFormik } from "formik"
import Form from "react-bootstrap/Form"
import { Row } from 'react-bootstrap';
import * as yup from "yup";


export const AddObjectToUser = ({userId, objects, addJoinObject, foreignKeyToObject}) => {
    
    const schema = yup.object().shape({
        [foreignKeyToObject]: yup.string()
          .required("")
    });
    
    const formik = useFormik({
        validationSchema: schema,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            await addJoinObject({user: userId, [foreignKeyToObject]: values[foreignKeyToObject]})
            setSubmitting(false)
        },
        initialValues: {
            [foreignKeyToObject]: null,
        }
    })

    const objectsOptions = Object.values(objects).map(obj => 
        <option key={obj.id} value={obj.id}>{obj.title}</option>
    )
    return(
        <React.Fragment>
            <Form.Select 
                style={{display: "inline-block", width: "auto", "border-radius": "10px"}}
                name={foreignKeyToObject}
                value={formik.values[foreignKeyToObject]}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                isInvalid={formik.touched[foreignKeyToObject] && !!formik.errors[foreignKeyToObject]}
            >
                <option value={null}></option>
                {objectsOptions}
            </Form.Select>
            <button
                className="muted-button"
                onClick={formik.handleSubmit}
                style={{color: "green"}}>
                &#10010;
            </button>
        </React.Fragment>
    )
} 