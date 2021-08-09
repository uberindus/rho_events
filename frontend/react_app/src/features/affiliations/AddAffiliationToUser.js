import {React, useState} from 'react'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col } from "react-bootstrap";

import * as yup from "yup";
import { Formik,  Field } from "formik";
  
import { useAddAffiliationsMutation, useAddOrganizationsMutation } from "../../api";

function isOrganizationValid(organizations, customOrgTitle){
  let isValid = true
  organizations.forEach(org => {
    if (org.title === customOrgTitle){
      isValid = false 
    }
  })
  return isValid
}

export const AddAffiliationToUser = ({userId, organizations}) => {
  
  const [isCustomOrg, setIsCustomOrg] = useState(false)
  
  const [ addAffiliations, ] = useAddAffiliationsMutation()
  const [ addOrganizations, ] = useAddOrganizationsMutation()
  
  let schema;
  
  if (isCustomOrg){
    schema = yup.object().shape({
      position: yup.string()
      .required("Должность обязательна")
      .max(100, "Должность должна иметь меньше 64 букв"),
      is_main_affiliation: yup.mixed(),
      orgTitle: yup.string()
      .required("Название организации обязательно")
      .test(
        "Организация с таким названием уже представлена в списке",
        "Организация с таким названием уже представлена в списке",
        orgTitle => isOrganizationValid(organizations, orgTitle)),
    });
  }
  else {
    schema = yup.object().shape({
      position: yup.string()
      .required("Должность обязательна")
      .max(100, "Должность должна иметь меньше 64 букв"),
      is_main_affiliation: yup.mixed(),
      org: yup.string()
      .required("Нужно выбрать организацию"),
    });
  }

  let initialValues;

  if (isCustomOrg){
    initialValues = {
      position: "",
      is_main_affiliation: false,
      orgTitle: "",
    }
  }
  else{
    initialValues = {
      position: "",
      is_main_affiliation: false,
      org: "",
    }
  }

  let onSubmit;

  if (isCustomOrg){
    onSubmit = async (values, {setSubmitting}) => {
      setSubmitting(true);
      addOrganizations({title: values.orgTitle})
        .unwrap()
        .catch(err => console.error("resource organizations has not been posted", err))
        .then((payload) => {
          return addAffiliations({
            organization: payload.id,
            position: values.position,
            is_main_affiliation: values.is_main_affiliation
          })
        })
        .catch(err => console.error("resource affiliations has not been posted", err))
        .then(res => setSubmitting(false))
    }
  }
  else{
    onSubmit = async (values, {setSubmitting}) => {
      setSubmitting(true);
      addAffiliations({
        organization: values.org,
        position: values.position,
        is_main_affiliation: values.is_main_affiliation
      })
      .unwrap()
      .catch(err => console.error("resource affiliations has not been posted", err))
      .then(res => setSubmitting(false))
    }
  }
  return(
    <div className="add-affiliation-to-user">
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={initialValues}
      >
      {({values, handleSubmit, handleBlur, handleChange, touched, errors}) =>
        <Form>
        <Row>
          {isCustomOrg ? 
            <Form.Group as={Col} md="5" className="mb-2" controlId="validationFormik00">
              <Form.Label>Организация</Form.Label>
              <Form.Control
                type="text"
                name="orgTitle"
                value={values.orgTitle}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={touched.orgTitle && !!errors.orgTitle}
                />
              <Form.Text muted>
                <a
                    onClick={() => setIsCustomOrg(false)}
                    className="">
                    Выбрать организацию из базы данных  
                </a> 
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.orgTitle}
              </Form.Control.Feedback>
            </Form.Group>
            :
            <Form.Group as={Col} md="5" className="mb-2" controlId="validationFormik00">
              <Form.Label>Организация</Form.Label>
              <Form.Select
                type="text"
                name="org"
                value={values.org}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={touched.org && !!errors.org}
                >
                <option value=""></option>
                {organizations.map(org => 
                  <option key={org.id} value={org.id}>{org.title}</option>
                )}
              </Form.Select>
              <Form.Text muted>
                <a
                    onClick={() => setIsCustomOrg(true)}
                    className="">
                    Добавить организацию не из списка  
                </a> 
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.org}
              </Form.Control.Feedback>
            </Form.Group>
          }
          <Form.Group as={Col} md="7" className="mb-2" controlId="validationFormik00">
            <Form.Label>Позиция</Form.Label>
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
            <Button onClick={handleSubmit}>Отправить</Button>
          </div>
        </Form>}
      </Formik>
    </div>
  )
} 