import React from 'react'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col } from "react-bootstrap";
import { useFormik } from "formik";

import * as yup from "yup";

import { useAddEventsMutation } from "../../api";
import { DatePickerField } from "../general/DatePickerField"

import { ErrorMessage } from "../general/ErrorMessage";
import { dateToYMD } from '../../utils';
import { useHistory } from 'react-router';

export const AddEvent = ({user}) => {
  
  const [addEvents, { error }] = useAddEventsMutation()

  const today = new Date()
  const schema = yup.object().shape({
    title: yup.string()
      .required("Название мероприятия обязательно")
      .min(2, "Название должно иметь больше двух букв")
      .max(100, "Название должно иметь меньше 100 букв"),
    date_begin: yup.date().
      test({
        message: "Дата начала должна быть не раньше сегодня",
        test: (date_begin, testContext) => date_begin >= today - 1000 * 60 * 60 * 24
      }),
    date_end: yup.date()
      .test({
        message: "Дата конца должна быть не раньше даты начала",
        test: (date_end, testContext) => date_end >= testContext.parent.date_begin - 1000 * 60 * 60 * 24
    }),
    place: yup.string(),
    brief_description: yup.string()
      .required("Региональный отделение обязателено")
      .max(300, "Описание должно иметь меньше 300 букв"),
    full_description: yup.string()
      .required("Академическое звание обязателено")
      .max(8000, "Описание должно иметь меньше 8000 букв"),
    site: yup.string().url()
  });

  const history = useHistory()
  const formik = useFormik({
    validationSchema: schema,
    onSubmit: async (values, {setSubmitting}) => {
      const date_begin = dateToYMD(values.date_begin)
      const date_end = dateToYMD(values.date_end)
      setSubmitting(true);
      addEvents({...values, date_begin, date_end})
        .unwrap()
        .catch(err => console.error("Creation of event is failed", err))
        .then(payload => {
          history.push(`/edit-event/${payload.id}`)
        })
    },
    initialValues:{
      title: "",
      date_begin: new Date(),
      date_end: new Date(),
      place: "",
      brief_description: "",
      full_description: "",
      site: "",
    }
  });
  return(      
  <div className="add-event">
    <ErrorMessage
      isFailed={formik.errors.date_end}
      message="Дата конца должна быть не раньше даты начала"
    />
    <ErrorMessage
      isFailed={formik.errors.date_begin}
      message="Дата начала должна быть не позже сегодняшнего дня"
    />
    <Form>
    <Form.Group className="mb-2" controlId="validationFormik00">
        <Form.Label>Название мероприятия</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.title && !!formik.errors.title}
          isValid={formik.touched.title && !formik.errors.title}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.title}
        </Form.Control.Feedback>
      </Form.Group>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationFormik02">
          <Form.Label>Дата начала</Form.Label>
          <DatePickerField
            name="date_begin"
            value={formik.values.date_begin}
            onChange={formik.setFieldValue}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationFormik01">
          <Form.Label>Дата конца</Form.Label>
          <DatePickerField
            name="date_end"
            value={formik.values.date_end}
            onChange={formik.setFieldValue}
          />
        </Form.Group>
      </Row>
      <Form.Group className="mb-2 md-4"  controlId="validationFormik02">
          <Form.Label>Место проведения</Form.Label>
          <Form.Control
            type="text"
            name="place"
            value={formik.values.place}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            isInvalid={formik.touched.place && !!formik.errors.place}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.place}
          </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-2 md-4" controlId="validationFormik02">
          <Form.Label>Сайт мероприятия</Form.Label>
          <Form.Control
            type="text"
            name="site"
            value={formik.values.site}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            isInvalid={formik.touched.site && !!formik.errors.site}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.site}
          </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="validationFormik02">
        <Form.Label>Краткое описание</Form.Label>
        <Form.Control
            as="textarea"
            rows={3}
            name="brief_description"
            value={formik.values.brief_description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            isInvalid={formik.touched.brief_description && !!formik.errors.brief_description}
        />
        <Form.Control.Feedback type="invalid">
            {formik.errors.brief_description}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group  className="mb-2" controlId="validationFormik02">
        <Form.Label>Описание</Form.Label>
        <Form.Control
            as="textarea"
            rows={6}
            name="full_description"
            value={formik.values.full_description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            isInvalid={formik.touched.full_description && !!formik.errors.full_description}
        />
        <Form.Control.Feedback type="invalid">
            {formik.errors.full_description}
        </Form.Control.Feedback>
      </Form.Group>

      <Button className="base-background-colour" onClick={formik.handleSubmit} type="submit">Отправить</Button>
    </Form>
  </div>
  );
}