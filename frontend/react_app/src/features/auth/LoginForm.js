import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Button';
import { Formik } from "formik";

import { login, selectLogginStatus } from "./authSlice"
import { unwrapResult } from '@reduxjs/toolkit';

import { ErrorMessage } from "../general/ErrorMessage";

export const LogginForm = () => {

  const dispatch = useDispatch()

  const [isLoginFailed, setIsLoginFailed] = useState(false)
  
  return (
    <React.Fragment>
      <ErrorMessage isFailed={isLoginFailed} message="Неверные электронная почта или пароль"/>
      <Formik
        onSubmit = {async (values, {setSubmitting}) => {
          setSubmitting(true);
          try{
            const result = await dispatch(login(values))
            unwrapResult(result)
            setIsLoginFailed(false)
          }
          catch(err){
            console.error("Login failed", err);
            setIsLoginFailed(true)
          }
          setSubmitting(false);
        }}
        initialValues={{
          email: "",
          password: "",
        }}
      >
        {({handleSubmit, handleChange, values, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="validationFormik00">
              <Form.Label>Электронная почта</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationFormik02">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Button className="base-background-colour" disabled={isSubmitting} type="submit">Войти</Button>
          </Form>
          
        )}
      </Formik>
    </React.Fragment>
  );
}

export default LogginForm