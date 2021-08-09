import {React} from 'react'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col } from "react-bootstrap";
import { Formik,  Field } from "formik";
import { mutateAttentively } from "../../utils";

import * as yup from "yup";

export const EventOrganizationsListItem = ({eventOrganization, organization, deleteEventOrganization, updateEventOrganization}) => {

  const schema = yup.object().shape({
    role_description: yup.string()
        .max(100, "Описание роли организации в мероприятии должно иметь меньше 100 букв"),
    role: yup.string()
        .required("Роль организации обязательна"),
  });

  return(
    <div className="eventOrganization-to-event">
      <Formik
        validationSchema={schema}
        onSubmit={async (values, {setSubmitting}) => {
          mutateAttentively(() => updateEventOrganization({id: eventOrganization.id, ...values}), "eventOrganization")
        }}
        initialValues={{
            role_description: eventOrganization.role_description,
            role: eventOrganization.role,
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
            <Form.Label>Описание роли организации</Form.Label>
            <Form.Control md="5"
              type="text"
              name="role_description"
              placeholder="Спонсор"
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
              <Field className="form-check-input"  type="radio" name="role" value="MAIN_ORGANIZER" />
            </label>
            <label>
              <span>
              Соорганизатор
              </span>
                <Field className="form-check-input" type="radio" name="role" value="CO_ORGANIZER" />
            </label>
        </Form.Group>
          <div className="edit-delete-buttons">
            <Button onClick={handleSubmit}>Сохранить</Button>
            <Button onClick={() => deleteEventOrganization(eventOrganization.id)}>Удалить</Button>
          </div>
        </Form>}
      </Formik>
    </div>
  )
} 