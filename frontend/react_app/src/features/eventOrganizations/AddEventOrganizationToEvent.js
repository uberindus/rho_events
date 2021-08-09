import {React, useState} from 'react'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col } from "react-bootstrap";

import * as yup from "yup";
import { Formik,  Field } from "formik";
  
import { useAddEventOrganizationsMutation, useAddOrganizationsMutation } from "../../api";

function isOrganizationValid(organizations, customOrgTitle){
  let isValid = true
  organizations.forEach(org => {
    if (org.title === customOrgTitle){
      isValid = false 
    }
  })
  return isValid
}

export const AddEventOrganizationToEvent = ({eventId, organizations}) => {
  
  const [isCustomOrg, setIsCustomOrg] = useState(false)
  
  const [ addEventOrganizations, ] = useAddEventOrganizationsMutation()
  const [ addOrganizations, ] = useAddOrganizationsMutation()
  
  let schema;
  
  if (isCustomOrg){
    schema = yup.object().shape({
        role_description: yup.string()
            .max(100, "Описание роли организации в мероприятии должно иметь меньше 100 букв"),
        role: yup.string()
            .required("Роль организации обязательна"),
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
        role_description: yup.string()
            .max(100, "Описание роли организации в мероприятии должно иметь меньше 100 букв"),
        role: yup.string()
        .required("Роль организации обязательна"),
        org: yup.string()
        .required("Нужно выбрать организацию"),
    });
  }

  let initialValues;

  if (isCustomOrg){
    initialValues = {
      role_description: "",
      role: "",
      orgTitle: "",
    }
  }
  else{
    initialValues = {
      role_description: "",
      role: "",
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
          return addEventOrganizations({
            event: eventId,
            organization: payload.id,
            role_description: values.role_description,
            role: values.role
          })
        })
        .catch(err => console.error("resource eventOrganization has not been posted", err))
        .then(res => setSubmitting(false))
    }
  }
  else{
    onSubmit = async (values, {setSubmitting}) => {
      setSubmitting(true);
      addEventOrganizations({
        event: eventId,
        organization: values.org,
        role_description: values.role_description,
        role: values.role
      })
      .unwrap()
      .catch(err => console.error("resource eventOrganization has not been posted", err))
      .then(res => setSubmitting(false))
    }
  }
  return(
    <div className="">
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
            <Form.Label>Описание роли организации</Form.Label>
            <Form.Control md="5"
              type="text"
              name="role_description"
              value={values.role_description}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={touched.role_description && !!errors.role_description}
              />
            <Form.Control.Feedback type="invalid">
              {errors.role_description}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group className="mb-2" className="role-radio" controlId="validationFormik00">
            <label>
              <span>
                Главный организатор
              </span>
              <Field className="form-check-input" type="radio" name="role" value="MAIN_ORGANIZER" />
            </label>
            <label>
              <span>
              Соорганизатор
              </span>
                <Field className="form-check-input" type="radio" name="role" value="CO_ORGANIZER" />
            </label>
        </Form.Group>
          <div className="edit-delete-buttons">
            <Button onClick={handleSubmit}>Отправить</Button>
          </div>
        </Form>}
      </Formik>
    </div>
  )
} 