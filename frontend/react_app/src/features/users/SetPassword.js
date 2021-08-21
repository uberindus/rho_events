import React from 'react'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from "formik";
import * as yup from "yup";
import { useSetPasswordMutation } from '../../api';
import { translateErrors } from '../../utils';
import { ErrorMessage } from '../general/ErrorMessage';
import { useHistory } from 'react-router-dom';

const password_errors_translation = new Map()
password_errors_translation.set("The password is too similar to the email address.", "Пароль слишком похож на электронную почту")
password_errors_translation.set("The password is too similar to the first name.", "Пароль слишком похож на имя")

const current_password_errors_translation = new Map()
current_password_errors_translation.set('Invalid password.', "Неверный текущий пароль")


const translation_dictionary = {
  new_password: password_errors_translation,
  current_password: current_password_errors_translation
}

export const SetPassword = () => {
    
  const [setPassword, { error, isSuccess }] = useSetPasswordMutation()
  
  const history = useHistory();

  const schema = yup.object().shape({
      new_password: yup.string()
        .min(8, "Пароль должен быть длиннее 8 знаков")
        .required("Пароль обязателен"),
      re_new_password: yup.string()
        .required("Подтверждение пароля обязателено")
        .oneOf([yup.ref('new_password'), null], 'Пароли должны совпадать'),
      current_password: yup.string()
        .min(8, "Пароль должен быть длиннее 8 знаков")
        .required("Пароль обязателен"),
    });
    if (isSuccess){
      history.push("/cabinet"); 
      return null
    }
    else {
      return (
        <React.Fragment>
        <ErrorMessage 
          isFailed={error}
          error={Object.values(translateErrors(error ? error.data: undefined, translation_dictionary))}/>
        <Formik
          validationSchema={schema}
          onSubmit = {async (values, {setSubmitting}) => {
            setSubmitting(true);
            setPassword(values)
              .unwrap()
              .catch(err => console.error("Setting new password is failed", err))
              .then(res => {setSubmitting(false)})
          }}
          initialValues={{
            new_password: "",
            re_new_password: "",
            current_password: "",
          }}
        >
          {({handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-2" controlId="validationFormik00">
                <Form.Label>Текущий пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="current_password"
                  placeholder=""
                  value={values.current_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.current_password && !!errors.current_password}
                  isValid={touched.current_password && !errors.current_password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.current_password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="validationFormik00">
                <Form.Label>Новый пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="new_password"
                  placeholder=""
                  value={values.new_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.new_password && !!errors.new_password}
                  isValid={touched.new_password &&!errors.new_password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.new_password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="validationFormik00">
                <Form.Label>Подтверждение нового пароля</Form.Label>
                <Form.Control
                  type="password"
                  name="re_new_password"
                  placeholder=""
                  value={values.re_new_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.re_new_password && !!errors.re_new_password}
                  isValid={touched.re_new_password &&!errors.re_new_password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.re_new_password}
                </Form.Control.Feedback>
              </Form.Group>
              <Button className="base-background-colour" disabled={isSubmitting} type="submit">Далее</Button>
            </Form>
          )}
        </Formik>
        </React.Fragment>
      )
  } 
}