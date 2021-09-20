import {React, useState} from 'react'
import { useSelector } from 'react-redux'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col } from "react-bootstrap";
import { Formik,  Field } from "formik";
import { mutateAttentively } from "../../utils";

import * as yup from "yup";

export const AffiliationToUserListItem = ({affiliation, organization, deleteAffiliation, updateAffiliation}) => {

  const schema = yup.object().shape({
    position: yup.string()
    .required("Должность обязательна")
    .max(100, "Должность должна иметь меньше 64 букв"),
    is_main_affiliation: yup.mixed(),
  });

  return(
    <div className="affiliation-to-user">
      <Formik
        validationSchema={schema}
        onSubmit={async (values, {setSubmitting}) => {
          setSubmitting(true);
          mutateAttentively(() => updateAffiliation({id: affiliation.id, ...values}), "affiliation")
          setSubmitting(false);
        }}
        initialValues={{
          position: affiliation.position,
          is_main_affiliation: affiliation.is_main_affiliation,
        }}
      >
      {({values, handleSubmit, handleBlur, handleChange, touched, errors}) =>
        <Form>
        <Row>
          <Form.Group as={Col} md="5" className="mb-2" controlId="validationFormik00">
            <Form.Label>Организация</Form.Label>
            <Form.Control
              type="text"
              name="orgTitle"
              value={organization.title}
              disabled={true}
              />
          </Form.Group>
          <Form.Group as={Col} md="7" className="mb-2" controlId="validationFormik00">
            <Form.Label>Должность</Form.Label>
            <Form.Control md="5"
              type="text"
              name="position"
              value={values.position}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={touched.position && !!errors.position}
              />
            <Form.Control.Feedback type="invalid">
              {errors.position}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group className="mb-2" className="check-is_main_affiliation" controlId="validationFormik00">
            <Form.Label> Основная аффилиация: </Form.Label>
            <Field className="form-check-input" type="checkbox" name="is_main_affiliation" />
        </Form.Group>
          <div className="edit-delete-buttons">
            <Button onClick={handleSubmit}>Сохранить</Button>
            <Button onClick={() => deleteAffiliation(affiliation.id)}>Удалить</Button>
          </div>
        </Form>}
      </Formik>
    </div>
  )
} 